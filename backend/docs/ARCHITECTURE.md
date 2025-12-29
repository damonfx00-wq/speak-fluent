# Agentic AI Architecture - Visual Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│              (React Frontend / Mobile App)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                             │
│                  /api/v1/ielts/*                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              AGENT ORCHESTRATOR                              │
│         (Coordinates all AI agents)                          │
└─────┬───────┬──────┬──────┬──────┬──────┬──────┬───────────┘
      │       │      │      │      │      │      │
      ▼       ▼      ▼      ▼      ▼      ▼      ▼
┌─────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌──────┐
│Examiner │ │Flu │ │Gram│ │Voc │ │Pro │ │QA  │ │Coach │
│ Agent   │ │ency│ │mar │ │ab  │ │nun │ │Agt │ │Agent │
└────┬────┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └───┬──┘
     │         │      │      │      │      │       │
     └─────────┴──────┴──────┴──────┴──────┴───────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Scoring          │
                  │ Orchestrator     │
                  └────────┬─────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Additional Agents:    │
              │  - Planner             │
              │  - Confidence          │
              │  - Content             │
              │  - Reflection          │
              └────────────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   NVIDIA API     │
                  │ (gpt-oss-120b)   │
                  └──────────────────┘
```

## 🔄 Session Flow

```
1. START SESSION
   User → API → Orchestrator
   ↓
   Examiner Agent: Generate first question
   Coach Agent: Provide motivation
   ↓
   Return: Question + Motivation

2. USER RESPONDS
   User speaks → Transcript
   ↓
   Examiner Agent: Process response
   Confidence Agent: Analyze patterns
   ↓
   Examiner Agent: Generate next question
   ↓
   Return: Next question + Confidence tips

3. END SESSION
   Full transcript → Orchestrator
   ↓
   Parallel Analysis:
   ├─ Fluency Agent → Pause analysis
   ├─ Grammar Agent → Error detection
   ├─ Vocabulary Agent → Lexical analysis
   └─ Pronunciation Agent → Sound analysis
   ↓
   Scoring Orchestrator: Aggregate scores
   ↓
   QA Agent: Validate scores
   ↓
   Reflection Agent: Generate insights
   Coach Agent: Provide encouragement
   ↓
   Return: Complete feedback + Band score
```

## 🧠 Agent Decision Cycle

```
┌──────────────┐
│   OBSERVE    │  ← Gather context from environment
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   DECIDE     │  ← Make autonomous decision
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     ACT      │  ← Execute action
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   REFLECT    │  ← Learn from outcome
└──────┬───────┘
       │
       └──────────┐
                  │
       ┌──────────▼─────────┐
       │   AGENT MEMORY     │
       │  - Observations    │
       │  - Decisions       │
       │  - Actions         │
       │  - Reflections     │
       └────────────────────┘
```

## 📊 Scoring Pipeline

```
User Transcript
       │
       ▼
┌─────────────────────────────────────┐
│     CRITERION AGENTS (Parallel)     │
├─────────────────────────────────────┤
│ Fluency Agent                       │
│  ├─ Pause analysis                  │
│  ├─ Speech rate                     │
│  └─ Coherence                       │
│                                     │
│ Grammar Agent                       │
│  ├─ Error detection                 │
│  ├─ Tense usage                     │
│  └─ Complexity                      │
│                                     │
│ Vocabulary Agent                    │
│  ├─ Lexical range                   │
│  ├─ Repetition                      │
│  └─ Collocations                    │
│                                     │
│ Pronunciation Agent                 │
│  ├─ Clarity                         │
│  ├─ Stress patterns                 │
│  └─ Intonation                      │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│    SCORING ORCHESTRATOR             │
│  - Aggregate scores                 │
│  - Resolve conflicts                │
│  - Calculate overall band           │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         QA AGENT                    │
│  - Validate scores                  │
│  - Check for bias                   │
│  - Ensure fairness                  │
└─────────────────────────────────────┘
       │
       ▼
    Final Score
```

## 🎯 Agent Specialization

```
EXAMINER AGENT
├─ Adaptive questioning
├─ IELTS format compliance
├─ Context awareness
└─ Natural conversation flow

CRITERION AGENTS
├─ Fluency: Pause & coherence analysis
├─ Grammar: Error detection & explanation
├─ Vocabulary: Range & precision
└─ Pronunciation: Clarity & intonation

SUPPORT AGENTS
├─ Planner: Autonomous study scheduling
├─ Coach: Motivation & encouragement
├─ Confidence: Psychology & mindset
├─ Content: Idea generation
└─ Reflection: Self-improvement insights

QUALITY AGENTS
├─ QA: Score validation
└─ Ethics: Bias detection & fairness
```

## 💾 Data Flow

```
User Input
    ↓
[Transcript + Metadata]
    ↓
Agent Processing
    ↓
[Agent Memory Storage]
    ↓
[Database: PostgreSQL]
    ├─ User profiles
    ├─ Session history
    ├─ Progress tracking
    └─ Agent memories
```

## 🔐 Security & Ethics

```
┌─────────────────────────┐
│   Ethics Guard Agent    │
├─────────────────────────┤
│ ✓ Accent fairness       │
│ ✓ Non-native bias check │
│ ✓ Transparent feedback  │
│ ✓ Cultural sensitivity  │
└─────────────────────────┘
```

## 📈 Continuous Improvement

```
Session 1 → Agent Memory → Patterns Detected
    ↓
Session 2 → Adapted Approach → Better Feedback
    ↓
Session 3 → Refined Strategy → Personalized Coaching
    ↓
Session N → Optimized Experience → Target Band Achieved
```

---

**Key Principle**: Every agent is autonomous, explainable, and continuously learning through the observe-decide-act-reflect cycle.
