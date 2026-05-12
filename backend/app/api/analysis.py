"""Analysis routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User, Resume, JobDescription, AnalysisResult
from app.schemas import AnalysisResultCreate, AnalysisResultResponse
from app.services.analysis_service import ResumeAnalysisService

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("", response_model=AnalysisResultResponse, status_code=status.HTTP_201_CREATED)
async def analyze_resume(
    analysis_data: AnalysisResultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze resume against job description."""
    
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == analysis_data.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get job description
    job_description = db.query(JobDescription).filter(
        JobDescription.id == analysis_data.job_description_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    # Check if analysis already exists for this resume/job pair.
    # Recompute instead of returning stale cached results so file updates are reflected.
    existing = db.query(AnalysisResult).filter(
        AnalysisResult.resume_id == analysis_data.resume_id,
        AnalysisResult.job_description_id == analysis_data.job_description_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
    
    # Perform analysis
    analysis_result = ResumeAnalysisService.analyze_resume(resume, job_description, db)
    
    return analysis_result


@router.get("/{analysis_id}", response_model=AnalysisResultResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis result by ID."""
    analysis = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis


@router.get("", response_model=list[AnalysisResultResponse])
async def list_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all analyses for current user."""
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).all()
    return analyses


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete analysis result."""
    analysis = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    db.delete(analysis)
    db.commit()
