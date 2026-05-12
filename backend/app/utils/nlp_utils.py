"""NLP utilities for resume analysis."""
from typing import Dict, List, Set
import spacy
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


TECHNICAL_SKILLS = {
    # Languages
    "python", "java", "javascript", "typescript", "csharp", "c++", "ruby", "php", "swift",
    "kotlin", "golang", "rust", "scala", "groovy", "perl",
    
    # Frontend
    "react", "angular", "vue", "svelte", "html", "css", "sass", "less", "tailwind",
    "bootstrap", "material", "jquery", "redux", "vuex",
    
    # Backend
    "fastapi", "django", "flask", "nodejs", "express", "springboot", "aspnet",
    "laravel", "rails", "gin", "echo", "fiber",
    
    # Databases
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
    "dynamodb", "firestore", "oracle", "mssql",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github",
    "ci/cd", "terraform", "ansible", "cloudformation",
    
    # Data & ML
    "tensorflow", "pytorch", "sklearn", "pandas", "numpy", "spark", "hadoop",
    "sql", "nosql", "data mining", "machine learning", "deep learning",
    
    # APIs & Protocols
    "rest", "graphql", "soap", "websocket", "grpc", "mqtt",
    
    # Testing
    "jest", "pytest", "junit", "testng", "mocha", "chai", "selenium", "cypress",
    
    # Tools
    "git", "svn", "jira", "confluence", "slack", "figma", "postman",
}


def extract_entities(text: str) -> Dict[str, List[str]]:
    """Extract named entities from text using spaCy."""
    doc = nlp(text.lower())
    
    entities = {}
    for ent in doc.ents:
        if ent.label_ not in entities:
            entities[ent.label_] = []
        entities[ent.label_].append(ent.text)
    
    return entities


def extract_keywords(text: str) -> List[str]:
    """Extract technical skills and keywords from text."""
    text_lower = text.lower()
    
    # Extract technical skills
    found_skills = []
    for skill in TECHNICAL_SKILLS:
        if skill in text_lower:
            found_skills.append(skill)
    
    # Remove duplicates and sort
    found_skills = sorted(list(set(found_skills)))
    
    return found_skills


def calculate_match_score(resume_text: str, job_description: str) -> float:
    """Calculate similarity score between resume and job description."""
    try:
        # TF-IDF vectorization
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        texts = [resume_text, job_description]
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
        
        # Convert to percentage
        match_score = max(0, min(100, similarity * 100))
        return round(match_score, 2)
    except Exception as e:
        print(f"Error calculating match score: {e}")
        return 0.0


def find_matching_skills(resume_skills: List[str], job_skills: List[str]) -> List[str]:
    """Find skills that match between resume and job description."""
    resume_skills_lower = [skill.lower() for skill in resume_skills]
    job_skills_lower = [skill.lower() for skill in job_skills]
    
    matching = [skill for skill in resume_skills_lower if skill in job_skills_lower]
    return list(set(matching))


def find_missing_skills(resume_skills: List[str], job_skills: List[str]) -> List[str]:
    """Find skills required for job that are missing from resume."""
    resume_skills_lower = [skill.lower() for skill in resume_skills]
    job_skills_lower = [skill.lower() for skill in job_skills]
    
    missing = [skill for skill in job_skills_lower if skill not in resume_skills_lower]
    return list(set(missing))


def extract_skills_from_job_description(job_description: str) -> List[str]:
    """Extract technical skills from job description."""
    return extract_keywords(job_description)


def calculate_ats_score(resume_text: str, job_description: str) -> float:
    """Calculate ATS (Applicant Tracking System) compatibility score."""
    # Extract keywords from both texts
    resume_skills = set(extract_keywords(resume_text))
    job_skills = set(extract_keywords(job_description))
    
    if not job_skills:
        return 0.0
    
    # Calculate percentage of job skills present in resume
    matching_count = len(resume_skills.intersection(job_skills))
    ats_score = (matching_count / len(job_skills)) * 100
    
    return round(ats_score, 2)


def get_improvement_suggestions(resume_text: str, job_description: str) -> List[str]:
    """Generate improvement suggestions based on job requirements."""
    suggestions = []
    
    # Find missing skills
    resume_skills = extract_keywords(resume_text)
    job_skills = extract_keywords(job_description)
    missing_skills = find_missing_skills(resume_skills, job_skills)
    
    if missing_skills:
        suggestions.append(f"Add skills: {', '.join(missing_skills[:5])}")
    
    # Check for specific keywords in job description
    job_description_lower = job_description.lower()
    if "certification" in job_description_lower or "certified" in job_description_lower:
        if "certification" not in resume_text.lower():
            suggestions.append("Consider adding relevant certifications")
    
    if "leadership" in job_description_lower or "team lead" in job_description_lower:
        if "lead" not in resume_text.lower():
            suggestions.append("Highlight leadership experience")
    
    if "years" in job_description_lower:
        suggestions.append("Ensure your experience matches the years required")
    
    return suggestions[:5]  # Return top 5 suggestions
