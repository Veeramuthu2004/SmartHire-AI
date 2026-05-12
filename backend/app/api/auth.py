"""Authentication routes."""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas import UserCreate, UserResponse, TokenRequest, TokenResponse, RefreshTokenRequest
from app.services.user_service import UserService
from app.auth.jwt import create_access_token, create_refresh_token, decode_refresh_token
from app.auth.dependencies import get_current_user
from app.models.models import User
from app.config import get_settings
from fastapi import UploadFile, File
import os
from app.models.models import Profile

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        user = UserService.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: TokenRequest, db: Session = Depends(get_db)):
    """Login user and return JWT tokens."""
    user = UserService.authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token_request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token."""
    payload = decode_refresh_token(refresh_token_request.refresh_token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = UserService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    # Attach profile info if present
    # Attempt to fetch profile record
    try:
        profile = None
        from app.database.session import SessionLocal
        db = SessionLocal()
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        if profile and profile.avatar_path:
            current_user.profile_image = profile.avatar_path
        else:
            current_user.profile_image = None
    except Exception:
        current_user.profile_image = None
    finally:
        try:
            db.close()
        except Exception:
            pass

    return current_user




@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Upload or update user avatar."""
    settings = get_settings()
    upload_dir = settings.UPLOAD_FOLDER
    avatars_dir = os.path.join(upload_dir, "avatars")
    os.makedirs(avatars_dir, exist_ok=True)

    # Create filename
    filename = f"user_{current_user.id}_{int(__import__('time').time())}_{file.filename}"
    file_path = os.path.join(avatars_dir, filename)

    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Save/update profile record
    from app.database.session import SessionLocal
    db = SessionLocal()
    try:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        rel_path = f"/static/avatars/{filename}"
        if not profile:
            profile = Profile(user_id=current_user.id, avatar_path=rel_path)
            db.add(profile)
        else:
            profile.avatar_path = rel_path
        db.commit()
        db.refresh(profile)
    finally:
        db.close()

    return {"profile_image": rel_path}
