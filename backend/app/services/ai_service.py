"""AI-powered services."""
import os
from typing import Optional
from app.config import get_settings

settings = get_settings()


class AIService:
    """Service for AI-powered features."""

    @staticmethod
    def generate_cover_letter(
        resume_name: str,
        resume_summary: str,
        resume_skills: list,
        job_title: str,
        company_name: str,
        job_description: str
    ) -> str:
        """Generate AI cover letter using OpenAI or Gemini."""
        
        # Prefer OpenAI if available
        if settings.OPENAI_API_KEY:
            return AIService._generate_with_openai(
                resume_name, resume_summary, resume_skills, job_title, company_name, job_description
            )
        elif settings.GEMINI_API_KEY:
            return AIService._generate_with_gemini(
                resume_name, resume_summary, resume_skills, job_title, company_name, job_description
            )
        else:
            return AIService._generate_template(
                resume_name, job_title, company_name, resume_skills
            )

    @staticmethod
    def _generate_with_openai(
        resume_name: str,
        resume_summary: str,
        resume_skills: list,
        job_title: str,
        company_name: str,
        job_description: str
    ) -> str:
        """Generate cover letter using OpenAI API."""
        try:
            import openai
            
            openai.api_key = settings.OPENAI_API_KEY
            
            skills_str = ", ".join(resume_skills[:10]) if resume_skills else "various technical skills"
            
            prompt = f"""Write a professional cover letter for the following:
            
Candidate Name: {resume_name}
Professional Summary: {resume_summary}
Key Skills: {skills_str}
Job Title: {job_title}
Company: {company_name}
Job Description: {job_description}

Please write a compelling, personalized cover letter that highlights relevant skills and experience."""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional cover letter writer. Write engaging, personalized cover letters."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating cover letter with OpenAI: {e}")
            return AIService._generate_template(resume_name, job_title, company_name, resume_skills)

    @staticmethod
    def _generate_with_gemini(
        resume_name: str,
        resume_summary: str,
        resume_skills: list,
        job_title: str,
        company_name: str,
        job_description: str
    ) -> str:
        """Generate cover letter using Gemini API."""
        try:
            import google.generativeai as genai
            
            genai.configure(api_key=settings.GEMINI_API_KEY)
            
            skills_str = ", ".join(resume_skills[:10]) if resume_skills else "various technical skills"
            
            prompt = f"""Write a professional cover letter for the following:
            
Candidate Name: {resume_name}
Professional Summary: {resume_summary}
Key Skills: {skills_str}
Job Title: {job_title}
Company: {company_name}
Job Description: {job_description}

Please write a compelling, personalized cover letter that highlights relevant skills and experience."""
            
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            return response.text
        except Exception as e:
            print(f"Error generating cover letter with Gemini: {e}")
            return AIService._generate_template(resume_name, job_title, company_name, resume_skills)

    @staticmethod
    def _generate_template(
        resume_name: str,
        job_title: str,
        company_name: str,
        resume_skills: list
    ) -> str:
        """Generate template cover letter."""
        skills_str = ", ".join(resume_skills[:5]) if resume_skills else "various technical skills"
        
        cover_letter = f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company_name}. With my solid foundation in {skills_str}, I am confident in my ability to make meaningful contributions to your team.

Throughout my professional career, I have developed expertise in several key areas that align perfectly with your job requirements. My technical skills and problem-solving abilities have consistently delivered results and driven project success.

I am particularly drawn to {company_name} because of your innovative approach and commitment to excellence. I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my experience and skills can benefit your organization.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
{resume_name}"""
        
        return cover_letter

    @staticmethod
    def get_skill_recommendations(missing_skills: list) -> list:
        """Get learning recommendations for missing skills."""
        
        # Sample recommendations database
        skill_courses = {
            "python": {
                "course_name": "Python for Everybody",
                "provider": "Coursera",
                "url": "https://www.coursera.org/specializations/python",
                "difficulty": "Beginner",
                "hours": 40
            },
            "react": {
                "course_name": "React - The Complete Guide",
                "provider": "Udemy",
                "url": "https://www.udemy.com/course/react-the-complete-guide/",
                "difficulty": "Intermediate",
                "hours": 50
            },
            "docker": {
                "course_name": "Docker Mastery",
                "provider": "Udemy",
                "url": "https://www.udemy.com/course/docker-mastery/",
                "difficulty": "Intermediate",
                "hours": 25
            },
            "kubernetes": {
                "course_name": "Kubernetes for Developers",
                "provider": "Linux Academy",
                "url": "https://linuxacademy.com/",
                "difficulty": "Advanced",
                "hours": 35
            },
            "aws": {
                "course_name": "AWS Solutions Architect Associate",
                "provider": "A Cloud Guru",
                "url": "https://acloudguru.com/",
                "difficulty": "Intermediate",
                "hours": 30
            },
        }
        
        recommendations = []
        for skill in missing_skills[:5]:
            skill_lower = skill.lower()
            if skill_lower in skill_courses:
                recommendations.append(skill_courses[skill_lower])
            else:
                recommendations.append({
                    "course_name": f"Complete {skill} Masterclass",
                    "provider": "Udemy",
                    "url": "https://www.udemy.com",
                    "difficulty": "Intermediate",
                    "hours": 30
                })
        
        return recommendations
