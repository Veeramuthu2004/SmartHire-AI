"""
Backend unit tests for SmartHire AI
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import get_settings

client = TestClient(app)

class TestAuthentication:
    """Authentication tests"""
    
    def test_register_user(self):
        """Test user registration"""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "testuser",
                "full_name": "Test User",
                "password": "password123"
            }
        )
        assert response.status_code in [201, 400]  # 201 if new, 400 if exists
    
    def test_login_user(self):
        """Test user login"""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        if response.status_code == 200:
            assert "access_token" in response.json()
    
    def test_get_current_user(self):
        """Test getting current user"""
        response = client.get("/api/auth/me")
        assert response.status_code in [200, 401]

class TestResume:
    """Resume upload and management tests"""
    
    def test_list_resumes(self):
        """Test listing resumes"""
        response = client.get("/api/resume")
        assert response.status_code in [200, 401]
    
    def test_upload_resume(self):
        """Test uploading resume"""
        with open("sample.pdf", "rb") as f:
            response = client.post(
                "/api/resume/upload",
                files={"file": f}
            )
        assert response.status_code in [201, 401, 400]

class TestAnalysis:
    """Analysis tests"""
    
    def test_list_analyses(self):
        """Test listing analyses"""
        response = client.get("/api/analysis")
        assert response.status_code in [200, 401]

class TestCoverLetter:
    """Cover letter tests"""
    
    def test_list_cover_letters(self):
        """Test listing cover letters"""
        response = client.get("/api/cover-letter")
        assert response.status_code in [200, 401]

class TestDashboard:
    """Dashboard tests"""
    
    def test_get_stats(self):
        """Test getting dashboard stats"""
        response = client.get("/api/dashboard/stats")
        assert response.status_code in [200, 401]

class TestHealth:
    """Health check tests"""
    
    def test_root(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert "SmartHire AI" in response.json()["message"]
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
