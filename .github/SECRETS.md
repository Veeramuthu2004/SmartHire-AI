CI secrets used by the workflow

Add the following repository secrets (Settings → Secrets → Actions) so CI can run components that need API keys:

- OPENAI_API_KEY — OpenAI API key used by backend tests or demo features (optional for basic smoke tests)
- GEMINI_API_KEY — Google Gemini/Vertex AI key (optional)

Note: The CI workflow is resilient to these being absent for basic import checks, but tests that call out to external APIs will fail without valid keys. Do not commit any secret values into the repo.
