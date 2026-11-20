import os
import re
import logging
from typing import List, Dict, Any, Optional

try:
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.textanalytics import TextAnalyticsClient
    AZURE_SDK_AVAILABLE = True
except ImportError:
    AZURE_SDK_AVAILABLE = False
    TextAnalyticsClient = None
    AzureKeyCredential = None

logger = logging.getLogger(__name__)


class AzureAIService:
    """
    Manages integrations with Microsoft Azure AI services:
    - Azure AI Language (Text Analytics for key phrase extraction)
    - Azure AI Foundry (Generative AI recommendations)
    - Azure AI Document Intelligence (Scanned resume OCR)
    
    Includes graceful local fallback when credentials are not configured.
    """

    def __init__(self):
        self.language_endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT", "").strip()
        self.language_key = os.getenv("AZURE_LANGUAGE_KEY", "").strip()
        
        self.foundry_endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT", "").strip()
        self.foundry_key = os.getenv("AZURE_FOUNDRY_KEY", "").strip()
        self.foundry_deployment = os.getenv("AZURE_FOUNDRY_DEPLOYMENT", "").strip()

        self.doc_endpoint = os.getenv("AZURE_DOCUMENT_ENDPOINT", "").strip()
        self.doc_key = os.getenv("AZURE_DOCUMENT_KEY", "").strip()

        self._text_client = None
        self._init_language_client()

    def _init_language_client(self):
        if AZURE_SDK_AVAILABLE and self.language_endpoint and self.language_key:
            try:
                # Basic sanity check on placeholder values
                if "your-" in self.language_key.lower() or "placeholder" in self.language_key.lower():
                    self._text_client = None
                    return
                credential = AzureKeyCredential(self.language_key)
                self._text_client = TextAnalyticsClient(
                    endpoint=self.language_endpoint,
                    credential=credential
                )
            except Exception as e:
                logger.warning(f"Could not initialize Azure Text Analytics client: {e}")
                self._text_client = None
        else:
            self._text_client = None

    def get_service_status(self) -> Dict[str, Any]:
        """
        Returns real connection status of each Azure AI service without exposing keys.
        """
        is_lang_configured = bool(self._text_client is not None)
        is_foundry_configured = bool(
            self.foundry_endpoint and self.foundry_key and
            "your-" not in self.foundry_key.lower()
        )
        is_doc_configured = bool(
            self.doc_endpoint and self.doc_key and
            "your-" not in self.doc_key.lower()
        )

        return {
            "azure_language": {
                "configured": is_lang_configured,
                "service_name": "Azure AI Language",
                "endpoint": self.language_endpoint if is_lang_configured else None
            },
            "azure_foundry": {
                "configured": is_foundry_configured,
                "service_name": "Azure AI Foundry",
                "deployment": self.foundry_deployment if is_foundry_configured else None
            },
            "azure_document_intelligence": {
                "configured": is_doc_configured,
                "service_name": "Azure AI Document Intelligence"
            },
            "active_mode": "Azure AI Connected" if is_lang_configured else "Local Fallback Engine"
        }

    def extract_key_phrases(self, text: str) -> Dict[str, Any]:
        """
        Extracts key phrases from resume text.
        If Azure AI Language is configured and valid, calls Azure Text Analytics.
        Otherwise, runs a local rule-based key phrase extraction engine.
        """
        if not text or not text.strip():
            return {
                "key_phrases": [],
                "provider": "None",
                "is_azure": False
            }

        # Try Azure AI Language if configured
        if self._text_client is not None:
            try:
                # Azure Text Analytics max document size is 5120 characters
                # Split text into chunks
                chunks = self._chunk_text(text, max_chars=5000)
                all_phrases = []

                # Analyze in batches
                response = self._text_client.extract_key_phrases(chunks[:5])
                for doc in response:
                    if not doc.is_error:
                        all_phrases.extend(doc.key_phrases)
                    else:
                        logger.warning(f"Azure key phrase document error: {doc.error}")

                # Deduplicate and sort
                unique_phrases = list(dict.fromkeys([p.strip() for p in all_phrases if len(p.strip()) > 1]))
                if unique_phrases:
                    return {
                        "key_phrases": unique_phrases,
                        "provider": "Azure AI Language",
                        "is_azure": True
                    }
            except Exception as e:
                logger.error(f"Azure AI Language extraction failed, falling back to local: {e}")

        # Local Fallback Key Phrase Extractor
        local_phrases = self._extract_local_key_phrases(text)
        return {
            "key_phrases": local_phrases,
            "provider": "Local NLP Engine",
            "is_azure": False,
            "fallback_note": "Processed using local rule-based phrase extraction (Azure credentials not configured)"
        }

    def generate_foundry_guidance(
        self,
        candidate_name: str,
        job_role: str,
        matched_skills: List[str],
        missing_skills: List[str],
        resume_score: int
    ) -> Optional[Dict[str, Any]]:
        """
        Calls Azure AI Foundry model endpoint (OpenAI / Foundry Chat API) if configured.
        Returns structured guidance or None if not configured.
        """
        if not (self.foundry_endpoint and self.foundry_key):
            return None

        import requests
        try:
            url = f"{self.foundry_endpoint.rstrip('/')}/chat/completions?api-version=2024-02-15-preview"
            headers = {
                "Content-Type": "application/json",
                "api-key": self.foundry_key
            }

            prompt = (
                f"Candidate: {candidate_name}\n"
                f"Target Job Role: {job_role}\n"
                f"Current Matched Skills: {', '.join(matched_skills) if matched_skills else 'None detected'}\n"
                f"Missing Key Skills: {', '.join(missing_skills) if missing_skills else 'None'}\n"
                f"Resume Quality Score: {resume_score}/100\n\n"
                "Please provide 3 personalized resume improvements and 3 career preparation tips. Return concise bullet points."
            )

            payload = {
                "messages": [
                    {"role": "system", "content": "You are an expert technical career advisor and resume strategist."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4,
                "max_tokens": 400
            }

            response = requests.post(url, headers=headers, json=payload, timeout=8)
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return {
                    "provider": "Azure AI Foundry",
                    "is_azure": True,
                    "guidance_text": content
                }
        except Exception as e:
            logger.warning(f"Azure AI Foundry request failed: {e}")

        return None

    def _chunk_text(self, text: str, max_chars: int = 5000) -> List[str]:
        """Splits text into chunks under max_chars at paragraph or sentence boundaries."""
        paragraphs = text.split("\n\n")
        chunks = []
        current_chunk = ""

        for p in paragraphs:
            if len(current_chunk) + len(p) + 2 <= max_chars:
                current_chunk += p + "\n\n"
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                if len(p) > max_chars:
                    # Hard split if single paragraph exceeds max
                    for i in range(0, len(p), max_chars):
                        chunks.append(p[i:i + max_chars])
                    current_chunk = ""
                else:
                    current_chunk = p + "\n\n"

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks if chunks else [text[:max_chars]]

    def _extract_local_key_phrases(self, text: str) -> List[str]:
        """
        Robust local noun-phrase and technical term extractor for resumes.
        Extracts multi-word terms, tool names, frameworks, and methodologies.
        """
        # Split into words and candidate phrases
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        candidate_phrases = set()

        # Common stop words to avoid in phrases
        stops = {
            "a", "an", "the", "and", "or", "but", "if", "then", "of", "to", "in", "on", "with",
            "for", "by", "at", "from", "as", "is", "was", "are", "were", "be", "been", "have",
            "has", "had", "do", "does", "did", "can", "could", "will", "would", "should", "i",
            "my", "me", "we", "our", "you", "your", "he", "she", "it", "they", "this", "that"
        }

        # Look for bullet points or comma separated lists
        for line in lines:
            # Check for comma/bullet lists: e.g. "React, Node.js, Express, MongoDB"
            items = re.split(r"[,;|•\*\t]", line)
            for item in items:
                cleaned = item.strip()
                words = cleaned.split()
                if 1 <= len(words) <= 4:
                    # Ignore pure numbers or single stop words
                    if len(cleaned) >= 2 and not cleaned.isdigit():
                        if cleaned.lower() not in stops:
                            candidate_phrases.add(cleaned)

        # Also extract capitalized technical acronyms (e.g., REST API, AWS, CI/CD, SQL, OOP, HTML)
        acronyms = re.findall(r"\b[A-Z0-9#\+\.\/\-]{2,10}\b", text)
        for acr in acronyms:
            if acr.lower() not in stops and not acr.isdigit():
                candidate_phrases.add(acr)

        # Return top 30 most relevant unique phrases sorted by length/relevance
        sorted_phrases = sorted(list(candidate_phrases), key=lambda x: (len(x.split()), len(x)), reverse=True)
        return sorted_phrases[:35]
