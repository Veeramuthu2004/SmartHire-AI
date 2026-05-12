"""Resume parsing utilities."""
import json
from typing import Dict, Any, List
import PyPDF2
import pdfplumber
from docx import Document
from app.utils.nlp_utils import extract_entities, extract_keywords


def parse_pdf(file_path: str) -> Dict[str, Any]:
    """Parse PDF resume and extract information."""
    text = ""
    
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")
    
    return extract_resume_data(text)


def parse_docx(file_path: str) -> Dict[str, Any]:
    """Parse DOCX resume and extract information."""
    text = ""
    
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        raise Exception(f"Error parsing DOCX: {str(e)}")
    
    return extract_resume_data(text)


def extract_resume_data(text: str) -> Dict[str, Any]:
    """Extract structured data from resume text."""
    
    # Use NLP for entity extraction
    entities = extract_entities(text)
    
    # Extract skills
    keywords = extract_keywords(text)
    
    resume_data = {
        "name": extract_name(entities),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "summary": extract_summary(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
        "projects": extract_projects(text),
        "skills": keywords,
        "full_text": text
    }
    
    return resume_data


def extract_name(entities: Dict[str, Any]) -> str:
    """Extract name from entities."""
    # Try to find PERSON entity
    if "PERSON" in entities:
        persons = entities["PERSON"]
        if persons:
            return persons[0]
    return ""


def extract_email(text: str) -> str:
    """Extract email from text."""
    import re
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else ""


def extract_phone(text: str) -> str:
    """Extract phone number from text."""
    import re
    # Pattern for common phone formats
    phone_pattern = r'(?:\+?1[-.]?)?\(?(\d{3})\)?[-.]?(\d{3})[-.]?(\d{4})'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else ""


def extract_summary(text: str) -> str:
    """Extract professional summary from text."""
    # Look for common summary section keywords
    lines = text.split('\n')
    summary_lines = []
    in_summary = False
    
    for line in lines:
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in ['summary', 'profile', 'objective']):
            in_summary = True
            continue
        
        if in_summary:
            if any(keyword in lower_line for keyword in ['experience', 'education', 'skills']):
                break
            if line.strip():
                summary_lines.append(line.strip())
    
    return ' '.join(summary_lines[:3])  # First 3 lines of summary


def extract_education(text: str) -> List[Dict[str, str]]:
    """Extract education information from text."""
    education = []
    lines = text.split('\n')
    in_education = False
    
    for i, line in enumerate(lines):
        lower_line = line.lower()
        
        if 'education' in lower_line:
            in_education = True
            continue
        
        if in_education and any(keyword in lower_line for keyword in ['experience', 'skills', 'projects']):
            break
        
        # Simple heuristic: lines with common degree keywords
        if any(degree in line for degree in ['Bachelor', 'Master', 'PhD', 'B.S.', 'M.S.', 'B.A.', 'M.A.']):
            education.append({"degree": line.strip()})
    
    return education


def extract_experience(text: str) -> List[Dict[str, str]]:
    """Extract work experience from text."""
    experience = []
    lines = text.split('\n')
    in_experience = False
    current_job = {}
    
    for line in lines:
        lower_line = line.lower()
        
        if 'experience' in lower_line or 'employment' in lower_line:
            in_experience = True
            continue
        
        if in_experience and any(keyword in lower_line for keyword in ['education', 'skills', 'projects']):
            if current_job:
                experience.append(current_job)
            break
        
        if in_experience and line.strip():
            # Simple heuristic: lines that might be job titles
            if any(word in line for word in ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer']):
                if current_job:
                    experience.append(current_job)
                current_job = {"title": line.strip()}
            elif current_job and line.strip():
                current_job["description"] = line.strip()
    
    if current_job:
        experience.append(current_job)
    
    return experience


def extract_projects(text: str) -> List[Dict[str, str]]:
    """Extract projects from text."""
    projects = []
    lines = text.split('\n')
    in_projects = False
    
    for line in lines:
        lower_line = line.lower()
        
        if 'project' in lower_line:
            in_projects = True
            continue
        
        if in_projects and any(keyword in lower_line for keyword in ['experience', 'education', 'skills']):
            break
        
        if in_projects and line.strip():
            projects.append({"name": line.strip()})
    
    return projects
