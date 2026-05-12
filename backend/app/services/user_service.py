"""User service."""
from sqlalchemy.orm import Session
from app.models.models import User
from app.auth.password import hash_password, verify_password
from app.schemas import UserCreate


class UserService:
    """Service for user operations."""

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.email == user_data.email) | (User.username == user_data.username)
        ).first()
        
        if existing_user:
            raise ValueError("User with this email or username already exists")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User | None:
        """Authenticate user with email and password."""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def update_user(db: Session, user: User, **kwargs) -> User:
        """Update user information."""
        for key, value in kwargs.items():
            if value is not None:
                if key == "password":
                    value = hash_password(value)
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        
        return user
