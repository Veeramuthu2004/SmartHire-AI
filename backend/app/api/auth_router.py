from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.database import get_db
from app.models import User
from app.services import AuthService

router = APIRouter()

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=AuthService.hash_password(user_data.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = AuthService.create_access_token({"sub": str(db_user.id), "email": db_user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": db_user.id, "name": db_user.name, "email": db_user.email}


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserRegister, db: Session = Depends(get_db)):
    """Backward compatible signup endpoint for older frontend bundles."""
    return await register(user_data, db)

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not AuthService.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = AuthService.create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id, "name": user.name, "email": user.email}

@router.get("/me", response_model=UserProfile)
async def get_profile(authorization: Optional[str] = Header(default=None), db: Session = Depends(get_db)):
    """Get current user profile"""
    token = authorization.removeprefix("Bearer ").strip() if authorization else ""
    payload = AuthService.decode_token(token) if token else None
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first() if user_id else None
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/logout")
async def logout():
    """User logout"""
    return {"message": "Logged out successfully"}
