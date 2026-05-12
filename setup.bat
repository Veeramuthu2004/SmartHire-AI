@echo off
REM SmartHire AI Setup Script for Windows

echo.
echo 🚀 SmartHire AI - Setup Script
echo ================================

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)
echo ✅ Docker is installed

REM Check Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)
echo ✅ Docker Compose is installed

REM Create .env file if doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating backend\.env file...
    copy backend\.env.example backend\.env
    echo ⚠️  Please edit backend\.env with your settings
)

REM Create frontend .env.local if doesn't exist
if not exist "frontend\.env.local" (
    echo 📝 Creating frontend\.env.local file...
    copy frontend\.env.example frontend\.env.local
)

REM Build Docker images
echo.
echo 🐳 Building Docker images...
docker-compose build

REM Start services
echo.
echo 🚀 Starting services...
docker-compose up -d

REM Wait for database
echo.
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak

REM Run migrations
echo.
echo 🔄 Running database migrations...
docker-compose exec -T backend alembic upgrade head

echo.
echo ✅ Setup complete!
echo.
echo 🎉 SmartHire AI is running:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo.
pause
