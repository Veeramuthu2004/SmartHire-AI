#!/bin/bash

# SmartHire AI Setup Script

set -e

echo "🚀 SmartHire AI - Setup Script"
echo "================================"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Create .env file if doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your settings"
fi

# Create frontend .env.local if doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend/.env.local file..."
    cp frontend/.env.example frontend/.env.local
fi

# Build Docker images
echo ""
echo "🐳 Building Docker images..."
docker-compose build

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo ""
echo "🔄 Running database migrations..."
docker-compose exec -T backend alembic upgrade head || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 SmartHire AI is running:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
