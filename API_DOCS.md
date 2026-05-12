"""
API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

```json
{
  "data": {},
  "status": "success",
  "message": ""
}
```

## Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (requires auth)

### Resume

- `POST /api/resume/upload` - Upload resume file (requires auth)
- `GET /api/resume` - List user's resumes (requires auth)
- `GET /api/resume/{id}` - Get resume details (requires auth)
- `DELETE /api/resume/{id}` - Delete resume (requires auth)

### Job Description

- `POST /api/job-description` - Create job (requires auth)
- `GET /api/job-description` - List jobs (requires auth)
- `GET /api/job-description/{id}` - Get job details (requires auth)
- `DELETE /api/job-description/{id}` - Delete job (requires auth)

### Analysis

- `POST /api/analysis` - Analyze resume (requires auth)
- `GET /api/analysis` - List analyses (requires auth)
- `GET /api/analysis/{id}` - Get analysis (requires auth)
- `DELETE /api/analysis/{id}` - Delete analysis (requires auth)

### Cover Letter

- `POST /api/cover-letter` - Generate cover letter (requires auth)
- `GET /api/cover-letter` - List cover letters (requires auth)
- `GET /api/cover-letter/{id}` - Get cover letter (requires auth)
- `DELETE /api/cover-letter/{id}` - Delete cover letter (requires auth)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard stats (requires auth)
- `GET /api/dashboard/analytics/match-scores` - Match score data (requires auth)
- `GET /api/dashboard/analytics/skill-distribution` - Skill analytics (requires auth)
- `GET /api/dashboard/analytics/application-history` - Application history (requires auth)

### Health

- `GET /` - Health check
- `GET /health` - Health status

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid input"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

## Examples

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user",
    "full_name": "John Doe",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Upload Resume

```bash
curl -X POST http://localhost:8000/api/resume/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

### Create Job Description

```bash
curl -X POST http://localhost:8000/api/job-description \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "company_name": "Tech Corp",
    "description": "We seek...",
    "requirements": "5+ years..."
  }'
```

### Analyze Resume

```bash
curl -X POST http://localhost:8000/api/analysis \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": 1,
    "job_description_id": 1
  }'
```

## Rate Limiting

Currently not implemented. To be added in production.

## Pagination

Currently not implemented. To be added for list endpoints.

## Webhooks

Currently not implemented. To be added for real-time updates.

"""
