from typing import Any, Dict, List
import os
import re
from docx import Document
from PyPDF2 import PdfReader


class ResumeParserService:
    @staticmethod
    def extract_pdf_text(file_path: str) -> str:
        text = []
        with open(file_path, "rb") as file:
            reader = PdfReader(file)
            for page in reader.pages:
                extracted = page.extract_text() or ""
                text.append(extracted)
        return "\n".join(text)

    @staticmethod
    def extract_docx_text(file_path: str) -> str:
        doc = Document(file_path)
        return "\n".join(paragraph.text for paragraph in doc.paragraphs)

    @staticmethod
    def extract_text(file_path: str, file_type: str) -> str:
        file_type = file_type.lower()
        if file_type == "pdf":
            return ResumeParserService.extract_pdf_text(file_path)
        if file_type == "docx":
            return ResumeParserService.extract_docx_text(file_path)
        raise ValueError(f"Unsupported file type: {file_type}")

    @staticmethod
    def parse_resume(raw_text: str) -> Dict[str, Any]:
        return {
            "name": ResumeParserService._extract_name(raw_text),
            "email": ResumeParserService._extract_email(raw_text),
            "phone": ResumeParserService._extract_phone(raw_text),
            "skills": ResumeParserService._extract_skills(raw_text),
            "education": ResumeParserService._extract_education(raw_text),
            "experience": ResumeParserService._extract_experience(raw_text),
            "projects": ResumeParserService._extract_projects(raw_text),
            "summary": raw_text[:500],
        }

    @staticmethod
    def _extract_email(text: str) -> str:
        match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
        return match.group(0) if match else ""

    @staticmethod
    def _extract_phone(text: str) -> str:
        match = re.search(r"(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}", text)
        return match.group(0) if match else ""

    @staticmethod
    def _extract_name(text: str) -> str:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if not lines:
            return "Unknown"
        for line in lines[:5]:
            if 2 <= len(line.split()) <= 4 and all(part[:1].isalpha() for part in line.split()):
                return line
        return lines[0][:80]

    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        skill_terms = [
            "python", "javascript", "typescript", "react", "nextjs", "nodejs", "fastapi",
            "django", "flask", "sql", "postgresql", "mysql", "mongodb", "redis",
            "aws", "docker", "kubernetes", "git", "html", "css", "tailwind", "spaCy",
            "pandas", "numpy", "scikit-learn", "machine learning", "nlp", "graphql"
        ]
        lowered = text.lower()
        found = [skill for skill in skill_terms if skill.lower() in lowered]
        return sorted(set(found))

    @staticmethod
    def _extract_education(text: str) -> List[str]:
        keywords = ["education", "bachelor", "master", "phd", "b.tech", "m.tech", "degree"]
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return [line for line in lines if any(keyword in line.lower() for keyword in keywords)]

    @staticmethod
    def _extract_experience(text: str) -> List[str]:
        keywords = ["experience", "intern", "engineer", "developer", "worked", "employment"]
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return [line for line in lines if any(keyword in line.lower() for keyword in keywords)]

    @staticmethod
    def _extract_projects(text: str) -> List[str]:
        keywords = ["project", "built", "developed", "created"]
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return [line for line in lines if any(keyword in line.lower() for keyword in keywords)]
