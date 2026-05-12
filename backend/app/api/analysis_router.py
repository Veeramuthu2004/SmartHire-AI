from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Analysis, Resume
from app.services import MatchingService

router = APIRouter()

class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str

class SkillInfo(BaseModel):
    skill: str
    resource: Optional[str] = None
    difficulty: Optional[str] = None
    estimated_time: Optional[str] = None

class AnalysisResult(BaseModel):
    id: int
    resume_id: int
    match_score: float
    ats_score: Optional[float] = None
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[SkillInfo]
    skill_gap_analysis: dict
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(request: AnalysisRequest, user_id: int = 1, db: Session = Depends(get_db)):
    """Analyze resume and provide feedback"""
    
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == user_id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    previous = db.query(Analysis).filter(Analysis.resume_id == request.resume_id).first()
    if previous:
        db.delete(previous)
        db.commit()

    job_skills = _extract_job_skills(request.job_description)

    match_result = MatchingService.calculate_match_score(
        resume.raw_text,
        request.job_description,
        resume.parsed_data.get("skills", []),
        job_skills
    )

    ats_result = MatchingService.calculate_ats_score(resume.raw_text)

    skill_gap = MatchingService.detect_skill_gaps(
        resume.parsed_data.get("skills", []),
        job_skills
    )

    analysis = Analysis(
        user_id=user_id,
        resume_id=request.resume_id,
        job_description_text=request.job_description,
        match_score=match_result["match_score"],
        ats_score=ats_result["score"],
        matching_skills=match_result["matching_skills"],
        missing_skills=match_result["missing_skills"],
        recommendations=skill_gap["recommendations"],
        skill_gap_analysis=skill_gap
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "match_score": analysis.match_score,
        "ats_score": analysis.ats_score,
        "matching_skills": analysis.matching_skills,
        "missing_skills": analysis.missing_skills,
        "recommendations": analysis.recommendations,
        "skill_gap_analysis": analysis.skill_gap_analysis,
        "created_at": analysis.created_at,
    }

@router.get("/results/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_results(analysis_id: int, db: Session = Depends(get_db)):
    """Get analysis results"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    return analysis

@router.get("/history", response_model=List[AnalysisResult])
async def get_analysis_history(user_id: int = 1, db: Session = Depends(get_db)):
    """Get all user's analysis history"""
    analyses = db.query(Analysis).filter(Analysis.user_id == user_id).all()
    return analyses

@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    """Delete an analysis"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == user_id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    db.delete(analysis)
    db.commit()
    
    return {"message": "Analysis deleted successfully"}

def _extract_job_skills(text: str) -> List[str]:
    """Extract technical skills from job description text"""
    skills_list = [
        "python", "javascript", "java", "c++", "c#", "php", "ruby", "go", "rust",
        "react", "angular", "vue", "svelte", "nextjs", "nuxt",
        "nodejs", "express", "fastapi", "django", "flask", "spring",
        "docker", "kubernetes", "aws", "azure", "gcp", "heroku",
        "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "git", "rest api", "graphql", "oauth", "jwt", "websocket"
    ]
    text_lower = text.lower()
    return [skill for skill in skills_list if skill in text_lower]
