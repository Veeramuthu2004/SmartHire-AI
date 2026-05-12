@echo off
REM SmartHire AI - Automated Run Script (No Docker)

setlocal enabledelayedexpansion

echo.
echo 🚀 SmartHire AI - Starting Project
echo ==================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Check PostgreSQL
where psql >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL 15+
    echo Download from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)
echo ✅ PostgreSQL found

echo.
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt -q

REM Download spaCy model
echo Downloading spaCy model...
python -m spacy download en_core_web_sm -q 2>nul

REM Check .env file
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env >nul
    echo ⚠️  Update backend\.env with your DATABASE_URL
)

echo ✅ Backend ready

REM Start Backend in background
echo.
echo 🔌 Starting Backend (FastAPI)...
start "SmartHire Backend" cmd /k "cd /d %cd% && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo Backend starting on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..\frontend

REM Install npm dependencies
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install -q
)

REM Check .env.local
if not exist .env.local (
    echo Creating frontend .env.local file...
    copy .env.example .env.local >nul
)

echo ✅ Frontend ready

REM Start Frontend
echo.
echo 🎨 Starting Frontend (React)...
start "SmartHire Frontend" cmd /k "npm run dev"

echo Frontend starting on http://localhost:3000
echo.

echo.
echo ✅ Services Started!
echo.
echo 📱 Access the application:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo 📝 To populate sample data, run:
echo    python create_sample_data.py
echo.
echo ⏹️  To stop services: Close the command windows
echo.
pause
