from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from datetime import datetime
from app.database import get_db
from app.models import Resume
from app.services import ResumeParserService

router = APIRouter()

class ResumeData(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_at: datetime
    parsed_data: dict

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    message: str

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), user_id: int = 1, db: Session = Depends(get_db)):
    """Upload resume file (PDF or DOCX)"""
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed"
        )

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file extension"
        )

    uploads_dir = os.getenv("UPLOAD_FOLDER", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    file_path = os.path.join(uploads_dir, f"{datetime.utcnow().timestamp()}_{file.filename}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    try:
        raw_text = ResumeParserService.extract_text(file_path, file_ext)
        parsed_data = ResumeParserService.parse_resume(raw_text)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse resume: {str(e)}"
        )

    db_resume = Resume(
        user_id=user_id,
        filename=file.filename,
        file_path=file_path,
        file_type=file_ext,
        raw_text=raw_text,
        parsed_data=parsed_data
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return {
        "id": db_resume.id,
        "filename": db_resume.filename,
        "file_type": db_resume.file_type,
        "message": "Resume uploaded and parsed successfully"
    }

@router.get("/list", response_model=List[ResumeData])
async def list_resumes(user_id: int = 1, db: Session = Depends(get_db)):
    """List user's resumes"""
    resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeData)
async def get_resume(resume_id: int, db: Session = Depends(get_db)):
    """Get resume details"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return resume

@router.delete("/{resume_id}")
async def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """Delete a resume"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}
