from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from app.database import init_db

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
    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database init warning: {e}")
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
import json

default_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

cors_env = os.getenv("CORS_ORIGINS")
if cors_env:
    try:
        cors_origins = list({*default_origins, *json.loads(cors_env)})
    except Exception:
        cors_origins = default_origins
else:
    cors_origins = default_origins

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
