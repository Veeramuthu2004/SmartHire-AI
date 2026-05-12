"""Dashboard routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User, Resume, JobDescription, AnalysisResult
from app.schemas import DashboardStats, AnalysisResultResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current user."""
    
    # Get counts
    total_resumes = db.query(func.count(Resume.id)).filter(
        Resume.user_id == current_user.id
    ).scalar() or 0
    
    total_job_descriptions = db.query(func.count(JobDescription.id)).filter(
        JobDescription.user_id == current_user.id
    ).scalar() or 0
    
    total_analyses = db.query(func.count(AnalysisResult.id)).filter(
        AnalysisResult.user_id == current_user.id
    ).scalar() or 0
    
    # Get average match score
    avg_match = db.query(func.avg(AnalysisResult.match_percentage)).filter(
        AnalysisResult.user_id == current_user.id
    ).scalar() or 0
    
    # Get recent analyses
    recent_analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).limit(5).all()
    
    recent_analyses_response = [
        AnalysisResultResponse.model_validate(a) for a in recent_analyses
    ]
    
    return {
        "total_resumes": total_resumes,
        "total_job_descriptions": total_job_descriptions,
        "total_analyses": total_analyses,
        "average_match_score": round(float(avg_match), 2),
        "recent_analyses": recent_analyses_response
    }


@router.get("/analytics/match-scores")
async def get_match_scores(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get match scores for analytics."""
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).limit(10).all()
    
    return {
        "data": [
            {
                "job_title": a.job_description.title,
                "company": a.job_description.company_name,
                "match_score": a.match_percentage,
                "ats_score": a.ats_score,
                "date": a.created_at.isoformat()
            }
            for a in analyses
        ]
    }


@router.get("/analytics/skill-distribution")
async def get_skill_distribution(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get skill distribution across resumes."""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    
    skill_count = {}
    for resume in resumes:
        for skill in resume.skills:
            skill_count[skill.name] = skill_count.get(skill.name, 0) + 1
    
    return {
        "skills": [
            {"name": skill, "count": count}
            for skill, count in sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:20]
        ]
    }


@router.get("/analytics/application-history")
async def get_application_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get application history."""
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).all()
    
    return {
        "applications": [
            {
                "id": a.id,
                "job_title": a.job_description.title,
                "company": a.job_description.company_name,
                "match_score": a.match_percentage,
                "date": a.created_at.isoformat(),
                "status": "pending"
            }
            for a in analyses
        ]
    }
