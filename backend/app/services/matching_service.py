from typing import Dict, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class MatchingService:
    @staticmethod
    def calculate_match_score(
        resume_text: str,
        job_text: str,
        resume_skills: List[str] = None,
        job_skills: List[str] = None,
    ) -> Dict:
        resume_text = resume_text or ""
        job_text = job_text or ""
        vectorizer = TfidfVectorizer(stop_words="english")
        try:
            vectors = vectorizer.fit_transform([resume_text, job_text])
            text_match = float(cosine_similarity(vectors[0], vectors[1])[0][0]) * 100
        except Exception:
            text_match = 0.0

        resume_skills = [s.lower() for s in (resume_skills or [])]
        job_skills = [s.lower() for s in (job_skills or [])]
        matching_skills = sorted(set(resume_skills).intersection(job_skills))
        missing_skills = sorted(set(job_skills).difference(resume_skills))
        skill_match = (len(matching_skills) / len(job_skills) * 100) if job_skills else 0.0

        score = (text_match * 0.6) + (skill_match * 0.4)
        return {
            "match_score": round(score, 2),
            "text_match": round(text_match, 2),
            "skill_match": round(skill_match, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
        }

    @staticmethod
    def detect_skill_gaps(resume_skills: List[str], job_skills: List[str]) -> Dict:
        resume_set = {skill.lower() for skill in resume_skills or []}
        job_set = {skill.lower() for skill in job_skills or []}
        missing = sorted(job_set - resume_set)
        matching = sorted(job_set & resume_set)
        extra = sorted(resume_set - job_set)
        return {
            "matching_skills": matching,
            "missing_skills": missing,
            "extra_skills": extra,
            "gap_percentage": (len(missing) / len(job_set) * 100) if job_set else 0.0,
            "recommendations": MatchingService._generate_recommendations(missing),
            "learning_roadmap": [
                f"Learn {skill} fundamentals" for skill in missing[:5]
            ],
        }

    @staticmethod
    def calculate_ats_score(resume_text: str) -> Dict:
        text = resume_text or ""
        score = 100
        issues = []

        if "@" not in text:
            score -= 15
            issues.append("Missing email address")
        if not any(char.isdigit() for char in text):
            score -= 10
            issues.append("Missing phone number")
        if not any(k in text.lower() for k in ["education", "experience", "skills"]):
            score -= 25
            issues.append("Missing standard resume sections")
        if len(text.split()) < 100:
            score -= 10
            issues.append("Resume too short")

        score = max(0, score)
        return {
            "score": score,
            "issues": issues,
            "improvements": MatchingService._ats_improvements(issues),
        }

    @staticmethod
    def _generate_recommendations(missing_skills: List[str]) -> List[Dict]:
        resource_map = {
            "python": "Python official tutorial",
            "javascript": "MDN JavaScript guide",
            "react": "React docs",
            "fastapi": "FastAPI docs",
            "sql": "SQLBolt",
            "postgresql": "PostgreSQL tutorial",
            "docker": "Docker getting started",
            "aws": "AWS Skill Builder",
            "nlp": "spaCy course",
            "machine learning": "Coursera ML specialization",
        }
        return [
            {
                "skill": skill,
                "resource": resource_map.get(skill, f"Learn {skill} with a trusted online course"),
                "difficulty": "Intermediate",
                "estimated_time": "2-4 weeks",
            }
            for skill in missing_skills[:10]
        ]

    @staticmethod
    def _ats_improvements(issues: List[str]) -> List[str]:
        mapping = {
            "email": "Add a visible email address near the top of the resume.",
            "phone": "Add a phone number in the header section.",
            "sections": "Add standard sections like Summary, Skills, Experience, Education.",
            "short": "Expand your resume with measurable achievements and projects.",
        }
        return [next((text for key, text in mapping.items() if key in issue.lower()), f"Improve: {issue}") for issue in issues]
