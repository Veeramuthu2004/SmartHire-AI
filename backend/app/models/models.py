"""Database models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from app.database.base import Base

# Association table for many-to-many relationship between resumes and skills
resume_skills = Table(
    "resume_skills",
    Base.metadata,
    Column("resume_id", Integer, ForeignKey("resumes.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

job_description_skills = Table(
    "job_description_skills",
    Base.metadata,
    Column("job_description_id", Integer, ForeignKey("job_descriptions.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="user", cascade="all, delete-orphan")
    analysis_results = relationship("AnalysisResult", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    """User profile table for storing avatar and preferences."""

    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    avatar_path = Column(String(500), nullable=True)
    email_notifications = Column(Boolean, default=True)

    user = relationship("User", backref="profile")


class Resume(Base):
    """Resume model."""

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # PDF, DOCX
    
    # Extracted data
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    summary = Column(Text, nullable=True)
    education = Column(JSON, nullable=True)  # List of education entries
    experience = Column(JSON, nullable=True)  # List of experience entries
    projects = Column(JSON, nullable=True)  # List of projects
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="resumes")
    skills = relationship("Skill", secondary=resume_skills, backref="resumes")
    analysis_results = relationship("AnalysisResult", back_populates="resume", cascade="all, delete-orphan")


class Skill(Base):
    """Skill model."""

    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=True)  # Technical, Soft, Language, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job_descriptions = relationship("JobDescription", secondary=job_description_skills, backref="skills")


class JobDescription(Base):
    """Job description model."""

    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    salary_range = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    job_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    analysis_results = relationship("AnalysisResult", back_populates="job_description", cascade="all, delete-orphan")


class AnalysisResult(Base):
    """Analysis result model."""

    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    
    # Analysis scores
    match_percentage = Column(Float, nullable=False)
    ats_score = Column(Float, nullable=True)
    similarity_score = Column(Float, nullable=True)
    
    # Analysis results
    matching_skills = Column(JSON, nullable=True)  # List of matching skills
    missing_skills = Column(JSON, nullable=True)  # List of missing skills
    skill_recommendations = Column(JSON, nullable=True)  # List of recommended skills
    improvement_suggestions = Column(JSON, nullable=True)  # List of suggestions
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="analysis_results")
    resume = relationship("Resume", back_populates="analysis_results")
    job_description = relationship("JobDescription", back_populates="analysis_results")


class CoverLetter(Base):
    """Cover letter model."""

    __tablename__ = "cover_letters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_customized = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="cover_letters")


class Recommendation(Base):
    """Recommendation model for skill gap detection."""

    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(255), nullable=False)
    course_name = Column(String(255), nullable=False)
    course_url = Column(String(500), nullable=True)
    provider = Column(String(100), nullable=True)  # Coursera, Udemy, LinkedIn Learning, etc.
    difficulty_level = Column(String(50), nullable=True)  # Beginner, Intermediate, Advanced
    estimated_hours = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
