"""Cover letter routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User, Resume, CoverLetter
from app.schemas import CoverLetterCreate, CoverLetterResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/cover-letter", tags=["cover-letter"])


@router.post("", response_model=CoverLetterResponse, status_code=status.HTTP_201_CREATED)
async def generate_cover_letter(
    cover_letter_data: CoverLetterCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered cover letter."""
    
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == cover_letter_data.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Extract skills from resume
    resume_skills = [skill.name for skill in resume.skills]
    
    # Generate cover letter
    content = AIService.generate_cover_letter(
        resume_name=resume.name or current_user.full_name or current_user.username,
        resume_summary=resume.summary or "",
        resume_skills=resume_skills,
        job_title=cover_letter_data.job_title,
        company_name=cover_letter_data.company_name,
        job_description=cover_letter_data.job_description or ""
    )
    
    # Save to database
    cover_letter = CoverLetter(
        user_id=current_user.id,
        job_title=cover_letter_data.job_title,
        company_name=cover_letter_data.company_name,
        content=content
    )
    
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    
    return cover_letter


@router.get("/{cover_letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    cover_letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get cover letter by ID."""
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == cover_letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    return cover_letter


@router.get("", response_model=list[CoverLetterResponse])
async def list_cover_letters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all cover letters for current user."""
    cover_letters = db.query(CoverLetter).filter(
        CoverLetter.user_id == current_user.id
    ).all()
    return cover_letters


@router.delete("/{cover_letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter(
    cover_letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete cover letter."""
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == cover_letter_id,
        CoverLetter.user_id == current_user.id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    db.delete(cover_letter)
    db.commit()
