#!/bin/bash

# Quick start script for Speak-Fluent Backend

echo "🚀 Starting Speak-Fluent Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before running the server!"
    exit 1
fi

# Run the server
echo "✅ Starting FastAPI server..."
echo "📚 API Documentation will be available at: http://localhost:8000/docs"
uvicorn main:app --reload
