"""Pydantic schemas for request/response validation."""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime


# ============= User Schemas =============
class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema."""
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    """User response schema."""
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Resume Schemas =============
class SkillBase(BaseModel):
    """Base skill schema."""
    name: str
    category: Optional[str] = None


class SkillResponse(SkillBase):
    """Skill response schema."""
    id: int

    class Config:
        from_attributes = True


class ResumeBase(BaseModel):
    """Base resume schema."""
    filename: str
    file_type: str


class ResumeCreate(ResumeBase):
    """Resume creation schema."""
    pass


class ResumeResponse(ResumeBase):
    """Resume response schema."""
    id: int
    user_id: int
    file_path: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[SkillResponse]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Job Description Schemas =============
class JobDescriptionBase(BaseModel):
    """Base job description schema."""
    title: str
    company_name: str
    description: str
    requirements: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None


class JobDescriptionCreate(JobDescriptionBase):
    """Job description creation schema."""
    pass


class JobDescriptionResponse(JobDescriptionBase):
    """Job description response schema."""
    id: int
    user_id: int
    skills: Optional[List[SkillResponse]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Analysis Result Schemas =============
class AnalysisResultBase(BaseModel):
    """Base analysis result schema."""
    resume_id: int
    job_description_id: int


class AnalysisResultCreate(AnalysisResultBase):
    """Analysis result creation schema."""
    pass


class AnalysisResultResponse(AnalysisResultBase):
    """Analysis result response schema."""
    id: int
    user_id: int
    match_percentage: float
    ats_score: Optional[float] = None
    similarity_score: Optional[float] = None
    matching_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    skill_recommendations: Optional[List[str]] = None
    improvement_suggestions: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Cover Letter Schemas =============
class CoverLetterBase(BaseModel):
    """Base cover letter schema."""
    job_title: str
    company_name: str
    content: str


class CoverLetterCreate(BaseModel):
    """Cover letter creation schema."""
    resume_id: int
    job_title: str
    company_name: str
    job_description: Optional[str] = None


class CoverLetterResponse(CoverLetterBase):
    """Cover letter response schema."""
    id: int
    user_id: int
    is_customized: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============= Recommendation Schemas =============
class RecommendationBase(BaseModel):
    """Base recommendation schema."""
    skill_name: str
    course_name: str
    course_url: Optional[str] = None
    provider: Optional[str] = None
    difficulty_level: Optional[str] = None
    estimated_hours: Optional[int] = None


class RecommendationCreate(RecommendationBase):
    """Recommendation creation schema."""
    pass


class RecommendationResponse(RecommendationBase):
    """Recommendation response schema."""
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============= Authentication Schemas =============
class TokenRequest(BaseModel):
    """Token request schema."""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str


# ============= Dashboard Schemas =============
class DashboardStats(BaseModel):
    """Dashboard statistics schema."""
    total_resumes: int
    total_job_descriptions: int
    total_analyses: int
    average_match_score: float
    recent_analyses: List[AnalysisResultResponse]
