from fastapi import APIRouter, File, UploadFile, HTTPException, status
from typing import List, Optional

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload resume file (PDF or DOCX)"""
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed"
        )
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "Resume uploaded successfully"
    }

@router.get("/list")
async def list_resumes():
    """List user's resumes"""
    return {"resumes": []}

@router.get("/{resume_id}")
async def get_resume(resume_id: str):
    """Get resume details"""
    return {
        "id": resume_id,
        "filename": "sample.pdf",
        "uploaded_at": "2024-05-12T00:00:00Z",
        "parsed_content": None
    }

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete a resume"""
    return {"message": "Resume deleted successfully"}
