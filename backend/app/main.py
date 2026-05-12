from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

# Import routers
try:
    from app.api import auth_router, resume_router, analysis_router
except ImportError:
    from api import auth_router, resume_router, analysis_router

# Lifecycle events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 SmartHire AI backend starting...")
    yield
    # Shutdown
    print("🛑 SmartHire AI backend shutting down...")

# Create FastAPI app
app = FastAPI(
    title="SmartHire AI",
    description="AI-powered resume analyzer and candidate matcher",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://localhost:5173"]')
try:
    import json
    cors_origins = json.loads(cors_origins)
except:
    cors_origins = ["http://localhost:3000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(resume_router.router, prefix="/api/resume", tags=["resume"])
app.include_router(analysis_router.router, prefix="/api/analysis", tags=["analysis"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "SmartHire AI API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
