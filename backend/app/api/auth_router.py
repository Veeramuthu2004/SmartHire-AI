from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    """User signup endpoint"""
    return {"access_token": "dummy_token", "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    return {"access_token": "dummy_token", "token_type": "bearer"}

@router.get("/me")
async def get_profile():
    """Get current user profile"""
    return {"id": 1, "email": "user@example.com", "name": "User"}

@router.post("/logout")
async def logout():
    """User logout"""
    return {"message": "Logged out successfully"}
