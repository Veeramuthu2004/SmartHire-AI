"""Resume routes."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User, Resume
from app.schemas import ResumeResponse
from app.utils.file_handler import save_upload_file, delete_file
from app.services.analysis_service import ResumeAnalysisService

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """Upload and parse resume."""
    
    # Save file
    file_path = await save_upload_file(file, current_user.id)
    
    # Create resume record
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_type=file.filename.split('.')[-1].upper()
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    # Parse and extract resume data in background (do not block upload)
    try:
        if background_tasks is not None:
            background_tasks.add_task(
                ResumeAnalysisService.parse_and_save_resume_background,
                resume.id,
            )
        else:
            ResumeAnalysisService.parse_and_save_resume_background(resume.id)
    except Exception as e:
        # Log error but don't fail the upload
        print(f"Error scheduling resume parse: {e}")
    
    return resume


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get resume by ID."""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume


@router.get("", response_model=list[ResumeResponse])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all resumes for current user."""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete resume."""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file
    delete_file(resume.file_path)
    
    # Delete from database
    db.delete(resume)
    db.commit()
