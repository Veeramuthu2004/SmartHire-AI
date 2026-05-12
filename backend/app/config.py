"""Application configuration."""
from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""

    # Database (SQLite by default - no installation needed)
    DATABASE_URL: str = "sqlite:///./smarthire.db"
    DATABASE_ECHO: bool = False

    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # API Keys
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Server
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]

    # File Upload
    MAX_UPLOAD_SIZE: int = 10485760  # 10 MB
    UPLOAD_FOLDER: str = "uploads"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
    ]

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get settings instance."""
    return Settings()
