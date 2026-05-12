# SmartHire AI Quick Check

This project is a React + FastAPI resume analyzer and job matcher.

## What the project uses

- Frontend: React 18, Vite, Tailwind CSS, Axios, Zustand, React Router
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT, bcrypt
- AI/NLP: spaCy, NLTK, scikit-learn, sentence-transformers, OpenAI API, Google Gemini API
- Local database: SQLite by default
- Docker setup: PostgreSQL-based Compose stack is available for container runs

## What to configure

- `backend/.env` for `DATABASE_URL`, `SECRET_KEY`, `GEMINI_API_KEY`, and optional `OPENAI_API_KEY`
- `frontend/.env.local` for `VITE_API_URL=http://localhost:8000`

Do not commit API keys to the repository.

## Quick checks

1. Backend health: `GET /health`
2. Register user: `POST /api/auth/register`
3. Login user: `POST /api/auth/login`
4. Current user: `GET /api/auth/me`
5. Frontend login page should accept typed input and autofill

## Local run

- Backend: `cd backend` then `venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`
- Frontend: `cd frontend` then `npm run dev`

## Docker run

- Set `GEMINI_API_KEY` and other env values in your shell or `.env`
- Run `docker compose up --build`
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
