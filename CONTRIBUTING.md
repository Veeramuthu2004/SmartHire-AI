# Contributing to SmartHire AI

Thank you for your interest in contributing to SmartHire AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/smarthire-ai.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit: `git commit -m "Add your feature"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

## Development Setup

See [DEPLOYMENT.md](DEPLOYMENT.md#local-development) for detailed setup instructions.

## Coding Standards

### Python Backend

- Follow PEP 8
- Use type hints for functions
- Write docstrings for all functions
- Maximum line length: 100 characters
- Use meaningful variable names

```python
def analyze_resume(resume_id: int, job_id: int) -> AnalysisResult:
    """Analyze resume against job description.

    Args:
        resume_id: ID of the resume
        job_id: ID of the job description

    Returns:
        AnalysisResult object with scores and recommendations
    """
```

### React Frontend

- Use functional components with hooks
- Use meaningful component and variable names
- Write JSDoc comments for components
- Keep components small and focused
- Use Tailwind CSS for styling

```jsx
/**
 * ResumeCard Component
 * @param {Object} props - Component props
 * @param {number} props.resumeId - Resume ID
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element}
 */
export default function ResumeCard({ resumeId, onDelete }) {
  // Component code
}
```

## Testing

Write tests for new features:

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm test
```

## Git Commits

- Use clear, descriptive commit messages
- Reference issues when applicable
- Format: `type: description`

Examples:

- `feat: add resume upload functionality`
- `fix: correct JWT token validation`
- `docs: update deployment guide`
- `test: add resume parser tests`

## Pull Request Guidelines

1. Keep PRs focused and reasonably sized
2. Write clear description of changes
3. Reference related issues
4. Ensure all tests pass
5. Update documentation if needed

## Documentation

- Update README.md for user-facing changes
- Update DEPLOYMENT.md for deployment changes
- Add docstrings to code
- Update API docs in code

## Reporting Bugs

1. Check if bug already exists
2. Provide clear description
3. Include reproduction steps
4. Add screenshots if applicable
5. Mention your environment

## Suggesting Features

1. Check if feature already exists
2. Provide clear description
3. Explain use case
4. Suggest implementation if possible

## Questions?

- Check existing issues
- Create a GitHub Discussion
- Contact: contact@smarthire.ai

Thank you for contributing! 🎉
