# Deployment Guide

This project is set up for a split deployment:

- **Backend**: Render
- **Frontend**: Vercel

## 1) Deploy the backend to Render

1. Create a new Render Blueprint using the root `render.yaml`.
2. Render will create:
   - a managed PostgreSQL database
   - a Docker web service for the FastAPI backend
3. If you are using the safe deployment branch, deploy from `deploy-fix`.
4. After deploy, note the backend URL, for example:
   - `https://smarthire-backend.onrender.com`
5. Set any optional API keys in Render environment variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
6. If Render asks for a Dockerfile path, use the root `Dockerfile`.

## 2) Deploy the frontend to Vercel

1. Import the `frontend/` folder as a Vercel project.
2. Set the environment variable:
   - `VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com`
3. Vercel will use `frontend/vercel.json` for SPA routing.

## 3) Important settings

- Backend CORS already allows `*.vercel.app` and `*.onrender.com`.
- The frontend must point to the Render backend via `VITE_API_URL`.
- If you change domains, update Render `CORS_ORIGINS` accordingly.
- The repository's `deploy-fix` branch contains the Render-safe Dockerfile layout.

## 4) Local build checks

Frontend:

```bash
cd frontend
npm install
npm run build
```

Backend:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

# SmartHire AI - Production Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

## Environment Setup

### 1. Create .env file

Create a `.env` file in the project root:

```
# Database
DB_USER=smarthire_user
DB_PASSWORD=secure_password_here
DB_NAME=smarthire

# Backend
SECRET_KEY=your-very-secure-secret-key-min-32-chars
DEBUG=False
ENVIRONMENT=production

# API Keys
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# CORS
CORS_ORIGINS=["https://yourdomain.com", "https://app.yourdomain.com"]
```

## Local Development

### Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations (if using Alembic)
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables in dashboard
5. Deploy

### Option 2: Railway.app

1. Push code to GitHub
2. Create new project on Railway
3. Add services:
   - PostgreSQL
   - Backend (from Dockerfile)
   - Frontend (from Dockerfile)
4. Set environment variables
5. Deploy

### Option 3: Docker VPS (DigitalOcean, AWS EC2, etc.)

For production-like runs use the `docker-compose.prod.yml` file and a dedicated env file (example in `backend/.env.prod.example`).

```bash
# Copy and edit production env
cp backend/.env.prod.example backend/.env.prod
# Edit backend/.env.prod with DB_USER/DB_PASSWORD/DB_NAME and API keys

# Start production services
docker compose -f docker-compose.prod.yml up --build -d

# To view logs
docker compose -f docker-compose.prod.yml logs -f
```

For local development with bind mounts and live reload use the dev compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

#### Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy

#### Deploy Backend to Railway/Render

See Options 1 & 2 above

## Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Resume Management

- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - List resumes
- `GET /api/resume/{id}` - Get resume details
- `DELETE /api/resume/{id}` - Delete resume

### Job Description

- `POST /api/job-description` - Create job description
- `GET /api/job-description` - List job descriptions
- `GET /api/job-description/{id}` - Get job details
- `DELETE /api/job-description/{id}` - Delete job

### Analysis

- `POST /api/analysis` - Analyze resume
- `GET /api/analysis` - List analyses
- `GET /api/analysis/{id}` - Get analysis details
- `DELETE /api/analysis/{id}` - Delete analysis

### Cover Letter

- `POST /api/cover-letter` - Generate cover letter
- `GET /api/cover-letter` - List cover letters
- `GET /api/cover-letter/{id}` - Get cover letter
- `DELETE /api/cover-letter/{id}` - Delete cover letter

### Dashboard

- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/analytics/match-scores` - Match scores chart
- `GET /api/dashboard/analytics/skill-distribution` - Skill distribution
- `GET /api/dashboard/analytics/application-history` - Application history

## Monitoring & Maintenance

### View Logs

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Docker
docker logs -f container_name
```

### Database Backup

```bash
docker exec smarthire_postgres pg_dump -U smarthire_user smarthire > backup.sql
```

### Database Restore

```bash
docker exec -i smarthire_postgres psql -U smarthire_user smarthire < backup.sql
```

## Performance Optimization

1. **Database Indexing**: Add indexes to frequently queried columns
2. **Caching**: Implement Redis for API response caching
3. **File Uploads**: Use S3 or other cloud storage
4. **CDN**: Serve frontend assets through CloudFront/Cloudflare
5. **Rate Limiting**: Add rate limiting to API endpoints

## Security Best Practices

1. Always use HTTPS in production
2. Rotate secret keys regularly
3. Keep dependencies updated
4. Enable CORS for trusted domains only
5. Implement API rate limiting
6. Use strong database passwords
7. Enable database encryption
8. Regular security audits

## Troubleshooting

### Port already in use

```bash
# Kill process on port
lsof -i :8000  # Find process
kill -9 <PID>  # Kill process
```

### Database connection issues

```bash
# Check database
docker exec smarthire_postgres psql -U smarthire_user -d smarthire -c "SELECT 1;"
```

### Frontend not connecting to backend

- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend
- Check network tab in browser DevTools

## Support & Documentation

- API Documentation: http://your-domain:8000/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/

## License

MIT License - See LICENSE file for details
