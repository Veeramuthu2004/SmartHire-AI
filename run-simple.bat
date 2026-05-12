@echo off
REM SmartHire AI - Simple Run Script (SQLite - No DB Installation Needed!)

setlocal enabledelayedexpansion

echo.
echo 🚀 SmartHire AI - Starting Project (SQLite Mode)
echo ==================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3.11+ is required
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 18+ is required
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Python and Node.js found
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate and install
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python -m spacy download en_core_web_sm -q 2>nul

echo ✅ Backend ready
echo.

REM Start Backend in new window
echo 🔌 Starting Backend on http://localhost:8000...
start "SmartHire Backend" cmd /k "cd /d %cd% && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..\frontend

REM Install npm dependencies
if not exist node_modules (
    echo Installing Node dependencies...
    call npm install -q
)

echo ✅ Frontend ready
echo.

REM Start Frontend in new window
echo 🎨 Starting Frontend on http://localhost:3000...
start "SmartHire Frontend" cmd /k "npm run dev"

echo.
echo ✅ Services Starting!
echo.
echo 📱 Open your browser:
echo    🖥️  Frontend:  http://localhost:3000
echo    🔌 Backend:   http://localhost:8000
echo    📚 API Docs:  http://localhost:8000/docs
echo.
echo 📝 To populate demo data, run in backend folder:
echo    python create_sample_data.py
echo.
echo Then login with:
echo    Email: demo@smarthire.ai
echo    Password: password123
echo.
pause
