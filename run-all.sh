#!/bin/bash

# Speak-Fluent - Run Both Servers
# This script starts both backend (FastAPI) and frontend (Vite) servers

echo "🚀 Starting Speak-Fluent Application..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT TERM

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}⚠️  Backend directory not found!${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed!${NC}"
    echo "Installing frontend dependencies..."
    npm install
fi

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}⚠️  Backend virtual environment not found!${NC}"
    echo "Creating virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Start Backend Server
echo -e "${BLUE}📡 Starting Backend Server (FastAPI)...${NC}"
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start Frontend Server
echo -e "${GREEN}🎨 Starting Frontend Server (Vite)...${NC}"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo "========================================"
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}  http://localhost:8000"
echo -e "          API Docs: http://localhost:8000/docs"
echo ""
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "          IELTS Practice: http://localhost:5173/ielts-practice"
echo ""
echo "========================================"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Monitor logs
echo "📋 Monitoring logs (Ctrl+C to stop)..."
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log &

# Wait for background processes
wait
