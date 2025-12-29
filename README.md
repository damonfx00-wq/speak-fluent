# Speak-Fluent: AI-Powered IELTS Speaking Coach 🎓

An autonomous IELTS speaking coach powered by **11 cooperating AI agents** using the NVIDIA API.

## 🚀 Quick Start

### Option 1: Run Everything (Recommended)
```bash
./run-all.sh
```

### Option 2: Run Simple Version
```bash
./run-simple.sh
```

### Option 3: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **IELTS Practice**: http://localhost:5173/ielts-practice
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 Features

### Multi-Agent AI System
- **Examiner Agent** - Adaptive IELTS questioning
- **Fluency Agent** - Pause & coherence analysis
- **Grammar Agent** - Error detection & explanation
- **Vocabulary Agent** - Lexical range analysis
- **Pronunciation Agent** - Sound & intonation feedback
- **Scoring Orchestrator** - Comprehensive band scoring
- **Coach Agent** - Motivation & guidance
- **Confidence Agent** - Psychology & mindset support
- **Planner Agent** - Autonomous study planning
- **Content Agent** - Idea generation
- **Reflection Agent** - Self-improvement insights

### Key Capabilities
✅ Fully adaptive questioning (no fixed scripts)
✅ Transparent, explainable scoring
✅ Real-time confidence analysis
✅ Comprehensive IELTS band scores
✅ Personalized study plans
✅ Content idea generation
✅ Psychological support

## 📁 Project Structure

```
speak-fluent/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── routes.py      # General routes
│   │   │   └── ielts_routes.py # IELTS agentic AI routes
│   │   ├── services/
│   │   │   ├── agents/        # 11 AI agents
│   │   │   ├── nvidia_service.py
│   │   │   └── agent_orchestrator.py
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── db/                # Database connection
│   │   └── core/              # Configuration
│   ├── docs/                  # Documentation
│   └── main.py                # Entry point
│
├── src/                       # React frontend
│   ├── pages/
│   │   └── IELTSPractice.tsx  # Main IELTS practice page
│   ├── lib/
│   │   └── api-client.ts      # API client
│   └── components/            # UI components
│
├── run-all.sh                 # Run both servers
├── run-simple.sh              # Simple run script
└── README.md                  # This file
```

## 🔧 Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- NVIDIA API Key

### Backend Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

   Required variables:
   ```env
   NVIDIA_API_KEY=your_nvidia_api_key
   DATABASE_URL=postgresql://user:password%40special@localhost/speak
   ```

4. **Setup database:**
   ```sql
   CREATE DATABASE speak;
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL (optional):**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

## 📖 Documentation

- **Phase 3 Documentation**: [PHASE3_COMPLETE.md](PHASE3_COMPLETE.md)
- **Backend Docs**: [backend/docs/README.md](backend/docs/README.md)
- **Architecture**: [backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md)
- **API Reference**: http://localhost:8000/docs (when running)

## 🎓 Usage

### 1. Start IELTS Practice Session
- Navigate to `/ielts-practice`
- Click "Start Session"
- Receive motivation from Coach Agent
- Get your first question

### 2. Practice Speaking
- Read the question
- Type or speak your response
- Submit response
- Receive:
  - Next adaptive question
  - Confidence level analysis
  - Real-time tips

### 3. Get Comprehensive Feedback
- Click "End Session"
- Receive:
  - Overall band score
  - Individual criterion scores
  - Strengths & weaknesses
  - Reflection insights
  - Coach's encouragement

## 🤖 Agent Communication Flow

```
User Starts Session
    ↓
Examiner Agent → First Question
Coach Agent → Motivation
    ↓
User Responds
    ↓
Examiner Agent → Process Response
Confidence Agent → Analyze Patterns
    ↓
Examiner Agent → Next Question
    ↓
[Repeat]
    ↓
All Criterion Agents → Analyze
    ↓
Scoring Orchestrator → Aggregate
    ↓
QA Agent → Validate
    ↓
Reflection + Coach → Feedback
```

## 🔑 API Endpoints

### IELTS Session
- `POST /api/v1/ielts/session/start` - Start session
- `POST /api/v1/ielts/session/respond` - Process response
- `POST /api/v1/ielts/session/end` - End & score

### Study Planning
- `POST /api/v1/ielts/study-plan/generate` - Generate plan

### Content Support
- `POST /api/v1/ielts/content/ideas` - Get ideas
- `POST /api/v1/ielts/cue-card/generate` - Generate cue card

### Monitoring
- `GET /api/v1/ielts/agents/status` - Agent status
- `GET /api/v1/ielts/sessions/active` - Active sessions

## 🆚 Why Agentic AI?

| Traditional ML | Agentic AI (Our System) |
|----------------|-------------------------|
| Needs training data | Uses reasoning |
| Black-box scores | Fully explainable |
| Static behavior | Adaptive |
| Expensive retraining | Prompt evolution |
| Hard to debug | Transparent logic |

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- NVIDIA API (gpt-oss-120b)
- PostgreSQL
- SQLAlchemy
- Pydantic

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS
- shadcn/ui

## 📊 Status

- ✅ Phase 1: Basic Setup
- ✅ Phase 2: Language Learning Features
- ✅ **Phase 3: Agentic AI System** (Current)
- 🔄 Phase 4: Advanced Features (Planned)

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📝 License

MIT

---

**Built with ❤️ using Agentic AI**
**Version**: 1.0.0
**Last Updated**: 2025-12-29
