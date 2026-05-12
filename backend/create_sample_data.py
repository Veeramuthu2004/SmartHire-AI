"""
Sample data generator for SmartHire AI
"""
from sqlalchemy.orm import Session
from app.models.models import User, Resume, Skill, JobDescription
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.auth.password import hash_password
from datetime import datetime

def create_sample_data():
    """Create sample data for testing"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create sample user
        user = User(
            email="demo@smarthire.ai",
            username="demo",
            full_name="Demo User",
            hashed_password=hash_password("password123"),
            is_active=True,
            is_admin=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✅ Created user: {user.email}")
        
        # Create sample resume
        resume = Resume(
            user_id=user.id,
            filename="sample_resume.pdf",
            file_path="/uploads/1/sample_resume.pdf",
            file_type="PDF",
            name="Demo User",
            email="demo@example.com",
            phone="555-1234",
            summary="Experienced software developer with 5 years of experience",
            education=[
                {
                    "school": "University of California",
                    "degree": "Bachelor of Science",
                    "field": "Computer Science",
                    "year": 2019
                }
            ],
            experience=[
                {
                    "company": "Tech Company Inc.",
                    "position": "Senior Developer",
                    "duration": "2021-Present",
                    "description": "Leading development team"
                }
            ],
            projects=[
                {
                    "name": "SmartHire AI",
                    "description": "AI-powered resume analyzer"
                }
            ]
        )
        db.add(resume)
        db.commit()
        
        print(f"✅ Created resume: {resume.filename}")
        
        # Create sample skills
        skills_list = ["Python", "React", "FastAPI", "PostgreSQL", "Docker", "AWS"]
        for skill_name in skills_list:
            skill = Skill(
                name=skill_name.lower(),
                category="Technical"
            )
            db.add(skill)
            resume.skills.append(skill)
        
        db.commit()
        print(f"✅ Created {len(skills_list)} skills")
        
        # Create sample job description
        job = JobDescription(
            user_id=user.id,
            title="Senior React Developer",
            company_name="Tech Company Inc.",
            description="We are looking for an experienced React developer to join our team",
            requirements="5+ years of React experience, TypeScript knowledge, Node.js",
            salary_range="$120,000 - $150,000",
            location="San Francisco, CA",
            job_url="https://example.com/job/123"
        )
        db.add(job)
        db.commit()
        
        print(f"✅ Created job: {job.title} at {job.company_name}")
        
        print("\n✅ Sample data created successfully!")
        print(f"Login with: email=demo@smarthire.ai, password=password123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
