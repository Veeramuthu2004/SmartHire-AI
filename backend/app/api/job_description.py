"""Job description routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.models import User, JobDescription, Skill
from app.schemas import JobDescriptionCreate, JobDescriptionResponse
from app.utils.nlp_utils import extract_skills_from_job_description

router = APIRouter(prefix="/api/job-description", tags=["job-description"])


@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_job_description(
    job_data: JobDescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job description."""
    
    # Extract skills from job description
    job_text = job_data.description + " " + (job_data.requirements or "")
    skills = extract_skills_from_job_description(job_text)
    
    # Create job description
    job_description = JobDescription(
        user_id=current_user.id,
        title=job_data.title,
        company_name=job_data.company_name,
        description=job_data.description,
        requirements=job_data.requirements,
        salary_range=job_data.salary_range,
        location=job_data.location,
        job_url=job_data.job_url
    )
    
    # Add skills to job description
    for skill_name in skills:
        skill = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
        if not skill:
            skill = Skill(name=skill_name.lower(), category="Technical")
            db.add(skill)
            db.commit()
            db.refresh(skill)
        
        if skill not in job_description.skills:
            job_description.skills.append(skill)
    
    db.add(job_description)
    db.commit()
    db.refresh(job_description)
    
    return job_description


@router.get("/{job_id}", response_model=JobDescriptionResponse)
async def get_job_description(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job description by ID."""
    job_description = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    return job_description


@router.get("", response_model=list[JobDescriptionResponse])
async def list_job_descriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all job descriptions for current user."""
    job_descriptions = db.query(JobDescription).filter(
        JobDescription.user_id == current_user.id
    ).all()
    return job_descriptions


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_description(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete job description."""
    job_description = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    db.delete(job_description)
    db.commit()
