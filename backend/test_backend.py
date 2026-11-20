import os
import io
import unittest
from app import app
from resume_parser import ResumeParser
from skill_matcher import SkillMatcher
from scorer import ResumeScorer
from career_advisor import CareerAdvisor
from report_generator import PDFReportGenerator

class TestResumeAnalyzerBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.sample_pdf_path = os.path.join(os.path.dirname(__file__), "sample_resume.pdf")
        with open(cls.sample_pdf_path, "rb") as f:
            cls.sample_pdf_bytes = f.read()

    def test_01_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("azure_status", data)
        print("✓ Health check endpoint verified:", data["status"])

    def test_02_job_roles_endpoint(self):
        response = self.client.get("/api/job-roles")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(len(data["roles"]), 5)
        role_titles = [r["title"] for r in data["roles"]]
        self.assertIn("Full Stack Developer", role_titles)
        self.assertIn("Python Developer", role_titles)
        self.assertIn("Data Analyst", role_titles)
        self.assertIn("AI/ML Engineer", role_titles)
        self.assertIn("Java Developer", role_titles)
        print(f"✓ Job roles endpoint verified ({len(role_titles)} roles found)")

    def test_03_parser_direct(self):
        parser = ResumeParser()
        result = parser.parse_pdf(self.sample_pdf_path)
        self.assertTrue(result["success"])
        self.assertEqual(result["candidate_name"], "John Doe")
        self.assertEqual(result["email"], "john.doe@example.com")
        self.assertIn("B.Tech", result["education"])
        self.assertIn("2+ Years", result["experience"])
        print(f"✓ Resume parser verified: {result['candidate_name']}, {result['education']}, {result['experience']}")

    def test_04_skill_matcher_and_scorer(self):
        parser = ResumeParser()
        parsed = parser.parse_pdf(self.sample_pdf_path)
        matcher = SkillMatcher()
        detected = matcher.detect_skills_in_text(parsed["text"])
        self.assertIn("Python", detected["technical"])
        self.assertIn("React", detected["technical"])
        self.assertIn("Node.js", detected["technical"])

        match_res = matcher.match_against_role(detected["all"], "Full Stack Developer", parsed["text"])
        self.assertGreater(match_res["skill_match_percentage"], 50)
        self.assertIn("MongoDB", match_res["missing_required_skills"])
        self.assertIn("Express.js", match_res["missing_required_skills"])

        scorer = ResumeScorer()
        score_res = scorer.calculate_score(parsed, match_res, detected)
        self.assertGreaterEqual(score_res["overall_score"], 60)
        self.assertLessEqual(score_res["overall_score"], 100)
        print(f"✓ Matcher & Scorer verified: Score = {score_res['overall_score']}/100, Match = {match_res['skill_match_percentage']}%")

    def test_05_analyze_api_multiple_roles(self):
        roles_to_test = [
            "Full Stack Developer",
            "Python Developer",
            "Data Analyst",
            "AI/ML Engineer",
            "Java Developer"
        ]
        for role in roles_to_test:
            data = {
                "role": role,
                "resume": (io.BytesIO(self.sample_pdf_bytes), "sample_resume.pdf")
            }
            response = self.client.post("/api/analyze", data=data, content_type="multipart/form-data")
            self.assertEqual(response.status_code, 200)
            json_data = response.get_json()
            self.assertTrue(json_data["success"])
            self.assertEqual(json_data["overview"]["target_role"], role)
            self.assertIn("scoring", json_data)
            self.assertIn("matching", json_data)
            self.assertIn("roadmap", json_data)
            self.assertGreater(len(json_data["roadmap"]), 0)
        print("✓ All 5 roles successfully analyzed via API with valid scores and dynamic roadmaps")

    def test_06_report_generation(self):
        data = {
            "role": "Full Stack Developer",
            "resume": (io.BytesIO(self.sample_pdf_bytes), "sample_resume.pdf")
        }
        res_analyze = self.client.post("/api/analyze", data=data, content_type="multipart/form-data")
        analysis_json = res_analyze.get_json()

        response = self.client.post("/api/download-report", json=analysis_json)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "application/pdf")
        self.assertGreater(len(response.data), 1000)
        print(f"✓ POST /api/download-report verified: Generated {len(response.data)} bytes PDF")

    def test_07_invalid_inputs(self):
        # Missing role
        res1 = self.client.post("/api/analyze", data={"resume": (io.BytesIO(self.sample_pdf_bytes), "test.pdf")})
        self.assertEqual(res1.status_code, 400)

        # Invalid file type
        res2 = self.client.post("/api/analyze", data={"role": "Full Stack Developer", "resume": (io.BytesIO(b"Hello world"), "test.txt")})
        self.assertEqual(res2.status_code, 400)

        # Empty PDF
        res3 = self.client.post("/api/analyze", data={"role": "Full Stack Developer", "resume": (io.BytesIO(b""), "empty.pdf")})
        self.assertEqual(res3.status_code, 400)

        # Oversized file (>5MB)
        large_bytes = b"0" * (6 * 1024 * 1024)
        res4 = self.client.post("/api/analyze", data={"role": "Full Stack Developer", "resume": (io.BytesIO(large_bytes), "large.pdf")})
        self.assertEqual(res4.status_code, 413)

        print("✓ Validation and error handling verified (empty, missing role, invalid extension, oversized file)")

if __name__ == "__main__":
    unittest.main()
