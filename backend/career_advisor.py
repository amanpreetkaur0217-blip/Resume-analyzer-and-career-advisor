import os
import json
from typing import Dict, List, Any


class CareerAdvisor:
    """
    Generates personalized career recommendations and dynamic learning roadmaps
    based on the candidate's actual missing skills, existing skills, and target job role.
    """

    def __init__(self, job_roles_data: Dict[str, Any] = None):
        if job_roles_data is None:
            roles_file = os.path.join(os.path.dirname(__file__), "job_roles.json")
            try:
                with open(roles_file, "r", encoding="utf-8") as f:
                    self.job_roles = json.load(f).get("roles", {})
            except Exception:
                self.job_roles = {}
        else:
            self.job_roles = job_roles_data

    def generate_roadmap(
        self,
        role_name: str,
        missing_skills: List[str],
        matched_skills: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Builds a customized week-by-week learning roadmap strictly tailored to missing skills.
        Sequence: Foundations -> Core Frameworks -> Databases -> Integrated Capstone Project.
        """
        role_data = self.job_roles.get(role_name, {})
        catalog = role_data.get("roadmap_catalog", {})

        roadmap = []
        week_counter = 1

        # 1. Process missing required skills first
        if not missing_skills:
            # If all required skills are already present, provide an advanced mastery track
            advanced_milestones = [
                {
                    "weeks": "Week 1-2",
                    "skill": "Advanced Architecture",
                    "title": f"Advanced {role_name} System Design & Performance Profiling",
                    "description": f"Deepen architectural knowledge with design patterns, latency reduction, and high-availability patterns for {role_name}.",
                    "priority": "High Priority",
                    "resources": [
                        {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer"},
                        {"name": "Martin Fowler Architecture Guide", "url": "https://martinfowler.com/architecture/"}
                    ],
                    "milestone_project": "Design and document a high-throughput microservice architecture with C4 diagrams.",
                    "completed": False
                },
                {
                    "weeks": "Week 3-4",
                    "skill": "Containerization & Cloud",
                    "title": "Docker, Kubernetes & Cloud Native Deployment",
                    "description": "Containerize backend services, manage multi-container orchestration, and deploy to cloud environments.",
                    "priority": "High Priority",
                    "resources": [
                        {"name": "Docker Official Getting Started", "url": "https://docs.docker.com/get-started/"},
                        {"name": "Kubernetes Basics", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/"}
                    ],
                    "milestone_project": "Write multi-stage Dockerfiles and deploy services using Docker Compose with health checks.",
                    "completed": False
                },
                {
                    "weeks": "Week 5-6",
                    "skill": "CI/CD & Observability",
                    "title": "Automated Testing, CI/CD Pipelines & Monitoring",
                    "description": "Set up continuous integration with automated test suites, code coverage reports, and distributed logging.",
                    "priority": "Medium",
                    "resources": [
                        {"name": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions"},
                        {"name": "Prometheus & Grafana Basics", "url": "https://prometheus.io/docs/introduction/overview/"}
                    ],
                    "milestone_project": "Implement a full GitHub Actions workflow running automated linting, tests, and build triggers.",
                    "completed": False
                }
            ]
            roadmap.extend(advanced_milestones)
            week_counter = 7
        else:
            for skill in missing_skills:
                if skill in catalog:
                    item = catalog[skill].copy()
                    end_week = week_counter + 1
                    item["weeks"] = f"Week {week_counter}-{end_week}"
                    item["skill"] = skill
                    item["completed"] = False
                    roadmap.append(item)
                    week_counter += 2
                else:
                    # Custom fallback for skills not in catalog
                    end_week = week_counter + 1
                    roadmap.append({
                        "weeks": f"Week {week_counter}-{end_week}",
                        "skill": skill,
                        "title": f"Mastering {skill} Fundamentals & Best Practices",
                        "description": f"Learn core concepts, syntax, and real-world application of {skill} for {role_name}.",
                        "priority": "High Priority",
                        "resources": [
                            {"name": f"Official {skill} Documentation", "url": "https://devdocs.io/"},
                            {"name": "freeCodeCamp / Tutorials", "url": "https://www.freecodecamp.org/"}
                        ],
                        "milestone_project": f"Build a practical module implementing {skill} with clean error handling.",
                        "completed": False
                    })
                    week_counter += 2

        # 2. Always ensure a Capstone Project milestone at the end
        capstone_end = week_counter + 1
        roadmap.append({
            "weeks": f"Week {week_counter}-{capstone_end}",
            "skill": "Integrated Project",
            "title": f"Build & Deploy Full {role_name} Capstone Application",
            "description": f"Combine your existing skills ({', '.join(matched_skills[:3]) if matched_skills else 'core tools'}) with newly acquired skills ({', '.join(missing_skills[:3]) if missing_skills else 'advanced features'}) into a production-grade portfolio project.",
            "priority": "High Priority",
            "resources": [
                {"name": "GitHub Student Pack & Deployment Guide", "url": "https://education.github.com/"},
                {"name": "Full Stack Open / Project Ideas", "url": "https://fullstackopen.com/"}
            ],
            "milestone_project": f"Deploy a live, documented {role_name} project on GitHub and cloud hosting with CI/CD.",
            "completed": False
        })

        # Add index IDs for frontend state tracking
        for idx, step in enumerate(roadmap):
            step["id"] = f"step-{idx + 1}"

        return roadmap

    def generate_career_guidance(
        self,
        candidate_name: str,
        role_name: str,
        matched_skills: List[str],
        missing_skills: List[str],
        resume_score: int,
        experience_str: str,
        azure_foundry_guidance: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Creates an end-to-end career guidance report.
        Integrates Azure AI Foundry text if available, otherwise uses a tailored rule engine.
        """
        role_data = self.job_roles.get(role_name, {})

        # Projects tailored to role
        suggested_projects = self._get_suggested_projects(role_name, missing_skills)

        # Learning priority ordering
        priority_skills = missing_skills[:4] if missing_skills else ["Advanced Architecture", "System Design", "Cloud Deployment"]

        # Preparation advice based on score
        prep_advice = []
        if resume_score < 60:
            prep_advice.append("Focus primarily on project depth and formatting. Build at least 2 complete applications before applying.")
            prep_advice.append("Practice core coding fundamentals and data structures on LeetCode/HackerRank 30 minutes daily.")
        elif resume_score < 80:
            prep_advice.append("Your resume has good foundation. Target the missing skills in the roadmap to boost your match rate above 85%.")
            prep_advice.append("Enhance project bullet points with measurable impact (e.g. latency, throughput, user count).")
        else:
            prep_advice.append("Excellent resume profile! You are well-positioned for junior and mid-level opportunities.")
            prep_advice.append("Prepare for technical interviews by practicing system design and behavioral STAR-method questions.")

        advisor_payload = {
            "advisor_provider": azure_foundry_guidance["provider"] if azure_foundry_guidance else "Local Rule-Based Advisor",
            "is_azure_powered": bool(azure_foundry_guidance and azure_foundry_guidance.get("is_azure")),
            "priority_skills_to_learn": priority_skills,
            "suggested_capstone_projects": suggested_projects,
            "career_preparation_tips": prep_advice,
            "interview_focus_areas": self._get_interview_topics(role_name),
            "custom_foundry_notes": azure_foundry_guidance.get("guidance_text") if azure_foundry_guidance else None
        }

        return advisor_payload

    def _get_suggested_projects(self, role_name: str, missing_skills: List[str]) -> List[Dict[str, str]]:
        project_catalog = {
            "Full Stack Developer": [
                {
                    "title": "E-Commerce Platform with Real-Time Inventory",
                    "tech_stack": "React, Node.js, Express, MongoDB, Redux",
                    "description": "Full-stack store with JWT auth, stripe payment simulation, and live product catalog filtering."
                },
                {
                    "title": "Collaborative Team Task Board",
                    "tech_stack": "React, Node.js, REST API, WebSockets, Tailwind CSS",
                    "description": "Trello-like drag-and-drop workspace with real-time state synchronization across team members."
                }
            ],
            "Python Developer": [
                {
                    "title": "Automated Web Scraper & Intelligence Pipeline",
                    "tech_stack": "Python, Flask/FastAPI, BeautifulSoup, PostgreSQL, Celery",
                    "description": "Scheduled asynchronous scraping service with data normalization, REST endpoints, and Docker deployment."
                },
                {
                    "title": "Microservices Authentication & Rate-Limiter Service",
                    "tech_stack": "Python, Django REST Framework, Redis, JWT, PyTest",
                    "description": "High-throughput authentication gateway featuring token blacklisting, role-based access, and automated tests."
                }
            ],
            "Data Analyst": [
                {
                    "title": "Executive E-Commerce Sales & Customer Churn Dashboard",
                    "tech_stack": "Power BI / Tableau, SQL, Python, Pandas, Matplotlib",
                    "description": "Interactive multi-page dashboard analyzing revenue trends, cohort retention, and RFM customer segmentation."
                },
                {
                    "title": "Financial Portfolio Performance & Risk Analyzer",
                    "tech_stack": "Python, Pandas, NumPy, Statistics, Seaborn, Excel",
                    "description": "Statistical risk modeling, Sharpe ratio calculations, and automated monthly performance reports."
                }
            ],
            "AI/ML Engineer": [
                {
                    "title": "End-to-End Predictive Maintenance & Anomaly Detection",
                    "tech_stack": "Python, Scikit-learn, TensorFlow, Pandas, Flask",
                    "description": "Time-series sensor anomaly detection with feature engineering pipelines and model inference API."
                },
                {
                    "title": "Medical Image Classification with Transfer Learning",
                    "tech_stack": "PyTorch / TensorFlow, CNNs, OpenCV, Streamlit",
                    "description": "Chest X-ray disease detection model achieving >90% validation accuracy with Grad-CAM visual explanations."
                }
            ],
            "Java Developer": [
                {
                    "title": "Enterprise Banking & Ledger Microservice",
                    "tech_stack": "Java 17, Spring Boot, Spring Data JPA, PostgreSQL, Docker",
                    "description": "ACID-compliant banking transaction service with idempotency, HikariCP pooling, and Swagger documentation."
                },
                {
                    "title": "High-Concurrency Order Processing Service",
                    "tech_stack": "Java, Spring Boot, JDBC, JUnit 5, Mockito, Git",
                    "description": "Multi-threaded order processing engine with optimistic locking, unit test coverage >85%, and CI pipeline."
                }
            ]
        }

        return project_catalog.get(role_name, project_catalog["Full Stack Developer"])

    def _get_interview_topics(self, role_name: str) -> List[str]:
        topics = {
            "Full Stack Developer": [
                "JavaScript Event Loop, Promises, and Async/Await",
                "RESTful design principles, HTTP headers, and CORS",
                "React reconciliation, Virtual DOM, and state patterns",
                "Database indexing, schema modeling, and SQL vs NoSQL"
            ],
            "Python Developer": [
                "Python Memory Management, GIL, and Garbage Collection",
                "Decorators, Generators, and Context Managers",
                "SQL Query Optimization, Indexes, and ACID Transactions",
                "REST API security, JWT authentication, and unit testing"
            ],
            "Data Analyst": [
                "SQL Window functions (RANK, DENSE_RANK, LEAD, LAG)",
                "Data cleaning techniques in Pandas and handling missing values",
                "Hypothesis testing (p-values, type I/II errors, A/B testing)",
                "Effective data visualization principles and dashboard storytelling"
            ],
            "AI/ML Engineer": [
                "Bias-variance tradeoff and regularization (L1/L2)",
                "Gradient Descent, Learning Rate Schedulers, and Optimizers",
                "Evaluation metrics: Precision, Recall, F1, ROC-AUC, and Confusion Matrix",
                "Overfitting prevention: Dropout, Cross-Validation, Data Augmentation"
            ],
            "Java Developer": [
                "Java Collections Framework (HashMap internals, ConcurrentHashMap)",
                "OOP Principles and SOLID Architecture in Java",
                "Spring Boot Dependency Injection and Bean Lifecycles",
                "Multithreading, synchronized blocks, and ExecutorService"
            ]
        }
        return topics.get(role_name, ["Core fundamentals", "System design", "Problem solving"])
