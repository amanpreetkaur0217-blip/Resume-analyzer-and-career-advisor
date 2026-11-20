import re
import os
import io

# Try importing PyMuPDF
try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None


class ResumeParser:
    """
    Extracts text, metadata, contact info, education, and experience from PDF resumes
    using PyMuPDF. Handles scanned documents with Azure Document Intelligence if configured.
    """

    def __init__(self, azure_doc_endpoint=None, azure_doc_key=None):
        self.azure_doc_endpoint = azure_doc_endpoint or os.getenv("AZURE_DOCUMENT_ENDPOINT")
        self.azure_doc_key = azure_doc_key or os.getenv("AZURE_DOCUMENT_KEY")

    def parse_pdf(self, file_stream_or_path):
        """
        Parses a PDF file from a file path or file-like bytes stream.
        Returns a structured dictionary with extracted information.
        """
        if fitz is None:
            raise RuntimeError("PyMuPDF is not installed. Please install pymupdf to extract PDF text.")

        if isinstance(file_stream_or_path, (str, bytes, bytearray)):
            if isinstance(file_stream_or_path, str) and os.path.isfile(file_stream_or_path):
                doc = fitz.open(file_stream_or_path)
            else:
                doc = fitz.open(stream=file_stream_or_path, filetype="pdf")
        elif hasattr(file_stream_or_path, "read"):
            content = file_stream_or_path.read()
            doc = fitz.open(stream=content, filetype="pdf")
        else:
            raise ValueError("Invalid file input provided to ResumeParser.")

        pages_count = len(doc)
        if pages_count == 0:
            raise ValueError("The uploaded PDF is empty and contains 0 pages.")

        full_text_list = []
        has_images = False

        for page_num in range(pages_count):
            page = doc[page_num]
            text = page.get_text("text")
            if text:
                full_text_list.append(text)
            
            # Check for images if text is very low
            images = page.get_images()
            if images:
                has_images = True

        raw_text = "\n".join(full_text_list).strip()
        doc.close()

        # Check if PDF is a scanned image with little/no extractable text
        is_scanned = len(raw_text) < 50 and has_images

        if is_scanned or len(raw_text) == 0:
            if self.azure_doc_endpoint and self.azure_doc_key:
                # Attempt OCR via Azure Document Intelligence
                ocr_text = self._perform_azure_ocr(file_stream_or_path)
                if ocr_text:
                    raw_text = ocr_text
                    is_scanned = False
            else:
                if is_scanned:
                    raise ValueError(
                        "The uploaded PDF appears to be a scanned image with no embedded text. "
                        "OCR requires Azure AI Document Intelligence credentials (AZURE_DOCUMENT_ENDPOINT and AZURE_DOCUMENT_KEY) "
                        "to be configured in backend/.env. Please upload a standard text-based PDF or configure Azure OCR."
                    )
                else:
                    raise ValueError("Could not extract any readable text from the uploaded PDF.")

        # Clean and normalize text
        cleaned_text = self._clean_text(raw_text)

        # Extract structured details
        email = self._extract_email(cleaned_text)
        phone = self._extract_phone(cleaned_text)
        name = self._extract_name(cleaned_text, email)
        education = self._extract_education(cleaned_text)
        experience = self._extract_experience(cleaned_text)
        sections = self._identify_sections(cleaned_text)

        return {
            "success": True,
            "text": cleaned_text,
            "pages_count": pages_count,
            "is_scanned": is_scanned,
            "candidate_name": name,
            "email": email,
            "phone": phone,
            "education": education,
            "experience": experience,
            "sections": sections,
            "word_count": len(cleaned_text.split())
        }

    def _clean_text(self, text):
        """Cleans up excessive spaces, unprintable characters, and fixes line breaks."""
        # Replace non-breaking spaces and non-standard whitespace
        text = text.replace("\xa0", " ").replace("\r\n", "\n").replace("\r", "\n")
        # Collapse multi-newlines
        text = re.sub(r"\n{3,}", "\n\n", text)
        # Collapse multi-spaces
        text = re.sub(r"[ \t]{2,}", " ", text)
        return text.strip()

    def _extract_email(self, text):
        match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
        return match.group(0) if match else None

    def _extract_phone(self, text):
        # Matches patterns like +91 9876543210, (555) 123-4567, 98765-43210
        match = re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}", text)
        if match:
            phone_str = match.group(0).strip()
            # Verify it contains at least 8 digits
            digits = re.sub(r"\D", "", phone_str)
            if 8 <= len(digits) <= 15:
                return phone_str
        return None

    def _extract_name(self, text, email=None):
        """
        Infers candidate name from the top 5 lines of the resume,
        filtering out common keywords, titles, URLs, and emails.
        """
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        stop_keywords = {
            "resume", "curriculum", "vitae", "cv", "page", "contact",
            "phone", "email", "address", "portfolio", "github", "linkedin",
            "profile", "summary", "objective", "skills", "experience", "education"
        }

        for line in lines[:5]:
            # Remove symbols
            clean_line = re.sub(r"[|•,/\-\(\)]", " ", line).strip()
            words = clean_line.split()

            # Typically 2-4 words, all letters, capitalized
            if 2 <= len(words) <= 4:
                lower_words = [w.lower() for w in words]
                if any(w in stop_keywords for w in lower_words):
                    continue
                if any("@" in w or "http" in w or ".com" in w for w in lower_words):
                    continue
                # Check if words look like personal name (alphabetic, mostly capitalized)
                if all(w.replace(".", "").isalpha() and len(w) > 1 for w in words):
                    return " ".join(words).title()

        # Fallback to email username if available
        if email:
            prefix = email.split("@")[0]
            clean_prefix = re.sub(r"[\._\d]", " ", prefix).strip().title()
            if len(clean_prefix.split()) >= 2:
                return clean_prefix

        return "Candidate"

    def _extract_education(self, text):
        """
        Extracts candidate's degree, major, or highest education level.
        """
        degrees = [
            (r"(?i)\b(b\.?tech(?:nology)?|bachelor of technology)\b", "B.Tech"),
            (r"(?i)\b(b\.?e\.?|bachelor of engineering)\b", "B.E."),
            (r"(?i)\b(m\.?tech(?:nology)?|master of technology)\b", "M.Tech"),
            (r"(?i)\b(m\.?e\.?|master of engineering)\b", "M.E."),
            (r"(?i)\b(b\.?sc(?:ience)?|bachelor of science)\b", "B.Sc"),
            (r"(?i)\b(m\.?sc(?:ience)?|master of science)\b", "M.Sc"),
            (r"(?i)\b(bca|bachelor of computer applications)\b", "BCA"),
            (r"(?i)\b(mca|master of computer applications)\b", "MCA"),
            (r"(?i)\b(ph\.?d|doctor of philosophy)\b", "Ph.D."),
            (r"(?i)\b(bachelor(?:'s)? degree)\b", "Bachelor's Degree"),
            (r"(?i)\b(master(?:'s)? degree)\b", "Master's Degree"),
            (r"(?i)\b(diploma)\b", "Diploma"),
        ]

        found_degree = None
        for pattern, label in degrees:
            if re.search(pattern, text):
                found_degree = label
                break

        # Check for field/major
        major_patterns = [
            (r"(?i)\b(computer science(?: and engineering)?|cse)\b", "Computer Science"),
            (r"(?i)\b(information technology|it)\b", "Information Technology"),
            (r"(?i)\b(data science)\b", "Data Science"),
            (r"(?i)\b(artificial intelligence|ai|machine learning|ml)\b", "AI & ML"),
            (r"(?i)\b(electronics(?: and communication)?|ece)\b", "ECE"),
            (r"(?i)\b(electrical(?: engineering)?|eee)\b", "Electrical Eng."),
            (r"(?i)\b(mechanical(?: engineering)?)\b", "Mechanical Eng."),
        ]

        found_major = None
        for pattern, label in major_patterns:
            if re.search(pattern, text):
                found_major = label
                break

        if found_degree and found_major:
            return f"{found_degree} in {found_major}"
        elif found_degree:
            return found_degree
        elif found_major:
            return f"Degree in {found_major}"
        else:
            return "Bachelor's Degree"

    def _extract_experience(self, text):
        """
        Determines estimated years of experience or career level (Fresher / X+ Years).
        """
        # Look for explicit year mentions like "3 years of experience", "2+ years experience"
        year_matches = re.findall(r"(?i)(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)", text)
        if year_matches:
            try:
                max_yrs = max(float(y) for y in year_matches)
                if max_yrs == int(max_yrs):
                    return f"{int(max_yrs)}+ Years Exp."
                return f"{max_yrs} Years Exp."
            except Exception:
                pass

        # Look for phrases like "fresher", "recent graduate", "entry level", "student"
        if re.search(r"(?i)\b(fresher|recent graduate|student|entry[- ]level|intern)\b", text):
            # Check if there are internships
            if re.search(r"(?i)\b(internship|intern)\b", text):
                return "Fresher (Internship Exp.)"
            return "Fresher / Entry-Level"

        # Check for year ranges like 2021 - 2024, 2022 - Present
        ranges = re.findall(r"\b(20\d\d)\s*(?:-|to|–)\s*(20\d\d|present|current)\b", text, re.IGNORECASE)
        if ranges:
            total_years = 0
            current_year = 2026
            for start, end in ranges:
                try:
                    s = int(start)
                    e = current_year if end.lower() in ("present", "current") else int(end)
                    if 0 <= (e - s) <= 10:
                        total_years += (e - s)
                except ValueError:
                    continue
            if total_years >= 1:
                return f"{min(total_years, 8)}+ Years Exp."

        return "Fresher / Entry-Level"

    def _identify_sections(self, text):
        """
        Identifies presence of key resume sections.
        """
        sections = {}
        section_patterns = {
            "contact": r"(?i)\b(contact|email|phone|address|linkedin)\b",
            "education": r"(?i)\b(education|academic|qualification|university|degree|college)\b",
            "experience": r"(?i)\b(experience|employment|work history|internship|professional experience)\b",
            "skills": r"(?i)\b(skills|technical skills|technologies|tools|competencies|proficiencies)\b",
            "projects": r"(?i)\b(projects|academic projects|personal projects|portfolio)\b",
            "certifications": r"(?i)\b(certifications|certificates|licenses|achievements|awards|publications)\b",
        }

        for sec_name, pattern in section_patterns.items():
            sections[sec_name] = bool(re.search(pattern, text))

        return sections

    def _perform_azure_ocr(self, file_stream_or_path):
        """
        Calls Azure Document Intelligence to OCR scanned PDF documents.
        Uses requests REST API for compatibility without heavy extra dependencies.
        """
        if not (self.azure_doc_endpoint and self.azure_doc_key):
            return None

        import requests
        import time

        try:
            endpoint = self.azure_doc_endpoint.rstrip("/")
            url = f"{endpoint}/documentintelligence/documentModels/prebuilt-read:analyze?api-version=2024-02-29-preview"
            
            headers = {
                "Ocp-Apim-Subscription-Key": self.azure_doc_key,
                "Content-Type": "application/pdf"
            }

            if isinstance(file_stream_or_path, str) and os.path.isfile(file_stream_or_path):
                with open(file_stream_or_path, "rb") as f:
                    pdf_bytes = f.read()
            elif hasattr(file_stream_or_path, "read"):
                file_stream_or_path.seek(0)
                pdf_bytes = file_stream_or_path.read()
            else:
                pdf_bytes = file_stream_or_path

            response = requests.post(url, headers=headers, data=pdf_bytes)
            if response.status_code != 202:
                # May fail if endpoint/key is invalid or quota exceeded
                return None

            operation_url = response.headers.get("Operation-Location")
            if not operation_url:
                return None

            # Poll for result
            for _ in range(10):
                time.sleep(1.5)
                poll_resp = requests.get(operation_url, headers={"Ocp-Apim-Subscription-Key": self.azure_doc_key})
                if poll_resp.status_code == 200:
                    data = poll_resp.json()
                    status = data.get("status")
                    if status == "succeeded":
                        content = data.get("analyzeResult", {}).get("content", "")
                        return content
                    elif status in ("failed", "canceled"):
                        return None
            return None
        except Exception:
            return None
