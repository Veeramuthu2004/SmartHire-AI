from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.database import get_db
from app.models import Analysis, Resume, JobDescription, CoverLetter
from app.services import MatchingService

router = APIRouter()

class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str
    job_title: Optional[str] = None
    company: Optional[str] = None

class CoverLetterRequest(BaseModel):
    resume_id: int
    job_title: str
    company: str
    job_description: str

class AnalysisResult(BaseModel):
    id: int
    resume_id: int
    match_score: float
    ats_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[dict]
    skill_gap_analysis: dict
    created_at: datetime

    class Config:
        from_attributes = True


class CoverLetterResult(BaseModel):
    id: int
    job_title: str
    company: str
    generated_text: str

    class Config:
        from_attributes = True


def _extract_job_skills(text: str) -> List[str]:
    skill_terms = [
        "python", "javascript", "typescript", "react", "nextjs", "nodejs", "fastapi",
        "django", "flask", "sql", "postgresql", "mysql", "mongodb", "redis",
        "aws", "docker", "kubernetes", "git", "html", "css", "tailwind", "spaCy",
        "pandas", "numpy", "scikit-learn", "machine learning", "nlp", "graphql"
    ]
    lowered = (text or "").lower()
    return [skill for skill in skill_terms if skill in lowered]

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(request: AnalysisRequest, user_id: int = 1, db: Session = Depends(get_db)):
    """Analyze resume and provide feedback"""
    resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    job_skills = _extract_job_skills(request.job_description)
    skill_match = MatchingService.calculate_match_score(
        resume.raw_text,
        request.job_description,
        resume.parsed_data.get("skills", []) if resume.parsed_data else [],
        job_skills,
    )
    ats_result = MatchingService.calculate_ats_score(resume.raw_text)
    skill_gap = MatchingService.detect_skill_gaps(resume.parsed_data.get("skills", []) if resume.parsed_data else [], job_skills)

    job_desc = JobDescription(
        user_id=user_id,
        job_title=request.job_title,
        company=request.company,
        job_text=request.job_description,
        skills_required=job_skills,
    )
    db.add(job_desc)
    db.flush()

    analysis = Analysis(
        user_id=user_id,
        resume_id=resume.id,
        job_description_id=job_desc.id,
        job_description_text=request.job_description,
        match_score=skill_match["match_score"],
        ats_score=ats_result["score"],
        matching_skills=skill_match["matching_skills"],
        missing_skills=skill_match["missing_skills"],
        recommendations=skill_gap["recommendations"],
        skill_gap_analysis=skill_gap,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/results/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_results(analysis_id: int, db: Session = Depends(get_db)):
    """Get previous analysis results"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    return analysis

@router.get("/history", response_model=List[AnalysisResult])
async def get_analysis_history(user_id: int = 1, db: Session = Depends(get_db)):
    """Get all user's analysis history"""
    return db.query(Analysis).filter(Analysis.user_id == user_id).order_by(Analysis.created_at.desc()).all()

@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Delete an analysis"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted successfully"}


@router.post("/generate-cover-letter", response_model=CoverLetterResult)
async def generate_cover_letter(request: CoverLetterRequest, user_id: int = 1, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    name = (resume.parsed_data or {}).get("name") or "Candidate"
    generated_text = (
        f"Dear Hiring Team at {request.company},\n\n"
        f"I am excited to apply for the {request.job_title} role. "
        f"My background in {', '.join((resume.parsed_data or {}).get('skills', [])[:6]) or 'relevant technical skills'} "
        f"and my experience working on impactful projects make me a strong fit. "
        f"I am particularly drawn to {request.company}'s mission and believe I can contribute meaningfully.\n\n"
        f"Thank you for your consideration.\n\nSincerely,\n{name}"
    )
    cover_letter = CoverLetter(
        user_id=user_id,
        resume_id=request.resume_id,
        job_title=request.job_title,
        company=request.company,
        generated_text=generated_text,
    )
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    return cover_letter


@router.get("/dashboard/stats")
async def dashboard_stats(user_id: int = 1, db: Session = Depends(get_db)):
    analyses = db.query(Analysis).filter(Analysis.user_id == user_id).all()
    resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    avg_match = round(sum(a.match_score or 0 for a in analyses) / len(analyses), 2) if analyses else 0
    avg_ats = round(sum(a.ats_score or 0 for a in analyses) / len(analyses), 2) if analyses else 0
    return {
        "resume_count": len(resumes),
        "analysis_count": len(analyses),
        "average_match_score": avg_match,
        "average_ats_score": avg_ats,
        "recent_analyses": [
            {
                "id": a.id,
                "match_score": a.match_score,
                "ats_score": a.ats_score,
                "created_at": a.created_at,
            }
            for a in analyses[:10]
        ],
    }
