"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.database.session import engine
from app.database.base import Base
from app.api import auth, resume, job_description, analysis, cover_letter, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="SmartHire AI",
    description="AI-powered Resume Analyzer & Job Matcher",
    version="1.0.0"
)

# Get settings
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$|https://.*\.vercel\.app$|https://.*\.onrender\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(job_description.router)
app.include_router(analysis.router)
app.include_router(cover_letter.router)
app.include_router(dashboard.router)

# Serve uploaded files
app.mount("/static", StaticFiles(directory=settings.UPLOAD_FOLDER), name="static")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "SmartHire AI API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
