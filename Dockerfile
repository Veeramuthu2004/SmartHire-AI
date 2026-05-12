# Root Dockerfile that builds the backend located in /backend
# This forwards to the backend folder so Render (which looks for a root Dockerfile)
# can build the backend without changing Render settings.

FROM python:3.11-slim

WORKDIR /app

# Install system deps if needed (add more if your backend needs them)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
ENV PYTHONPATH=/app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
