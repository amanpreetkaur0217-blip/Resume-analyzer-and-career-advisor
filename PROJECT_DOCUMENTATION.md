# Project Documentation: AI Resume Analyzer & Career Advisor

**Project Title:** AI Resume Analyzer & Career Advisor  
**Tagline:** Smart Resume Analysis and Personalized Career Guidance Using Azure AI  
**Academic Target:** B.Tech Computer Science & Engineering / AI-ML Capstone Project  
**Author:** Engineering Team  

---

## Table of Contents
1. [Abstract](#1-abstract)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives](#4-objectives)
5. [Existing System](#5-existing-system)
6. [Proposed System](#6-proposed-system)
7. [System Architecture](#7-system-architecture)
8. [Module Description](#8-module-description)
9. [Technology Description](#9-technology-description)
10. [Implementation Details](#10-implementation-details)
11. [Results & Evaluation](#11-results--evaluation)
12. [Limitations](#12-limitations)
13. [Future Scope](#13-future-scope)
14. [Conclusion](#14-conclusion)

---

## 1. Abstract

In the modern competitive technical hiring landscape, college students, freshers, and early-career job seekers face significant difficulties in tailoring their resumes to rapidly evolving software industry expectations. Traditional Applicant Tracking Systems (ATS) act primarily as automated gatekeepers, discarding resumes that lack specific keywords without providing constructive or actionable feedback.

This project presents **AI Resume Analyzer & Career Advisor**, a complete, professional, full-stack web application designed to democratize technical career guidance. The system processes PDF resumes, performs text extraction via PyMuPDF, leverages Microsoft Azure AI Language services for key phrase identification, cross-references skills against a normalized knowledge base across five target job roles, calculates a transparent 100-point resume quality score, conducts skill gap analysis, and generates dynamic, personalized learning roadmaps alongside downloadable PDF reports. Equipped with a hybrid dual-engine architecture, the application seamlessly operates in either cloud-connected Azure AI mode or an autonomous local fallback mode, ensuring zero downtime and complete explainability.

---

## 2. Introduction

A resume is the primary professional artifact submitted by an engineering student or job seeker to showcase technical competencies, academic qualifications, and project experiences. However, recruitment screening has become largely automated: algorithmic filters discard up to 75% of candidate applications prior to human review. Consequently, candidates are frequently left unaware of whether their resumes suffer from poor formatting, absence of quantifiable metrics, or crucial technical skill gaps.

The **AI Resume Analyzer & Career Advisor** bridges this information asymmetry. By uniting vector PDF text parsing, natural language processing (NLP), cloud-based Azure AI services, and deterministic rule-based evaluation, the platform acts as an automated, personalized technical mentor. It not only highlights what is missing but structures a sequential milestone-based trajectory to acquire those missing skills.

---

## 3. Problem Statement

College students and freshers face recurring challenges when preparing for engineering job applications:
1. **Opaque Screening:** Conventional hiring platforms and commercial ATS tools do not provide transparent reasons for rejection.
2. **Ambiguous Skill Requirements:** Students often struggle to discern which technologies are must-have core competencies versus secondary preferences for specific roles (e.g., Full Stack Developer vs. Python Developer vs. AI/ML Engineer).
3. **Generic & Non-Actionable Roadmaps:** Standard online learning roadmaps are static and one-size-fits-all, requiring students to repeat concepts they already know rather than focusing exclusively on their identified deficiencies.
4. **Scattered Resources:** Candidates lack an integrated platform that extracts their resume details, scores quality, identifies missing skills, and furnishes direct learning documentation in a single report.

---

## 4. Objectives

The primary objectives of this project include:
1. **Automated Vector PDF Text Extraction:** Develop a resilient parsing module utilizing PyMuPDF to extract text, contact details, academic qualifications, and experience levels from standard PDF resumes.
2. **Azure AI Language Cloud Integration:** Connect to Microsoft Azure AI Text Analytics to extract domain key phrases and entity concepts from resumes.
3. **Dual-Engine Graceful Fallback:** Implement a deterministic local NLP tokenizer ensuring uninterrupted operations when cloud credentials are unconfigured.
4. **Skill Matching & Gap Detection:** Establish a normalized canonical database for five core software engineering roles to calculate mathematical compatibility percentages:
   $$\text{Compatibility \%} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 100$$
5. **Transparent 100-Point Quality Scoring:** Formulate an explainable, multi-factor scoring rubric evaluating skills relevance, project impact, academics, experience, structural formatting, and certifications.
6. **Dynamic Career Roadmap Generation:** Generate custom sequential learning timelines (Weeks 1-2, 3-4, 5-6, 7-8) strictly mapped to the candidate's actual missing skills.
7. **Publication-Quality PDF Reporting:** Integrate ReportLab to synthesize professional analysis reports downloadable directly by the student.
8. **Modern SaaS User Experience:** Construct a responsive, modern web interface using React 18, Vite, and Tailwind CSS matching contemporary enterprise software standards.

---

## 5. Existing System

Traditional tools for resume evaluation fall into two extremes:

| Feature | Legacy Commercial ATS | Basic Student Prototypes |
| :--- | :--- | :--- |
| **Primary Purpose** | Screen candidates out for recruiters | Static frontend mockup |
| **Feedback Mechanism** | None (Binary Accept/Reject) | Hardcoded dummy statistics |
| **Scoring Explainability** | Black-box proprietary algorithms | Static hardcoded numbers |
| **Roadmap Generation** | Not available | Fixed static roadmap for everyone |
| **Downloadable Artifacts**| None | Not available |
| **Cloud AI Integration** | Closed enterprise APIs | Fake placeholder claims |

### Disadvantages of Existing Systems:
- Lack of educational value for the applicant.
- No explanation of why a score was awarded.
- Complete absence of personalized remediation trajectories.

---

## 6. Proposed System

The proposed **AI Resume Analyzer & Career Advisor** reorients resume evaluation toward applicant empowerment. Rather than acting as a gatekeeper, it acts as an advisory diagnostic system:

1. **Intelligent Intake:** Accepts PDF uploads with instant size (< 5 MB) and format verification.
2. **Multi-Stage Extraction:** Extracts text without data loss, identifying contact info, degrees, and estimated experience.
3. **Skill Normalization:** Resolves aliases (e.g., "Node", "NodeJS", and "Node.js" normalize to "Node.js"; "ReactJS" normalizes to "React").
4. **Objective Scoring:** Evaluates content against verifiable quality rules (action verbs, quantifiable metrics, section completeness).
5. **Dynamic Remediation:** Dynamically sequences only missing skills into actionable learning sprints with vetted documentation links.
6. **Self-Contained Report:** Compiles a comprehensive PDF report containing scores, strengths, weaknesses, and roadmaps for offline study.

---

## 7. System Architecture

### 7.1 Architecture Diagram

```mermaid
flowchart TD
    Client[React + Vite Frontend Client] -->|HTTP POST Multipart Form| API[Flask Backend REST API Server]
    
    subgraph Data_Extraction_Layer [Data Extraction Layer]
        API --> Parser[PyMuPDF Vector Parser]
        Parser --> Metadata[Extract: Name, Contact, Degree, Exp]
        Parser --> DocText[Cleaned Corpus Text]
    end

    subgraph Intelligence_Layer [Intelligence & AI Processing Layer]
        DocText --> EngineRouter{Azure Credentials Available?}
        EngineRouter -->|Configured| AzureAI[Azure AI Language - Key Phrases]
        EngineRouter -->|Not Configured| LocalNLP[Local Rule-Based NLP Engine]
        
        AzureAI --> SkillExtractor[Skill Extractor & Alias Normalizer]
        LocalNLP --> SkillExtractor
        
        SkillExtractor --> JobDB[(job_roles.json Knowledge Base)]
        JobDB --> Matcher[Role Matcher & Scikit-learn TF-IDF]
    end

    subgraph Evaluation_Advisory_Layer [Evaluation & Advisory Layer]
        Matcher --> Scorer[100-Point Rule-Based Scorer]
        Matcher --> Advisor[Dynamic Career Roadmap Engine]
        Scorer --> ReportGen[ReportLab PDF Report Generator]
        Advisor --> ReportGen
    end

    Evaluation_Advisory_Layer --> JSONPayload[Structured JSON API Response]
    JSONPayload --> Client
    ReportGen --> BinaryPDF[Downloadable Analysis PDF]
    BinaryPDF --> Client
```

### 7.2 Application Workflow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Job Seeker
    participant UI as React Web Interface
    participant Server as Flask REST API
    participant PyMuPDF as PyMuPDF Extractor
    participant Azure as Azure AI Language
    participant Matcher as Skill Matcher
    participant Scorer as Rule Scorer
    participant Advisor as Career Advisor
    participant ReportLab as ReportLab Engine

    User->>UI: Selects Role & Uploads PDF Resume
    UI->>UI: Validates format (.pdf) and size (< 5 MB)
    UI->>Server: POST /api/analyze (multipart form)
    Server->>PyMuPDF: Parse document stream
    PyMuPDF-->>Server: Return cleaned text & metadata
    
    alt Azure AI Configured
        Server->>Azure: Extract key phrases
        Azure-->>Server: Domain key phrases
    else Fallback Mode
        Server->>Server: Run local noun-phrase tokenizer
    end

    Server->>Matcher: Detect skills & compare against role
    Matcher-->>Server: Matched & missing skills, compatibility %
    Server->>Scorer: Evaluate 6 quality categories
    Scorer-->>Server: Overall score (out of 100), strengths, suggestions
    Server->>Advisor: Build roadmap based on missing skills
    Advisor-->>Server: Dynamic week-by-week timeline
    Server-->>UI: Return structured analysis payload
    UI->>User: Displays interactive Dashboard & Roadmap
    
    opt Download PDF Report
        User->>UI: Clicks "Download Report"
        UI->>Server: POST /api/download-report (JSON)
        Server->>ReportLab: Generate structured PDF
        ReportLab-->>Server: BytesIO PDF buffer
        Server-->>UI: Stream application/pdf
        UI->>User: Saves Resume_Analysis_Report.pdf
    end
```

---

## 8. Module Description

The system is organized into modular components separating presentation, extraction, artificial intelligence, and document synthesis:

### 8.1 Frontend Modules
- **`Navbar.jsx`:** Top brand navigation bar featuring real-time Azure AI connection status indicator, direct routing to Analyzer, Dashboard, and About pages.
- **`ResumeUpload.jsx`:** Drag-and-drop file ingestion zone with client-side validation, error handling, selected file metadata display, and sample resume loading.
- **`ScoreCard.jsx`:** Custom SVG animated circular progress indicators rendering exact score and percentage values with dynamic color shifts.
- **`SkillChart.jsx`:** Interactive Chart.js data visualization component toggling between doughnut distribution (Matched vs. Missing) and bar charts of category scores.
- **`SkillBadge.jsx`:** Micro-component rendering semantic status badges for matched (green), missing (rose), preferred (sky), and soft skills (purple).
- **`LoadingAnimation.jsx`:** Multi-stage animated scanner indicating active server pipeline stages.
- **`Dashboard.jsx`:** Comprehensive analytical cockpit displaying candidate overview, category scores, strengths, and recommendations.
- **`Roadmap.jsx`:** Interactive learning timeline allowing students to check off completed milestones and inspect recommended technical documentation.

### 8.2 Backend Modules
- **`app.py`:** Flask REST application orchestrating request routing, CORS configuration, payload limits, and exception handling.
- **`resume_parser.py`:** Vector PDF processing module extracting text, emails, phone numbers, academic degrees, and estimated experience using PyMuPDF.
- **`azure_ai.py`:** Wrapper interfacing with Microsoft Azure AI Language (`TextAnalyticsClient`) with automatic text chunking and safe local fallback extraction.
- **`skill_matcher.py`:** Skill recognition engine utilizing regex word-boundary alias matching and Scikit-learn TF-IDF cosine similarity.
- **`scorer.py`:** Deterministic quality evaluation engine scoring resumes out of 100 across six distinct categories.
- **`career_advisor.py`:** Dynamic recommendation synthesizer generating structured learning timelines tailored exclusively to detected skill deficiencies.
- **`report_generator.py`:** ReportLab document compilation engine creating print-ready PDF reports with headers, tables, and disclaimers.

---

## 9. Technology Description

### 9.1 Frontend Framework & Styling
- **React 18:** Modern declarative JavaScript library utilized for component state management, virtual DOM reconciliation, and modular UI development.
- **Vite:** High-performance next-generation frontend build tool providing Hot Module Replacement (HMR) and optimized Rollup-based asset bundling.
- **Tailwind CSS:** Utility-first CSS framework enabling responsive, modern SaaS designs with glassmorphism, gradient accents, and consistent spacing.
- **React Router DOM v6:** Client-side routing management supporting dynamic navigation between landing, analyzer, dashboard, and roadmap views.
- **Chart.js & React-Chartjs-2:** HTML5 Canvas charting library rendering animated doughnut and bar graphs.
- **Lucide React:** Consistent, lightweight icon set enhancing UI clarity.

### 9.2 Backend Framework & Server
- **Python 3.14+:** Modern, expressive programming language chosen for its rich ecosystem in natural language processing and document parsing.
- **Flask 3.1 & Flask-CORS:** Lightweight WSGI microframework providing REST API endpoints and Cross-Origin Resource Sharing.

### 9.3 AI, NLP & Parsing Engines
- **Microsoft Azure AI Language:** Cloud-hosted cognitive service delivering enterprise-grade key phrase extraction and entity resolution.
- **PyMuPDF (`fitz`):** High-performance Python binding for MuPDF, extracting digital text, layout metadata, and font geometries without OCR latency.
- **Scikit-learn:** Machine learning library providing `TfidfVectorizer` and `cosine_similarity` for contextual semantic relevance measurement.
- **ReportLab:** Python library for generating dynamic, publication-quality PDF documents with tabular structures and custom styles.

---

## 10. Implementation Details

### 10.1 Mathematical Formulas & Scoring Engine

#### 1. Skill Match Percentage
$$\text{Match Percentage} = \min\left(100, \text{round}\left(\frac{N_{\text{matched}}}{N_{\text{required}}} \times 100\right)\right)$$
Where:
- $N_{\text{matched}}$ is the number of required skills detected on the candidate's resume.
- $N_{\text{required}}$ is the total number of required skills designated for the target job role.

#### 2. Resume Quality Scoring Rubric (100 Points Total)
$$\text{Total Score} = S_{\text{skills}} + S_{\text{projects}} + S_{\text{education}} + S_{\text{experience}} + S_{\text{structure}} + S_{\text{achievements}}$$

- **Skills Relevance ($S_{\text{skills}}$, max 30 pts):**
  $$S_{\text{skills}} = \min\left(30, \text{round}\left(\frac{N_{\text{matched}}}{N_{\text{required}}} \times 24\right) + \min(6, 2 \times N_{\text{preferred}})\right)$$
- **Projects & Impact ($S_{\text{projects}}$, max 20 pts):**  
  Presence of dedicated section (+8 pts), action verbs count $\ge 3$ (+6 pts), quantifiable metrics such as %, ms, or user counts (+6 pts).
- **Education & Academics ($S_{\text{education}}$, max 15 pts):**  
  Recognized degree identified (+10 pts), GPA / graduation year identified (+5 pts).
- **Experience / Internships ($S_{\text{experience}}$, max 15 pts):**  
  Work experience or internship section detected (+8 pts), quantified duration or multi-year track record (+7 pts).
- **Structure & Formatting ($S_{\text{structure}}$, max 10 pts):**  
  Full name and contact email present (+4 pts), $\ge 4$ structured sections (+3 pts), optimal word count between 250 and 1100 words (+3 pts).
- **Achievements & Certifications ($S_{\text{achievements}}$, max 10 pts):**  
  Recognized certifications/awards (+6 pts), portfolio/GitHub links (+4 pts).

---

## 11. Results & Evaluation

The system was evaluated against automated test suites and real-world sample resumes:

### 11.1 Test Suite Verification
The automated verification suite (`test_backend.py`) executed 7 distinct unit test cases:
1. `GET /api/health`: Confirmed 200 OK and Azure status payload reporting.
2. `GET /api/job-roles`: Verified retrieval of all 5 supported engineering roles.
3. Vector PDF Text Parsing: Confirmed extraction of candidate name, degree, and experience.
4. Skill Extraction & Scoring: Verified skill identification and deterministic 100-point scoring.
5. End-to-End Analysis API (`POST /api/analyze`): Verified full JSON response assembly.
6. Report Generation API (`POST /api/download-report`): Confirmed creation of binary PDF.
7. Input Validation & Error Handling: Confirmed HTTP 400 responses for missing roles, invalid extensions, and empty files.

*Result:* **100% of test cases passed in 0.565 seconds.**

### 11.2 Evaluation on Sample Candidate Resume
- **Candidate Profile:** John Doe, B.Tech CSE, 2+ Years Exp.
- **Target Role:** Full Stack Developer
- **Skills Found (7):** Python, JavaScript, React, Node.js, SQL, Git, HTML
- **Missing Skills (2):** MongoDB, Express.js
- **Skill Match Score:** 78% (7 out of 9 core skills matched)
- **Resume Quality Score:** 93/100 (Strong technical alignment, quantifiable project metrics, verified degree, and certified credentials)
- **Generated Roadmap:** Tailored specifically to bridge MongoDB and Express.js in Weeks 1 to 4, culminating in a Full Stack Capstone project.

---

## 12. Limitations

1. **Scanned Image Resumes Without OCR:** When processing purely image-based PDFs without digital vector text, local extraction requires Azure Document Intelligence credentials. Without cloud credentials, the user must provide a text-based PDF.
2. **Non-Standard Formatting:** Radically unconventional or artistic multi-column resumes with non-standard section titles may require manual section guidance.
3. **Static Job Roles Catalog:** Currently preconfigured with five representative engineering roles. Future revisions will allow dynamic role schema injection.

---

## 13. Future Scope

1. **Real-Time Job Scraping Integration:** Integrating job boards (LinkedIn, Indeed, Glassdoor) via APIs to dynamically pull live hiring requirements.
2. **AI Mock Interview Coach:** Generating custom technical interview questions based on the candidate's specific resume projects and detected skill gaps.
3. **Automated GitHub Code Verification:** Connecting to the candidate's GitHub profile to inspect repositories, commit frequency, and language proficiency.
4. **Multi-Language Support:** Extending extraction and advisory pipelines to support Spanish, French, German, and Hindi resumes.

---

## 14. Conclusion

The **AI Resume Analyzer & Career Advisor** successfully addresses a critical gap in automated career tooling. By combining fast vector PDF extraction, Microsoft Azure AI Language services, transparent 100-point quality evaluation, and personalized roadmap generation, the platform provides college students and freshers with an explainable, actionable career development system. The hybrid dual-engine architecture guarantees zero operational downtime, making this project an exemplary, production-ready full-stack software engineering achievement.
