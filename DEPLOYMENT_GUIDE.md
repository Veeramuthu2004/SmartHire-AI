# SmartHire AI Deployment Guide

This project is set up for local development and deployment on Render, Railway, Vercel, and Docker-based VPS hosting.

## What’s included

- FastAPI backend with JWT auth and resume analysis endpoints
- React + Vite frontend with Tailwind CSS, Axios, and Recharts
- PostgreSQL-ready SQLAlchemy models and a SQLite dev fallback
- Docker-ready service layout

## Local development

### Backend

1. Open `backend/`
2. Install dependencies from `backend/requirements.txt`
3. Run `uvicorn app.main:app --reload --port 8000`

### Frontend

1. Open `frontend/`
2. Install packages with npm
3. Run `npm run dev`

## Render deployment

- Deploy the backend as a Docker service
- Use the database connection string from Render PostgreSQL
- Set `CORS_ORIGINS` to the Vercel domain
- Set `SECRET_KEY` and any external AI API keys as environment variables

## Vercel deployment

- Set the frontend root to the repo root config
- Use `VITE_API_URL` to point at the Render backend URL
- Redeploy after changing environment variables

## Docker deployment

- Build the backend image from the repo root `Dockerfile`
- Connect frontend and backend with the Docker network or reverse proxy
- Add PostgreSQL as a separate service or managed DB

## Production checklist

- [ ] Backend health endpoint responds
- [ ] Signup/login works
- [ ] Resume upload works for PDF/DOCX
- [ ] Analysis and dashboard stats load
- [ ] Cover letter generator works
- [ ] Frontend routes render on refresh
- [ ] CORS allows the deployed frontend origin
