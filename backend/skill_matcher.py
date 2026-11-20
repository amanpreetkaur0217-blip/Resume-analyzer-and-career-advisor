import re
import json
import os
from typing import Dict, List, Set, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class SkillMatcher:
    """
    Identifies technical and soft skills in resume text, normalizes them,
    compares against target job roles, and calculates compatibility metrics.
    """

    # Comprehensive skill aliases mapping canonical skill name -> regex patterns / aliases
    SKILL_ALIASES = {
        # Web & Frontend
        "HTML": [r"\bhtml5?\b"],
        "CSS": [r"\bcss3?\b", r"\btailwind\b", r"\bbootstrap\b", r"\bsass\b"],
        "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b", r"\becmascript\b"],
        "TypeScript": [r"\btypescript\b", r"\bts\b"],
        "React": [r"\breact(?:\.js|js)?\b"],
        "Next.js": [r"\bnext(?:\.js|js)?\b"],
        "Redux": [r"\bredux\b"],
        "Tailwind CSS": [r"\btailwind(?:css)?\b"],
        
        # Backend & APIs
        "Node.js": [r"\bnode(?:\.js|js)?\b"],
        "Express.js": [r"\bexpress(?:\.js|js)?\b"],
        "REST API": [r"\brest(?:ful)?\s*apis?\b", r"\brest\s*api\b", r"\brestful\b", r"\bweb\s*apis?\b", r"\bapi\s*development\b"],
        "GraphQL": [r"\bgraphql\b"],
        "FastAPI": [r"\bfastapi\b"],
        "Flask": [r"\bflask\b"],
        "Django": [r"\bdjango\b"],
        "Spring Boot": [r"\bspring\s*boot\b", r"\bspringboot\b", r"\bspring\s*framework\b"],
        "JDBC": [r"\bjdbc\b"],
        "Hibernate": [r"\bhibernate\b"],
        
        # Programming Languages
        "Python": [r"\bpython3?\b"],
        "Java": [r"(?<!script)\bjava\b(?!script)"],
        "C++": [r"\bc\+\+\b"],
        "C#": [r"\bc#\b", r"\bcsharp\b"],
        "SQL": [r"\bsql\b", r"\bmysql\b", r"\bpostgresql\b", r"\bsqlite\b", r"\boracle\s*db\b"],
        "OOP": [r"\boop\b", r"\bobject[\s-]oriented(?:\s+programming)?\b"],
        
        # Databases & Storage
        "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
        "PostgreSQL": [r"\bpostgres(?:ql)?\b"],
        "Redis": [r"\bredis\b"],
        
        # Data Analysis & BI
        "Excel": [r"\bexcel\b", r"\bms[\s-]excel\b", r"\bpivot\s*tables?\b", r"\bxlookup\b"],
        "Power BI": [r"\bpower\s*bi\b", r"\bpowerbi\b"],
        "Tableau": [r"\btableau\b"],
        "Pandas": [r"\bpandas\b"],
        "NumPy": [r"\bnumpy\b"],
        "Statistics": [r"\bstatistics\b", r"\bstatistical\s*analysis\b", r"\bhypothesis\s*testing\b", r"\bprobability\b"],
        "Data Visualization": [r"\bdata\s*visualization\b", r"\bmatplotlib\b", r"\bseaborn\b", r"\bcharts?\b"],
        
        # AI / ML
        "Machine Learning": [r"\bmachine\s*learning\b", r"\bml\b", r"\bsupervised\s*learning\b", r"\brandom\s*forest\b", r"\bxgboost\b"],
        "Deep Learning": [r"\bdeep\s*learning\b", r"\bneural\s*networks?\b", r"\bcnn\b", r"\brnn\b", r"\btransformers?\b"],
        "TensorFlow": [r"\btensorflow\b", r"\bkeras\b"],
        "PyTorch": [r"\bpytorch\b"],
        "Scikit-learn": [r"\bscikit[\s-]learn\b", r"\bsklearn\b"],
        "NLP": [r"\bnlp\b", r"\bnatural\s*language\s*processing\b"],
        "Computer Vision": [r"\bcomputer\s*vision\b", r"\bopencv\b"],
        
        # DevOps & Cloud & Tools
        "Git": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
        "Docker": [r"\bdocker\b", r"\bcontainerization\b"],
        "AWS": [r"\baws\b", r"\bamazon\s*web\s*services\b"],
        "Azure AI": [r"\bazure\s*ai\b", r"\bazure\b"],
        "Linux": [r"\blinux\b", r"\bubuntu\b", r"\bbash\b"],
        "CI/CD": [r"\bci[\/\-]cd\b", r"\bcontinuous\s*integration\b"]
    }

    SOFT_SKILLS = {
        "Problem Solving": [r"\bproblem[\s-]solving\b", r"\balgorithmic\s*thinking\b"],
        "Communication": [r"\bcommunication(?:\s+skills)?\b", r"\bpresentation\b"],
        "Agile Methodology": [r"\bagile\b", r"\bscrum\b", r"\bsprint\b"],
        "Collaboration": [r"\bcollaboration\b", r"\bteam\s*player\b", r"\bteamwork\b"],
        "Code Review": [r"\bcode\s*reviews?\b", r"\bclean\s*code\b"],
        "Data Storytelling": [r"\bdata\s*storytelling\b", r"\bbusiness\s*insights\b"],
        "Critical Thinking": [r"\bcritical\s*thinking\b", r"\banalytical\s*mindset\b"],
        "Leadership": [r"\bleadership\b", r"\bmentoring\b"]
    }

    def __init__(self, job_roles_file: str = None):
        if job_roles_file is None:
            job_roles_file = os.path.join(os.path.dirname(__file__), "job_roles.json")
        self.job_roles = self._load_job_roles(job_roles_file)

    def _load_job_roles(self, filepath: str) -> Dict[str, Any]:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("roles", {})
        except Exception as e:
            raise RuntimeError(f"Failed to load job_roles.json: {e}")

    def get_supported_roles(self) -> List[Dict[str, Any]]:
        """Returns list of supported job roles with high-level details."""
        roles_list = []
        for role_name, role_info in self.job_roles.items():
            roles_list.append({
                "id": role_info.get("id"),
                "title": role_name,
                "description": role_info.get("description"),
                "category": role_info.get("category"),
                "required_skills": role_info.get("required_skills", []),
                "preferred_skills": role_info.get("preferred_skills", [])
            })
        return roles_list

    def detect_skills_in_text(self, text: str, additional_phrases: List[str] = None) -> Dict[str, List[str]]:
        """
        Scans resume text and key phrases for technical and soft skills.
        Avoids false positives with boundary checking.
        """
        detected_technical = set()
        detected_soft = set()

        text_lower = text.lower()
        phrases_text = " ".join(additional_phrases).lower() if additional_phrases else ""
        combined_text = f"{text_lower}\n{phrases_text}"

        # Match technical skills
        for skill_name, patterns in self.SKILL_ALIASES.items():
            for pattern in patterns:
                if re.search(pattern, combined_text, re.IGNORECASE):
                    detected_technical.add(skill_name)
                    break

        # Match soft skills
        for skill_name, patterns in self.SOFT_SKILLS.items():
            for pattern in patterns:
                if re.search(pattern, combined_text, re.IGNORECASE):
                    detected_soft.add(skill_name)
                    break

        return {
            "technical": sorted(list(detected_technical)),
            "soft": sorted(list(detected_soft)),
            "all": sorted(list(detected_technical | detected_soft))
        }

    def match_against_role(
        self,
        detected_skills: List[str],
        role_name: str,
        resume_text: str = ""
    ) -> Dict[str, Any]:
        """
        Compares candidate's detected skills against target job role requirements.
        Calculates:
        - Matched required skills
        - Missing required skills
        - Matched preferred skills
        - Skill match percentage: (Matched Required / Total Required) * 100
        - TF-IDF Cosine Similarity
        """
        if role_name not in self.job_roles:
            raise ValueError(f"Job role '{role_name}' is not supported. Supported roles: {list(self.job_roles.keys())}")

        role_data = self.job_roles[role_name]
        required_skills = role_data.get("required_skills", [])
        preferred_skills = role_data.get("preferred_skills", [])

        detected_set = set(detected_skills)
        matched_required = [s for s in required_skills if s in detected_set]
        missing_required = [s for s in required_skills if s not in detected_set]
        matched_preferred = [s for s in preferred_skills if s in detected_set]

        total_req = len(required_skills)
        match_percentage = round((len(matched_required) / total_req * 100)) if total_req > 0 else 0

        # Optional Scikit-learn TF-IDF Cosine Similarity for contextual relevance
        similarity_score = self._calculate_semantic_similarity(resume_text, role_data)

        return {
            "role_name": role_name,
            "role_description": role_data.get("description", ""),
            "total_required_count": total_req,
            "matched_required_skills": matched_required,
            "matched_required_count": len(matched_required),
            "missing_required_skills": missing_required,
            "missing_required_count": len(missing_required),
            "matched_preferred_skills": matched_preferred,
            "skill_match_percentage": match_percentage,
            "semantic_similarity_percentage": similarity_score,
            "formula_explanation": f"({len(matched_required)} matched / {total_req} required) * 100 = {match_percentage}%"
        }

    def _calculate_semantic_similarity(self, resume_text: str, role_data: Dict[str, Any]) -> int:
        """
        Computes TF-IDF cosine similarity between resume text and job profile representation.
        Provides semantic context score (0 - 100) alongside exact skill matching.
        """
        if not resume_text or len(resume_text.strip()) < 50:
            return 0

        try:
            # Build representative job text
            role_text = (
                f"{role_data.get('title', '')}. {role_data.get('description', '')}. "
                f"Skills: {' '.join(role_data.get('required_skills', []))} "
                f"{' '.join(role_data.get('preferred_skills', []))} "
                f"{' '.join(role_data.get('soft_skills', []))}"
            )

            vectorizer = TfidfVectorizer(stop_words="english", max_features=500)
            tfidf_matrix = vectorizer.fit_transform([resume_text, role_text])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Scale to 0-100 range
            return int(round(sim * 100))
        except Exception:
            return 50
