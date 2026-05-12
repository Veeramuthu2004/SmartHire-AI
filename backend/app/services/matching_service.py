from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import Dict, List, Tuple
import json

class MatchingService:
    """Resume to Job matching engine"""

    @staticmethod
    def calculate_match_score(resume_text: str, job_text: str, resume_skills: List[str] = None, job_skills: List[str] = None) -> Dict:
        """Calculate match score between resume and job description"""
        
        # Text similarity using TF-IDF
        vectorizer = TfidfVectorizer(analyzer='char', ngram_range=(2, 2))
        try:
            vectors = vectorizer.fit_transform([resume_text, job_text])
            similarity = cosine_similarity(vectors)[0][1]
            text_match = float(similarity) * 100
        except:
            text_match = 0

        # Skill matching
        if resume_skills and job_skills:
            matching_skills = list(set(resume_skills) & set(job_skills))
            missing_skills = list(set(job_skills) - set(resume_skills))
            skill_match = (len(matching_skills) / len(job_skills) * 100) if job_skills else 0
        else:
            matching_skills = []
            missing_skills = []
            skill_match = 0

        # Combined match score (weighted average)
        combined_score = (text_match * 0.6 + skill_match * 0.4)

        return {
            "match_score": round(combined_score, 2),
            "text_match": round(text_match, 2),
            "skill_match": round(skill_match, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
        }

    @staticmethod
    def detect_skill_gaps(resume_skills: List[str], job_skills: List[str]) -> Dict:
        """Detect skill gaps and generate recommendations"""
        
        resume_set = set(skill.lower() for skill in resume_skills)
        job_set = set(skill.lower() for skill in job_skills)
        
        matching = list(resume_set & job_set)
        missing = list(job_set - resume_set)
        extra = list(resume_set - job_set)

        # Generate recommendations based on missing skills
        recommendations = MatchingService._generate_recommendations(missing)

        return {
            "matching_skills": matching,
            "missing_skills": missing,
            "extra_skills": extra,
            "gap_percentage": (len(missing) / len(job_set) * 100) if job_set else 0,
            "recommendations": recommendations,
        }

    @staticmethod
    def _generate_recommendations(missing_skills: List[str]) -> List[Dict]:
        """Generate learning recommendations for missing skills"""
        
        recommendations = []
        skill_resources = {
            "python": "Learn Python from Codecademy or DataCamp",
            "javascript": "Master JavaScript with freeCodeCamp or Udemy",
            "react": "Learn React from official React documentation or Scrimba",
            "docker": "Understand Docker with Docker official tutorials",
            "kubernetes": "Master Kubernetes with Linux Academy",
            "aws": "Get AWS certified with AWS training",
            "machine learning": "Take Andrew Ng's ML course on Coursera",
            "sql": "Learn SQL databases with W3Schools or SQLZoo",
            "git": "Master Git with GitHub Learning Lab",
        }

        for skill in missing_skills[:5]:  # Top 5 recommendations
            resource = skill_resources.get(skill.lower(), f"Learn {skill} through online courses")
            recommendations.append({
                "skill": skill,
                "resource": resource,
                "difficulty": "Intermediate",
                "estimated_time": "2-4 weeks"
            })

        return recommendations

    @staticmethod
    def calculate_ats_score(resume_text: str) -> Dict:
        """Calculate ATS (Applicant Tracking System) score"""
        
        score = 100
        issues = []

        # Check for proper formatting
        if not resume_text:
            return {"score": 0, "issues": ["Empty resume"]}

        # Check for contact information
        if "@" not in resume_text:
            score -= 20
            issues.append("Missing email address")
        
        if any(pattern in resume_text.lower() for pattern in ["phone", "contact", "+1", "("]):
            pass
        else:
            score -= 10
            issues.append("Phone number not found")

        # Check for education section
        if not any(keyword in resume_text.lower() for keyword in ["education", "degree", "bachelor", "master"]):
            score -= 10
            issues.append("No education section found")

        # Check for experience section
        if not any(keyword in resume_text.lower() for keyword in ["experience", "worked", "job", "position"]):
            score -= 10
            issues.append("No work experience section found")

        # Check for skills section
        if not any(keyword in resume_text.lower() for keyword in ["skills", "technical", "abilities"]):
            score -= 5
            issues.append("No skills section found")

        # Check document length
        word_count = len(resume_text.split())
        if word_count < 100:
            score -= 10
            issues.append("Resume too short (minimum 100 words recommended)")
        elif word_count > 1500:
            score -= 5
            issues.append("Resume too long (consider condensing to max 1 page)")

        return {
            "score": max(0, score),
            "issues": issues,
            "improvements": MatchingService._ats_improvements(issues)
        }

    @staticmethod
    def _ats_improvements(issues: List[str]) -> List[str]:
        """Generate improvement suggestions based on ATS issues"""
        improvements = []
        for issue in issues:
            if "email" in issue.lower():
                improvements.append("Add your email address prominently near the top of your resume")
            elif "phone" in issue.lower():
                improvements.append("Include your phone number in the contact section")
            elif "education" in issue.lower():
                improvements.append("Add a dedicated 'Education' section with degree and institution")
            elif "experience" in issue.lower():
                improvements.append("Add an 'Experience' or 'Work History' section")
            elif "skills" in issue.lower():
                improvements.append("Create a 'Technical Skills' section listing relevant skills")
            elif "short" in issue.lower():
                improvements.append("Expand your resume with more details about achievements and responsibilities")
        return improvements
