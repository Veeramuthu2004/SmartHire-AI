# Secrets and Key Management

This project supports two AI providers: OpenAI and Google Gemini. Do NOT commit API keys to the repository.

Recommended approaches:

- Use environment variables in production (eg. `OPENAI_API_KEY`, `GEMINI_API_KEY`). Do not store plaintext keys in the repo.
- For GitHub Actions, store keys in repository `Secrets` and reference them in workflows as `secrets.OPENAI_API_KEY`.
- For Azure-hosted deployments, use Azure Key Vault and the `azure/get-keyvault-secrets` action to inject secrets into the job at runtime.

Example (GitHub Actions) snippet:

```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Example (Azure Key Vault) snippet:

```yaml
- name: Fetch secrets from Key Vault
  uses: azure/get-keyvault-secrets@v1
  with:
    keyvault: ${{ secrets.AZURE_KEYVAULT_NAME }}
    secrets: OPENAI_API_KEY,GEMINI_API_KEY
```

If you need help wiring a specific secret backend (AWS Secrets Manager, Azure, or Vault), I can add a concrete example for that provider.
