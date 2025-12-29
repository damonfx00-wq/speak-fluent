#!/bin/bash

# Simple version - Run both servers in separate terminals

echo "🚀 Starting Speak-Fluent..."

# Start backend in background
echo "Starting backend..."
cd backend && source venv/bin/activate && uvicorn main:app --reload &

# Start frontend in background  
echo "Starting frontend..."
npm run dev &

echo ""
echo "✅ Servers starting..."
echo "Backend: http://localhost:8000/docs"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"

wait
