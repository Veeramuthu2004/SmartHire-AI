"""Resume analysis service."""
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Resume, JobDescription, AnalysisResult, Skill, User
from app.utils.nlp_utils import (
    calculate_match_score,
    find_matching_skills,
    find_missing_skills,
    extract_skills_from_job_description,
    calculate_ats_score,
    get_improvement_suggestions
)
from app.utils.resume_parser import parse_pdf, parse_docx
from app.database.session import SessionLocal
from sqlalchemy.orm import Session as OrmSession


class ResumeAnalysisService:
    """Service for resume analysis."""

    @staticmethod
    def analyze_resume(
        resume: Resume,
        job_description: JobDescription,
        db: Session
    ) -> AnalysisResult:
        """Analyze resume against job description."""
        
        # Extract text from resume file
        if resume.file_type.lower() == "pdf":
            resume_data = parse_pdf(resume.file_path)
            resume_text = resume_data.get("full_text", "")
        else:  # DOCX
            resume_data = parse_docx(resume.file_path)
            resume_text = resume_data.get("full_text", "")
        
        job_description_text = job_description.description + " " + (job_description.requirements or "")
        
        # Calculate scores
        match_percentage = calculate_match_score(resume_text, job_description_text)
        ats_score = calculate_ats_score(resume_text, job_description_text)
        
        # Extract skills
        resume_skills = resume_data.get("skills", [])
        job_skills = extract_skills_from_job_description(job_description_text)
        
        matching_skills = find_matching_skills(resume_skills, job_skills)
        missing_skills = find_missing_skills(resume_skills, job_skills)
        
        # Get improvement suggestions
        improvement_suggestions = get_improvement_suggestions(resume_text, job_description_text)
        
        # Create analysis result
        analysis_result = AnalysisResult(
            user_id=resume.user_id,
            resume_id=resume.id,
            job_description_id=job_description.id,
            match_percentage=match_percentage,
            ats_score=ats_score,
            similarity_score=match_percentage,
            matching_skills=matching_skills,
            missing_skills=missing_skills,
            skill_recommendations=missing_skills[:10],
            improvement_suggestions=improvement_suggestions
        )
        
        db.add(analysis_result)
        db.commit()
        db.refresh(analysis_result)
        
        return analysis_result

    @staticmethod
    def parse_and_save_resume(
        resume: Resume,
        db: Session
    ) -> None:
        """Parse resume and save extracted data."""
        
        # Parse resume file
        if resume.file_type.lower() == "pdf":
            resume_data = parse_pdf(resume.file_path)
        else:  # DOCX
            resume_data = parse_docx(resume.file_path)
        
        # Update resume with extracted data
        resume.name = resume_data.get("name")
        resume.email = resume_data.get("email")
        resume.phone = resume_data.get("phone")
        resume.summary = resume_data.get("summary")
        resume.education = resume_data.get("education")
        resume.experience = resume_data.get("experience")
        resume.projects = resume_data.get("projects")
        
        # Add skills to database
        for skill_name in resume_data.get("skills", []):
            # Check if skill exists
            skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
            if not skill:
                skill = Skill(name=skill_name.lower(), category="Technical")
                db.add(skill)
                db.commit()
                db.refresh(skill)
            
            # Add skill to resume if not already there
            if skill not in resume.skills:
                resume.skills.append(skill)
        
        db.commit()

    @staticmethod
    def parse_and_save_resume_background(resume_id: int) -> None:
        """Parse resume in background using a fresh DB session."""
        db: OrmSession = SessionLocal()
        try:
            resume = db.query(Resume).filter(Resume.id == resume_id).first()
            if not resume:
                return

            # Parse resume file
            if resume.file_type.lower() == "pdf":
                resume_data = parse_pdf(resume.file_path)
            else:  # DOCX
                resume_data = parse_docx(resume.file_path)

            # Update resume with extracted data
            resume.name = resume_data.get("name")
            resume.email = resume_data.get("email")
            resume.phone = resume_data.get("phone")
            resume.summary = resume_data.get("summary")
            resume.education = resume_data.get("education")
            resume.experience = resume_data.get("experience")
            resume.projects = resume_data.get("projects")

            # Add skills to database
            for skill_name in resume_data.get("skills", []):
                skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
                if not skill:
                    skill = Skill(name=skill_name.lower(), category="Technical")
                    db.add(skill)
                    db.commit()
                    db.refresh(skill)

                if skill not in resume.skills:
                    resume.skills.append(skill)

            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
