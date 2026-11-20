import os
import io
import tempfile
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import backend modules
from resume_parser import ResumeParser
from azure_ai import AzureAIService
from skill_matcher import SkillMatcher
from scorer import ResumeScorer
from career_advisor import CareerAdvisor
from report_generator import PDFReportGenerator

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Initialize Flask App
app = Flask(__name__)
# Enable CORS for all routes (frontend communication)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration constants
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE_BYTES

# Instantiate singletons
azure_service = AzureAIService()
resume_parser = ResumeParser(
    azure_doc_endpoint=azure_service.doc_endpoint,
    azure_doc_key=azure_service.doc_key
)
skill_matcher = SkillMatcher()
scorer = ResumeScorer()
career_advisor = CareerAdvisor(skill_matcher.job_roles)
pdf_generator = PDFReportGenerator()


@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Returns backend health status, Python version, and real Azure AI service connectivity.
    """
    azure_status = azure_service.get_service_status()
    return jsonify({
        "status": "healthy",
        "service": "AI Resume Analyzer & Career Advisor Backend",
        "version": "1.0.0",
        "azure_status": azure_status
    }), 200


@app.route("/api/job-roles", methods=["GET"])
def get_job_roles():
    """
    Returns supported job roles and their required/preferred skills.
    """
    roles = skill_matcher.get_supported_roles()
    return jsonify({
        "success": True,
        "count": len(roles),
        "roles": roles
    }), 200


@app.route("/api/analyze", methods=["POST"])
def analyze_resume():
    """
    Main analysis endpoint:
    1. Validates uploaded PDF file and selected role.
    2. Extracts text using PyMuPDF (or Azure Document Intelligence OCR if configured).
    3. Extracts key phrases using Azure AI Language (or local fallback).
    4. Detects skills and matches against target job role.
    5. Calculates transparent rule-based resume score (out of 100).
    6. Generates personalized career guidance and missing-skills learning roadmap.
    7. Returns complete structured JSON.
    """
    # 1. Validation: Check role parameter
    role = request.form.get("role", "").strip()
    if not role:
        return jsonify({"success": False, "error": "Target job role is required."}), 400

    if role not in skill_matcher.job_roles:
        return jsonify({
            "success": False,
            "error": f"Job role '{role}' is not supported. Choose from: {list(skill_matcher.job_roles.keys())}"
        }), 400

    # 2. Validation: Check file presence
    if "resume" not in request.files:
        return jsonify({"success": False, "error": "No resume file was uploaded."}), 400

    file = request.files["resume"]
    filename = file.filename or ""

    if not filename.lower().endswith(".pdf"):
        return jsonify({"success": False, "error": "Invalid file format. Only PDF files are supported."}), 400

    # Read file content safely in memory / temp file
    file_bytes = file.read()
    if len(file_bytes) == 0:
        return jsonify({"success": False, "error": "The uploaded PDF file is empty (0 bytes)."}), 400

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        return jsonify({"success": False, "error": "File size exceeds the 5 MB limit."}), 413

    # Use secure temporary file for PyMuPDF processing with guaranteed cleanup
    temp_pdf = None
    try:
        temp_pdf = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        temp_pdf.write(file_bytes)
        temp_pdf.flush()
        temp_pdf_path = temp_pdf.name
        temp_pdf.close()

        # Step 3: Extract PDF text & metadata
        try:
            parsed_data = resume_parser.parse_pdf(temp_pdf_path)
        except ValueError as ve:
            return jsonify({"success": False, "error": str(ve)}), 422
        except Exception as pe:
            logger.error(f"Error parsing PDF: {pe}")
            return jsonify({"success": False, "error": f"Could not process PDF: {str(pe)}"}), 500

        resume_text = parsed_data.get("text", "")
        if not resume_text or len(resume_text.strip()) < 20:
            return jsonify({
                "success": False,
                "error": "The resume appears to have no readable text content. Please ensure it is not an image-only scan."
            }), 422

        # Step 4: Extract Key Phrases (Azure AI Language or Local Fallback)
        key_phrases_result = azure_service.extract_key_phrases(resume_text)
        key_phrases = key_phrases_result.get("key_phrases", [])

        # Step 5: Skill Extraction & Normalization
        detected_skills = skill_matcher.detect_skills_in_text(resume_text, additional_phrases=key_phrases)

        # Step 6: Match Against Selected Job Role
        skill_match_result = skill_matcher.match_against_role(
            detected_skills=detected_skills["all"],
            role_name=role,
            resume_text=resume_text
        )

        # Step 7: Calculate Rule-Based Resume Quality Score (out of 100)
        score_result = scorer.calculate_score(
            parsed_resume=parsed_data,
            skill_match_result=skill_match_result,
            detected_skills=detected_skills
        )

        # Step 8: Optional Azure AI Foundry Generative Guidance
        foundry_guidance = None
        azure_status = azure_service.get_service_status()
        if azure_status["azure_foundry"]["configured"]:
            foundry_guidance = azure_service.generate_foundry_guidance(
                candidate_name=parsed_data.get("candidate_name", "Candidate"),
                job_role=role,
                matched_skills=skill_match_result["matched_required_skills"],
                missing_skills=skill_match_result["missing_required_skills"],
                resume_score=score_result["overall_score"]
            )

        # Step 9: Generate Dynamic Personalized Learning Roadmap
        roadmap = career_advisor.generate_roadmap(
            role_name=role,
            missing_skills=skill_match_result["missing_required_skills"],
            matched_skills=skill_match_result["matched_required_skills"]
        )

        # Step 10: Generate End-to-End Career Guidance
        career_guidance = career_advisor.generate_career_guidance(
            candidate_name=parsed_data.get("candidate_name", "Candidate"),
            role_name=role,
            matched_skills=skill_match_result["matched_required_skills"],
            missing_skills=skill_match_result["missing_required_skills"],
            resume_score=score_result["overall_score"],
            experience_str=parsed_data.get("experience", "Fresher / Entry-Level"),
            azure_foundry_guidance=foundry_guidance
        )

        # Step 11: Assemble Final Response
        response_payload = {
            "success": True,
            "filename": filename,
            "file_size_kb": round(len(file_bytes) / 1024, 1),
            "overview": {
                "candidate_name": parsed_data.get("candidate_name"),
                "email": parsed_data.get("email"),
                "phone": parsed_data.get("phone"),
                "education": parsed_data.get("education"),
                "experience": parsed_data.get("experience"),
                "target_role": role,
                "pages_count": parsed_data.get("pages_count", 1),
                "word_count": parsed_data.get("word_count", 0)
            },
            "scoring": score_result,
            "matching": skill_match_result,
            "detected_skills": detected_skills,
            "roadmap": roadmap,
            "career_guidance": career_guidance,
            "engine_info": {
                "key_phrase_provider": key_phrases_result.get("provider"),
                "is_azure_language": key_phrases_result.get("is_azure", False),
                "advisor_provider": career_guidance.get("advisor_provider"),
                "is_azure_foundry": career_guidance.get("is_azure_powered", False),
                "ocr_provider": "PyMuPDF Direct Extraction" if not parsed_data.get("is_scanned") else "Azure Document Intelligence",
                "active_mode": "Azure AI Connected" if key_phrases_result.get("is_azure") else "Local Fallback Engine"
            }
        }

        return jsonify(response_payload), 200

    finally:
        # Guarantee deletion of uploaded temporary file
        if temp_pdf and os.path.exists(temp_pdf_path):
            try:
                os.remove(temp_pdf_path)
            except Exception as e:
                logger.warning(f"Failed to remove temp file {temp_pdf_path}: {e}")


@app.route("/api/generate-roadmap", methods=["POST"])
def generate_custom_roadmap():
    """
    Regenerates a learning roadmap dynamically based on updated missing skills or selected role.
    """
    data = request.get_json() or {}
    role = data.get("role")
    missing_skills = data.get("missing_skills", [])
    matched_skills = data.get("matched_skills", [])

    if not role or role not in skill_matcher.job_roles:
        return jsonify({"success": False, "error": "Valid job role is required."}), 400

    roadmap = career_advisor.generate_roadmap(role, missing_skills, matched_skills)
    return jsonify({
        "success": True,
        "role": role,
        "roadmap": roadmap
    }), 200


@app.route("/api/download-report", methods=["POST"])
def download_report():
    """
    Generates and downloads a polished PDF report from the analysis data.
    """
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"success": False, "error": "Invalid analysis data provided."}), 400

    try:
        pdf_buffer = pdf_generator.generate_pdf_report(data)
        cand_name = data.get("overview", {}).get("candidate_name", "Candidate").replace(" ", "_")
        role_name = data.get("overview", {}).get("target_role", "Job").replace(" ", "_")
        download_name = f"Resume_Analysis_{cand_name}_{role_name}.pdf"

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=download_name
        )
    except Exception as e:
        logger.error(f"Error generating PDF report: {e}")
        return jsonify({"success": False, "error": f"Failed to generate report: {str(e)}"}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"success": False, "error": "File size exceeds the 5 MB limit."}), 413


@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "API route not found."}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error occurred."}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    logger.info(f"Starting Resume Analyzer Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=debug)
