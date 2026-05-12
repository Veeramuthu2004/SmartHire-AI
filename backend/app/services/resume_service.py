import PyPDF2
from docx import Document
from typing import Dict, List, Any
import re
import os
from dotenv import load_dotenv

load_dotenv()

class ResumeParserService:
    """Extract text and structure from PDF and DOCX files"""

    @staticmethod
    def extract_pdf_text(file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")

    @staticmethod
    def extract_docx_text(file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")

    @staticmethod
    def extract_text(file_path: str, file_type: str) -> str:
        """Extract text from any supported file type"""
        if file_type.lower() == "pdf":
            return ResumeParserService.extract_pdf_text(file_path)
        elif file_type.lower() == "docx":
            return ResumeParserService.extract_docx_text(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    @staticmethod
    def parse_resume(raw_text: str) -> Dict[str, Any]:
        """Parse resume text and extract structured data"""
        parsed = {
            "name": ResumeParserService._extract_name(raw_text),
            "email": ResumeParserService._extract_email(raw_text),
            "phone": ResumeParserService._extract_phone(raw_text),
            "skills": ResumeParserService._extract_skills(raw_text),
            "education": ResumeParserService._extract_education(raw_text),
            "experience": ResumeParserService._extract_experience(raw_text),
            "summary": raw_text[:500],  # First 500 chars as summary
        }
        return parsed

    @staticmethod
    def _extract_email(text: str) -> str:
        """Extract email address"""
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else ""

    @staticmethod
    def _extract_phone(text: str) -> str:
        """Extract phone number"""
        phone_pattern = r'\+?1?\d{9,15}|(?:\+\d{1,3})?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        matches = re.findall(phone_pattern, text)
        return matches[0] if matches else ""

    @staticmethod
    def _extract_name(text: str) -> str:
        """Extract name from resume (usually first line or after contact)"""
        lines = text.split('\n')
        # Usually name is in first few lines and is capitalized
        for line in lines[:5]:
            line = line.strip()
            if line and len(line) < 100 and line.isupper() or (line[0].isupper() and ' ' in line):
                return line
        return "Unknown"

    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        """Extract skills from resume"""
        # Common tech skills - can be expanded
        tech_skills = [
            "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php", "go", "rust",
            "react", "vue", "angular", "svelte", "fastapi", "django", "flask", "spring", "express",
            "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
            "git", "rest api", "graphql", "sql", "nosql",
            "machine learning", "deep learning", "nlp", "computer vision",
            "html", "css", "bootstrap", "tailwind", "sass"
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in tech_skills:
            if skill in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates

    @staticmethod
    def _extract_education(text: str) -> List[str]:
        """Extract education information"""
        education_keywords = ["bachelor", "master", "phd", "diploma", "certificate", "b.tech", "b.s", "m.s", "bca", "mca"]
        education = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in education_keywords):
                education.append(line.strip())
        return education

    @staticmethod
    def _extract_experience(text: str) -> List[str]:
        """Extract work experience"""
        experience_keywords = ["experience", "worked", "responsibilities", "years"]
        experience = []
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in experience_keywords):
                experience.append(line.strip())
                if i + 1 < len(lines):
                    experience.append(lines[i + 1].strip())
        return experience
