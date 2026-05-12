"""File handling utilities."""
import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import get_settings

settings = get_settings()


def create_upload_folder():
    """Create upload folder if it doesn't exist."""
    Path(settings.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file."""
    # Check file type
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX files are allowed."
        )
    
    # Check file size in a safe way (UploadFile may not expose size)
    try:
        current_pos = file.file.tell()
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(current_pos)
    except Exception:
        size = None

    if size is not None and size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE} bytes"
        )


async def save_upload_file(file: UploadFile, user_id: int) -> str:
    """Save uploaded file and return file path."""
    validate_file(file)
    create_upload_folder()
    
    # Create user folder
    user_folder = os.path.join(settings.UPLOAD_FOLDER, str(user_id))
    Path(user_folder).mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    filename = f"{user_id}_{file.filename}"
    file_path = os.path.join(user_folder, filename)
    
    # Ensure file pointer is at start before saving
    try:
        file.file.seek(0)
    except Exception:
        pass

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        # Cleanup partial file if write failed
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file"
        )
    
    return file_path


def delete_file(file_path: str) -> None:
    """Delete file if it exists."""
    if os.path.exists(file_path):
        os.remove(file_path)
