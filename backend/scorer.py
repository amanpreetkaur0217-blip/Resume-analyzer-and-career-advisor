import re
from typing import Dict, List, Any


class ResumeScorer:
    """
    Transparent, rule-based resume scoring engine (Max 100 points).
    Evaluates:
    1. Skills Relevance (30 pts)
    2. Projects & Portfolio (20 pts)
    3. Education (15 pts)
    4. Experience & Internships (15 pts)
    5. Structure & Formatting (10 pts)
    6. Achievements & Certifications (10 pts)
    """

    def calculate_score(
        self,
        parsed_resume: Dict[str, Any],
        skill_match_result: Dict[str, Any],
        detected_skills: Dict[str, List[str]]
    ) -> Dict[str, Any]:
        text = parsed_resume.get("text", "")
        sections = parsed_resume.get("sections", {})
        text_lower = text.lower()
        word_count = parsed_resume.get("word_count", 0)

        strengths = []
        weaknesses = []
        improvement_suggestions = []

        # 1. Skills Relevance (Max 30 pts)
        req_match_ratio = (
            skill_match_result["matched_required_count"] / skill_match_result["total_required_count"]
            if skill_match_result["total_required_count"] > 0 else 0
        )
        base_skill_pts = round(req_match_ratio * 24)
        pref_bonus = min(6, len(skill_match_result.get("matched_preferred_skills", [])) * 2)
        score_skills = min(30, base_skill_pts + pref_bonus)

        if score_skills >= 22:
            strengths.append(f"Strong alignment with core {skill_match_result['role_name']} skills ({len(skill_match_result['matched_required_skills'])} matched).")
        else:
            missing_preview = ", ".join(skill_match_result["missing_required_skills"][:3])
            weaknesses.append(f"Significant skill gaps for target role. Missing: {missing_preview}.")
            improvement_suggestions.append(f"Add target role skills to your resume: {missing_preview}.")

        # 2. Projects & Portfolio (Max 20 pts)
        score_projects = 0
        has_projects_sec = sections.get("projects", False) or bool(re.search(r"(?i)\b(projects?|capstone|portfolio)\b", text))
        if has_projects_sec:
            score_projects += 8
            strengths.append("Dedicated projects section highlighting practical technical application.")
        else:
            weaknesses.append("No clearly defined Projects section detected.")
            improvement_suggestions.append("Add a dedicated 'Projects' section showcasing 2-3 end-to-end applications.")

        # Project action verbs
        action_verbs = ["built", "developed", "deployed", "implemented", "designed", "created", "architected", "optimized", "integrated"]
        action_verb_count = sum(1 for verb in action_verbs if re.search(r"\b" + verb + r"\b", text_lower))
        if action_verb_count >= 3:
            score_projects += 6
        elif action_verb_count >= 1:
            score_projects += 3
        else:
            improvement_suggestions.append("Use strong action verbs (e.g., 'Architected', 'Implemented', 'Deployed') to begin project bullet points.")

        # Metrics & Impact in projects (numbers, percentages, users, speedup)
        metric_matches = re.findall(r"(\d+%\s*|\b\d+\+?\s*(?:users|clients|requests|ms|sec|times|increase|decrease|reduced|improved)\b)", text_lower)
        if metric_matches:
            score_projects += 6
            strengths.append("Includes quantifiable impact and metrics in project descriptions.")
        else:
            weaknesses.append("Lack of quantifiable results in project descriptions.")
            improvement_suggestions.append("Quantify your achievements (e.g., 'reduced API response time by 35%', 'served 500+ active users').")

        score_projects = min(20, score_projects)

        # 3. Education (Max 15 pts)
        score_education = 0
        edu_str = parsed_resume.get("education", "")
        if edu_str and edu_str != "Bachelor's Degree":
            score_education += 10
            strengths.append(f"Clear degree and major specified ({edu_str}).")
        elif sections.get("education", False):
            score_education += 8
        else:
            weaknesses.append("Education section or academic qualification is unclear.")
            improvement_suggestions.append("Explicitly state your degree, major/branch, graduation year, and GPA/percentage.")

        # Check for GPA, CGPA or Year
        has_gpa_or_year = bool(re.search(r"(?i)\b(cgpa|gpa|\d\.\d\d?/\d\d?|\b20\d\d\b)\b", text))
        if has_gpa_or_year:
            score_education += 5

        score_education = min(15, score_education)

        # 4. Experience / Internships (Max 15 pts)
        score_experience = 0
        exp_str = parsed_resume.get("experience", "")
        has_exp_sec = sections.get("experience", False)
        
        if has_exp_sec:
            score_experience += 8
            if "Years" in exp_str or "Internship" in exp_str:
                score_experience += 7
                strengths.append(f"Demonstrated professional experience or internship background ({exp_str}).")
            else:
                score_experience += 4
        else:
            weaknesses.append("No explicit work experience or internship section detected.")
            improvement_suggestions.append("Include relevant internships, open-source contributions, or freelance projects under an Experience heading.")

        score_experience = min(15, score_experience)

        # 5. Resume Structure & Formatting (Max 10 pts)
        score_structure = 0
        if parsed_resume.get("candidate_name") and parsed_resume.get("email"):
            score_structure += 4
            strengths.append("Complete contact and personal details.")
        elif parsed_resume.get("email"):
            score_structure += 2
        else:
            weaknesses.append("Missing standard contact details (Email / Phone).")
            improvement_suggestions.append("Ensure your full name, email, phone number, and LinkedIn/GitHub links are placed at the very top.")

        # Organized sections
        present_sections = [k for k, v in sections.items() if v]
        if len(present_sections) >= 4:
            score_structure += 3
        elif len(present_sections) >= 2:
            score_structure += 2

        # Optimal length (300 to 1200 words)
        if 250 <= word_count <= 1100:
            score_structure += 3
            strengths.append(f"Optimal resume length and density ({word_count} words).")
        elif word_count < 250:
            weaknesses.append("Resume appears too short or sparse.")
            improvement_suggestions.append("Expand on project technical details, responsibilities, and key accomplishments.")
        else:
            weaknesses.append("Resume may be overly verbose (>1100 words).")
            improvement_suggestions.append("Condense bullet points to keep your resume concise (ideally 1 to 2 pages).")

        score_structure = min(10, score_structure)

        # 6. Achievements & Certifications (Max 10 pts)
        score_achievements = 0
        has_cert_sec = sections.get("certifications", False) or bool(re.search(r"(?i)\b(certificat(?:ion|e)|licensed|certified|award|honors?|hackathon|coursera|udemy|aws certified)\b", text))
        
        if has_cert_sec:
            score_achievements += 6
            strengths.append("Includes recognized certifications, awards, or competitive achievements.")
        else:
            weaknesses.append("No certifications or extracurricular achievements found.")
            improvement_suggestions.append("Earn and showcase verifiable industry certifications (e.g., Azure Fundamentals, AWS, HackerRank problem solving).")

        # Check for GitHub / portfolio links
        if re.search(r"(?i)\b(github\.com|gitlab\.com|portfolio|linkedin\.com)\b", text):
            score_achievements += 4
            strengths.append("Active links to professional portfolio or code repositories (GitHub/LinkedIn).")
        else:
            improvement_suggestions.append("Include clickable links to your GitHub profile and live deployed projects.")

        score_achievements = min(10, score_achievements)

        # Calculate total
        total_score = score_skills + score_projects + score_education + score_experience + score_structure + score_achievements

        # Deduplicate recommendations
        clean_suggestions = list(dict.fromkeys(improvement_suggestions))[:6]
        clean_strengths = list(dict.fromkeys(strengths))[:6]
        clean_weaknesses = list(dict.fromkeys(weaknesses))[:5]

        return {
            "overall_score": total_score,
            "max_score": 100,
            "category_scores": {
                "skills_relevance": {
                    "score": score_skills,
                    "max": 30,
                    "label": "Skills Relevance",
                    "percentage": round((score_skills / 30) * 100)
                },
                "projects": {
                    "score": score_projects,
                    "max": 20,
                    "label": "Projects & Portfolio",
                    "percentage": round((score_projects / 20) * 100)
                },
                "education": {
                    "score": score_education,
                    "max": 15,
                    "label": "Education & Academics",
                    "percentage": round((score_education / 15) * 100)
                },
                "experience": {
                    "score": score_experience,
                    "max": 15,
                    "label": "Experience & Internships",
                    "percentage": round((score_experience / 15) * 100)
                },
                "resume_structure": {
                    "score": score_structure,
                    "max": 10,
                    "label": "Structure & Formatting",
                    "percentage": round((score_structure / 10) * 100)
                },
                "achievements": {
                    "score": score_achievements,
                    "max": 10,
                    "label": "Certifications & Achievements",
                    "percentage": round((score_achievements / 10) * 100)
                }
            },
            "strengths": clean_strengths,
            "weaknesses": clean_weaknesses,
            "improvement_suggestions": clean_suggestions,
            "disclaimer": "This is an educational resume quality evaluation designed to assist students and job seekers, not an official ATS screening result or hiring guarantee."
        }
