# SmartHire AI - Quick Reference

## Quick Start

### Docker (Recommended)

```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Database

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Backup Database

```bash
docker exec smarthire_postgres pg_dump -U user smarthire > backup.sql
```

### Access Database

```bash
docker exec -it smarthire_postgres psql -U user -d smarthire
```

## File Structure Quick Ref

```
backend/app/
├── api/          → API endpoints
├── models/       → Database models
├── services/     → Business logic
├── utils/        → Utilities
├── auth/         → Authentication
├── database/     → DB config
└── main.py       → FastAPI app

frontend/src/
├── pages/        → Page components
├── components/   → Reusable UI
├── services/     → API client
├── context/      → State mgmt
└── charts/       → Analytics
```

## Common Commands

### Backend

```bash
# Create migration
alembic revision --autogenerate -m "message"

# Apply migrations
alembic upgrade head

# Run tests
pytest

# Format code
black app/

# Lint
flake8 app/
```

### Frontend

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Format
npm run lint:fix
```

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `OPENAI_API_KEY`: OpenAI API key
- `GEMINI_API_KEY`: Gemini API key

### Frontend

- `VITE_API_URL`: Backend URL
- `VITE_APP_NAME`: App name

## Troubleshooting

| Issue                 | Solution                                  |
| --------------------- | ----------------------------------------- |
| Port in use           | `lsof -i :8000` then `kill -9 PID`        |
| DB connection failed  | Check DATABASE_URL in .env                |
| CORS error            | Check CORS_ORIGINS in backend .env        |
| spaCy model not found | `python -m spacy download en_core_web_sm` |
| Module not found      | `pip install -r requirements.txt`         |
| npm dependency issue  | `rm -rf node_modules && npm install`      |

## API Endpoints Summary

| Endpoint             | Method | Auth |
| -------------------- | ------ | ---- |
| /api/auth/register   | POST   | No   |
| /api/auth/login      | POST   | No   |
| /api/auth/me         | GET    | Yes  |
| /api/resume          | GET    | Yes  |
| /api/resume/upload   | POST   | Yes  |
| /api/analysis        | POST   | Yes  |
| /api/cover-letter    | POST   | Yes  |
| /api/dashboard/stats | GET    | Yes  |

## Tech Stack

- **Frontend**: React, Vite, Tailwind, Recharts
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **NLP**: spaCy, NLTK, scikit-learn
- **DevOps**: Docker, Docker Compose

## Useful Links

- Docs: http://localhost:8000/docs
- Swagger: http://localhost:8000/redoc
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Contact

- Email: contact@smarthire.ai
- Issues: GitHub Issues
- Discussions: GitHub Discussions
