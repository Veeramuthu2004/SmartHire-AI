# SmartHire AI - Resume Analyzer & Job Matcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18+](https://img.shields.io/badge/react-18+-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104+-green.svg)](https://fastapi.tiangolo.com/)

> An advanced AI-powered web application that analyzes resumes, matches them with job descriptions, detects skill gaps, and generates personalized cover letters using cutting-edge NLP and AI technologies.

## 🌟 Features

### Core Features

- **🔐 User Authentication**: Secure register/login with JWT tokens and role-based access control
- **📄 Resume Upload & Parsing**: Support for PDF and DOCX files with automatic data extraction
- **🤖 AI Resume Analysis**: Advanced NLP-powered analysis of resume content
- **💼 Job Description Input**: Add job descriptions for comparison
- **📊 Resume vs JD Match Score**: TF-IDF and semantic similarity matching
- **🔍 Skill Gap Detection**: Identify missing skills with learning recommendations
- **✨ AI Cover Letter Generator**: Personalized cover letters powered by OpenAI/Gemini
- **📈 Analytics Dashboard**: Beautiful visualizations of career progress
- **📁 REST API**: Full-featured API for all operations
- **👨‍💼 Admin Panel**: Manage users and system settings
- **📥 Export Reports**: Download analysis reports in multiple formats

### Advanced Features

- **Semantic Embeddings**: Deep learning-based resume analysis
- **ATS Compatibility Score**: Check if resume passes Applicant Tracking Systems
- **Resume Ranking**: Compare multiple resumes
- **Skill Trend Analysis**: Track in-demand skills
- **Interview Question Generator**: AI-generated interview prep questions
- **Multi-resume Comparison**: Side-by-side analysis
- **Dark/Light Mode**: Modern UI with theme switching
- **Real-time Updates**: WebSocket support for live notifications

## 🏗️ Architecture

```
SmartHire AI
├── Frontend (React + Vite + Tailwind CSS)
│   ├── Pages (Login, Dashboard, Upload, Analysis, etc.)
│   ├── Components (UI, Forms, Charts)
│   ├── Services (API client, state management)
│   └── Charts (Analytics with Recharts)
│
├── Backend (FastAPI + SQLite by default, PostgreSQL in Docker)
│   ├── API Routes (Auth, Resume, Job, Analysis, etc.)
│   ├── Models (User, Resume, Analysis, etc.)
│   ├── Services (NLP, Analysis, AI)
│   ├── Authentication (JWT + Password hashing)
│   └── Database (SQLAlchemy ORM)
│
├── NLP Engine
│   ├── spaCy (NER, text processing)
│   ├── NLTK (Tokenization, linguistic features)
│   ├── scikit-learn (TF-IDF, similarity)
│   └── sentence-transformers (Semantic embeddings)
│
└── DevOps
    ├── Docker (Containerization)
    ├── Docker Compose (Orchestration)
    └── CI/CD (GitHub Actions)
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose (Recommended)
- Or: Python 3.11+, Node.js 18+

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/smarthire-ai.git
cd smarthire-ai

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLP model
python -m spacy download en_core_web_sm

# Setup database
cp .env.example .env
# Edit .env with your local settings and optional API keys
# SQLite works out of the box; no database server is required for local dev

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Option 3: One-Command Local Start Scripts

From the project root:

```powershell
# Windows PowerShell
.\scripts\start-dev.ps1
```

```bash
# macOS/Linux
./scripts/start-dev.sh
```

These scripts auto-detect port conflicts, reuse an existing backend on `8000`, and start frontend on `3000` (or `5173` if `3000` is already in use).

## 📋 Project Structure

```
smarthire-ai/
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   │   ├── auth.py       # Authentication routes
│   │   │   ├── resume.py     # Resume management
│   │   │   ├── analysis.py   # Analysis endpoints
│   │   │   ├── job_description.py
│   │   │   ├── cover_letter.py
│   │   │   └── dashboard.py  # Analytics
│   │   ├── models/           # SQLAlchemy models
│   │   │   └── models.py     # Database models
│   │   ├── services/         # Business logic
│   │   │   ├── analysis_service.py
│   │   │   ├── ai_service.py
│   │   │   └── user_service.py
│   │   ├── utils/            # Utilities
│   │   │   ├── resume_parser.py
│   │   │   ├── nlp_utils.py
│   │   │   └── file_handler.py
│   │   ├── auth/             # Authentication
│   │   │   ├── password.py
│   │   │   ├── jwt.py
│   │   │   └── dependencies.py
│   │   ├── database/         # Database config
│   │   │   ├── session.py
│   │   │   └── base.py
│   │   ├── config.py         # Configuration
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile           # Docker image
│   └── .env.example         # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadResumePage.jsx
│   │   │   ├── JobMatchAnalysisPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── CoverLetterGeneratorPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/        # API client
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── context/         # State management
│   │   │   └── store.js
│   │   ├── charts/          # Analytics charts
│   │   ├── App.jsx          # Main app
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml       # Docker Compose config
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh JWT token
GET    /api/auth/me            - Get current user info
```

### Resume Management

```
POST   /api/resume/upload      - Upload resume file
GET    /api/resume             - List user's resumes
GET    /api/resume/{id}        - Get resume details
DELETE /api/resume/{id}        - Delete resume
```

### Job Descriptions

```
POST   /api/job-description    - Create job description
GET    /api/job-description    - List job descriptions
GET    /api/job-description/{id} - Get job details
DELETE /api/job-description/{id} - Delete job
```

### Analysis

```
POST   /api/analysis           - Analyze resume vs job
GET    /api/analysis           - List analyses
GET    /api/analysis/{id}      - Get analysis details
DELETE /api/analysis/{id}      - Delete analysis
```

### Cover Letters

```
POST   /api/cover-letter       - Generate cover letter
GET    /api/cover-letter       - List cover letters
GET    /api/cover-letter/{id}  - Get cover letter
DELETE /api/cover-letter/{id}  - Delete cover letter
```

### Dashboard

```
GET    /api/dashboard/stats    - Get dashboard statistics
GET    /api/dashboard/analytics/match-scores - Match score data
GET    /api/dashboard/analytics/skill-distribution - Skill analytics
GET    /api/dashboard/analytics/application-history - Application history
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: User creates account with email/password
2. **Login**: User receives access and refresh tokens
3. **Protected Routes**: Requests include `Authorization: Bearer <token>` header
4. **Token Refresh**: Refresh tokens can be used to obtain new access tokens

Example:

```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:8000/api/auth/me
```

## 📊 Database Schema

### Users Table

```sql
id (PK) | email | username | full_name | hashed_password | is_active | is_admin | created_at | updated_at
```

### Resumes Table

```sql
id (PK) | user_id (FK) | filename | file_path | file_type | name | email | phone |
summary | education (JSON) | experience (JSON) | projects (JSON) | created_at | updated_at
```

### Skills Table

```sql
id (PK) | name | category | created_at
```

### Job Descriptions Table

```sql
id (PK) | user_id (FK) | title | company_name | description | requirements |
salary_range | location | job_url | created_at | updated_at
```

### Analysis Results Table

```sql
id (PK) | user_id (FK) | resume_id (FK) | job_description_id (FK) |
match_percentage | ats_score | similarity_score | matching_skills (JSON) |
missing_skills (JSON) | skill_recommendations (JSON) | improvement_suggestions (JSON) |
created_at | updated_at
```

### Cover Letters Table

```sql
id (PK) | user_id (FK) | job_title | company_name | content | is_customized | created_at | updated_at
```

## 🤖 NLP Technologies

### spaCy

- Named Entity Recognition (NER) for extracting skills, companies, locations
- Tokenization and linguistic feature extraction
- Pre-trained English language model

### NLTK

- Advanced tokenization
- POS tagging for understanding sentence structure
- Linguistic analysis

### scikit-learn

- TF-IDF vectorization for resume/job description text
- Cosine similarity for matching
- Feature extraction and text analysis

### sentence-transformers

- Semantic similarity using deep learning embeddings
- Understanding context and meaning beyond keywords
- Multi-lingual support

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# API integration tests
pytest tests/api/
```

## 📦 Deployment

### Quick Deployment Options

1. **Render.com**: See DEPLOYMENT.md
2. **Railway.app**: See DEPLOYMENT.md
3. **Docker VPS**: See DEPLOYMENT.md
4. **Vercel + Railway**: See DEPLOYMENT.md

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable allowed origins
- **SQL Injection Prevention**: Parameterized queries with SQLAlchemy
- **File Validation**: Strict file type and size checking
- **Rate Limiting**: Coming soon
- **HTTPS Support**: Ready for production SSL/TLS

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching
- **Modern Gradients**: Eye-catching gradient cards and backgrounds
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Loading indicators for async operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG 2.1 compliance

## 📈 Performance

- **Frontend**: Vite for fast builds, React lazy loading
- **Backend**: Async FastAPI endpoints, connection pooling
- **Database**: Indexed queries, efficient JOINs
- **Caching**: Ready for Redis integration

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Kill the process or change port
2. **Database connection failed**: Check DATABASE_URL in .env
3. **Frontend can't reach backend**: Check CORS settings and VITE_API_URL
4. **spaCy model not found**: Run `python -m spacy download en_core_web_sm`

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting

## 🚀 Future Enhancements

- [ ] Video interview preparation
- [ ] Real-time collaboration on resumes
- [ ] LinkedIn profile integration
- [ ] Multi-language support
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced salary negotiation tips
- [ ] Job board integration
- [ ] Career path recommendations
- [ ] Blockchain credentials verification
- [ ] Automated job applications

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

- **Documentation**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Docs**: http://localhost:8000/docs
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions

## 👨‍💻 Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Zustand (State Management)
- React Router

### Backend

- FastAPI
- SQLite by default
- PostgreSQL for Docker Compose
- SQLAlchemy
- Pydantic
- Python 3.11

### NLP/ML

- spaCy
- NLTK
- scikit-learn
- sentence-transformers
- OpenAI API / Google Gemini API

### DevOps

- Docker
- Docker Compose
- PostgreSQL
- Nginx (Optional)

## 📊 Statistics

- **Lines of Code**: 15,000+
- **API Endpoints**: 30+
- **React Components**: 20+
- **Database Tables**: 7
- **NLP Models**: 3+

## 🎯 Use Cases

1. **Job Seekers**: Optimize resumes for specific jobs
2. **Career Coaches**: Provide data-driven guidance
3. **Recruiters**: Filter and rank resumes
4. **Students**: Prepare for job market
5. **Enterprises**: Internal HR automation

## 📞 Contact

- **Email**: contact@smarthire.ai
- **Twitter**: @SmartHireAI
- **LinkedIn**: SmartHire AI

---

**Made with ❤️ by the SmartHire AI Team**

⭐ If you find this project helpful, please star it on GitHub!
