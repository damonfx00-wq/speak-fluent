# Phase 3: Agentic AI-Driven IELTS Speaking Coach

## 🤖 Multi-Agent Architecture

### Core Philosophy
**"An Autonomous IELTS Speaking Coach made of cooperating AI agents"**

Instead of training ML models, we orchestrate specialized AI agents that:
- **Observe** - Gather information from environment
- **Decide** - Make autonomous decisions
- **Act** - Execute actions
- **Reflect** - Learn and improve continuously

---

## 🎯 Agent Roster

| Agent | Responsibility | Key Functions |
|-------|---------------|---------------|
| **Examiner Agent** | Ask & evaluate speaking | Adaptive questioning, IELTS format |
| **Fluency Agent** | Analyze pauses & speed | Pause patterns, coherence |
| **Grammar Agent** | Detect & explain errors | Tense, structure, accuracy |
| **Vocabulary Agent** | Lexical richness & repetition | Range, collocations |
| **Pronunciation Agent** | Sound & stress feedback | Clarity, intonation |
| **Planner Agent** | Build & adapt schedules | Autonomous study planning |
| **Coach Agent** | Motivation & guidance | Encouragement, progress |
| **QA Agent** | Validate feedback accuracy | Score validation |
| **Confidence Agent** | Psychology & mindset | Nervousness detection |
| **Content Agent** | Idea generation | Thinking support |
| **Reflection Agent** | Self-improvement | Post-session insights |

---

## 🔄 Agent-to-Agent Communication Flow

```
User Speaks
    ↓
Examiner Agent (adaptive questioning)
    ↓
Confidence Agent (real-time analysis)
    ↓
[Session continues...]
    ↓
Fluency / Grammar / Vocabulary / Pronunciation Agents (parallel analysis)
    ↓
Scoring Orchestrator Agent (aggregation)
    ↓
QA Agent (validation)
    ↓
Reflection Agent (insights)
    ↓
Coach Agent (motivation)
    ↓
Planner Agent (next steps)
```

---

## 📡 API Endpoints

### Session Management

#### Start Session
```http
POST /api/v1/ielts/session/start
```
**Request:**
```json
{
  "user_id": 1,
  "session_type": "practice",
  "user_profile": {
    "current_band": 6.0,
    "target_band": 7.5,
    "weak_areas": ["fluency", "vocabulary"]
  }
}
```

**Response:**
```json
{
  "session_id": "1_1735478400.123",
  "motivation": {
    "message": "You're making great progress! Let's focus on fluency today.",
    "tone": "encouraging"
  },
  "first_question": "Let's begin. Can you tell me about your work or studies?",
  "part": 1,
  "session_type": "practice"
}
```

#### Process Response
```http
POST /api/v1/ielts/session/respond
```
**Request:**
```json
{
  "session_id": "1_1735478400.123",
  "user_response": "I am currently studying computer science at university...",
  "transcript_metadata": {
    "duration": 45,
    "word_count": 78,
    "pause_count": 3
  }
}
```

**Response:**
```json
{
  "next_question": "That's interesting. What do you enjoy most about your studies?",
  "part": 1,
  "confidence_tips": ["Speak at a steady pace", "Take natural pauses"],
  "confidence_level": "medium",
  "action": "follow_up"
}
```

#### End Session & Score
```http
POST /api/v1/ielts/session/end
```
**Request:**
```json
{
  "session_id": "1_1735478400.123",
  "full_transcript": "Complete transcript...",
  "metadata": {
    "total_duration": 600,
    "total_words": 450
  }
}
```

**Response:**
```json
{
  "score": {
    "fluency_band": "6.5",
    "grammar_band": "6.0",
    "vocabulary_band": "6.5",
    "pronunciation_band": "7.0",
    "overall_band": "6.5",
    "strengths": ["Clear pronunciation", "Good vocabulary range"],
    "weaknesses": ["Some grammatical errors", "Occasional long pauses"],
    "priority_improvements": ["Practice complex sentences", "Reduce hesitation"],
    "detailed_feedback": "Your speaking shows good progress..."
  },
  "reflection": {
    "went_well": ["Maintained conversation flow"],
    "needs_work": ["Grammar accuracy"],
    "next_focus": "Complex sentence structures"
  },
  "coach_message": {
    "message": "Great effort! You're improving steadily.",
    "action_items": ["Practice Part 2 cue cards", "Review grammar"]
  }
}
```

### Study Planning

#### Generate Study Plan
```http
POST /api/v1/ielts/study-plan/generate
```
**Request:**
```json
{
  "user_id": 1,
  "target_band": 7.5,
  "available_days": ["Monday", "Wednesday", "Friday", "Saturday"],
  "user_profile": {
    "current_band": 6.0,
    "weak_areas": ["fluency", "grammar"]
  }
}
```

**Response:**
```json
{
  "duration_weeks": 8,
  "daily_schedule": [
    {
      "day": "Monday",
      "activities": [
        {"type": "practice", "focus": "fluency", "duration": 30},
        {"type": "review", "focus": "grammar", "duration": 20}
      ]
    }
  ],
  "weekly_goals": ["Improve fluency by 0.5 band", "Master complex sentences"],
  "mock_tests": ["week 4", "week 8"],
  "rest_days": ["Sunday"],
  "reasoning": "Balanced approach focusing on weak areas"
}
```

### Content Support

#### Get Content Ideas
```http
POST /api/v1/ielts/content/ideas
```
**Request:**
```json
{
  "topic": "environmental protection",
  "question_type": "opinion"
}
```

**Response:**
```json
{
  "main_ideas": [
    "Individual responsibility vs government action",
    "Economic impact of environmental policies"
  ],
  "examples": [
    "Plastic bag bans in supermarkets",
    "Electric vehicle incentives"
  ],
  "contrasts": [
    "Short-term costs vs long-term benefits"
  ],
  "structure": "State opinion → Provide examples → Address counterarguments → Conclude"
}
```

#### Generate Cue Card
```http
POST /api/v1/ielts/cue-card/generate
```
**Response:**
```json
{
  "topic": "Describe a memorable event in your life",
  "points": [
    "When and where it happened",
    "Who was involved",
    "What happened",
    "Why it was memorable"
  ],
  "preparation_time": 60,
  "speaking_time": 120
}
```

---

## 🧠 Key Features

### 1. **Fully Adaptive Examiner**
- ✅ No fixed scripts
- ✅ Context-aware follow-ups
- ✅ Natural conversation flow
- ✅ IELTS format compliance

### 2. **Transparent Scoring**
- ✅ Explainable feedback
- ✅ Criterion-specific analysis
- ✅ QA validation
- ✅ No black-box scores

### 3. **Autonomous Planning**
- ✅ Self-adjusting schedules
- ✅ Progress-based adaptation
- ✅ Burnout prevention
- ✅ Dynamic difficulty

### 4. **Psychological Support**
- ✅ Confidence analysis
- ✅ Nervousness detection
- ✅ Calming techniques
- ✅ Mindset coaching

### 5. **Content Assistance**
- ✅ Idea generation
- ✅ Logical structuring
- ✅ Example suggestions
- ✅ Thinking support

---

## 🆚 Agentic AI vs Traditional ML

| Traditional ML | Agentic AI |
|----------------|------------|
| Needs training data | Needs reasoning |
| Hard to explain | Fully explainable |
| Static behavior | Adaptive |
| Costly retraining | Prompt evolution |
| Black-box scores | Transparent logic |
| Fixed responses | Dynamic decisions |

---

## 🏗️ Implementation Details

### Agent Base Class
All agents inherit from `BaseAgent` with:
- **Observe**: Gather context
- **Decide**: Make decisions
- **Act**: Execute actions
- **Reflect**: Learn from outcomes
- **Memory**: Persistent agent memory

### Agent Orchestrator
Central coordinator managing:
- Agent initialization
- Inter-agent communication
- Session management
- Workflow coordination

---

## 📊 Agent Memory System

Each agent maintains:
- **Observations**: What it has seen
- **Decisions**: What it has decided
- **Actions**: What it has done
- **Reflections**: What it has learned

This creates a **Digital Speaking Profile** for each user:
- Common mistakes
- Stress patterns
- Pause points
- Weak topics
- Improvement history

---

## 🎓 Usage Examples

### Python Client
```python
import requests

# Start session
response = requests.post(
    "http://localhost:8000/api/v1/ielts/session/start",
    json={
        "user_id": 1,
        "session_type": "practice",
        "user_profile": {"current_band": 6.0}
    }
)
session_id = response.json()["session_id"]

# Process response
response = requests.post(
    "http://localhost:8000/api/v1/ielts/session/respond",
    json={
        "session_id": session_id,
        "user_response": "I am studying computer science...",
        "transcript_metadata": {"duration": 45}
    }
)
print(response.json()["next_question"])
```

### TypeScript/React
```typescript
import { speakFluentAPI } from '@/lib/api-client';

// Start session
const session = await speakFluentAPI.post('/ielts/session/start', {
  user_id: 1,
  session_type: 'practice',
  user_profile: { current_band: 6.0 }
});

// Process response
const next = await speakFluentAPI.post('/ielts/session/respond', {
  session_id: session.session_id,
  user_response: 'I am studying...',
  transcript_metadata: { duration: 45 }
});
```

---

## 🚀 Getting Started

1. **Start the backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Access API docs**:
   - Swagger: http://localhost:8000/docs
   - Look for "ielts-agentic-ai" tag

3. **Start a session**:
   - Use `/ielts/session/start` endpoint
   - Get your first question
   - Begin speaking practice!

---

## 📈 Future Enhancements (Phase 4)

- Multi-agent debate mode
- Certification-grade readiness report
- Advanced pronunciation analysis
- Real-time coaching during speech
- Adaptive difficulty agent
- Exam-day simulation mode

---

**Status**: ✅ Phase 3 Complete - Agentic AI System Operational
**Version**: 1.0.0
**Last Updated**: 2025-12-29
