"""
IELTS Agentic AI API Routes
Endpoints for multi-agent IELTS speaking coach
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.services.agent_orchestrator import agent_orchestrator
from pydantic import BaseModel

router = APIRouter()

# Request/Response Models
class StartSessionRequest(BaseModel):
    user_id: int
    session_type: str = "practice"  # practice|mock|exam
    user_profile: Dict[str, Any] = {}

class UserResponseRequest(BaseModel):
    session_id: str
    user_response: str
    transcript_metadata: Dict[str, Any] = {}

class EndSessionRequest(BaseModel):
    session_id: str
    full_transcript: str
    metadata: Dict[str, Any] = {}

class StudyPlanRequest(BaseModel):
    user_id: int
    target_band: float
    available_days: List[str]
    user_profile: Dict[str, Any] = {}

class ContentIdeasRequest(BaseModel):
    topic: str
    question_type: str = "opinion"

class CueCardRequest(BaseModel):
    user_profile: Dict[str, Any] = {}

# IELTS Speaking Session Endpoints
@router.post("/ielts/session/start")
def start_ielts_session(request: StartSessionRequest):
    """
    Start a new IELTS speaking session
    
    Agents involved:
    - Examiner Agent
    - Coach Agent
    - Confidence Agent
    """
    try:
        result = agent_orchestrator.start_speaking_session(
            user_id=request.user_id,
            user_profile=request.user_profile,
            session_type=request.session_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ielts/session/respond")
def process_user_response(request: UserResponseRequest):
    """
    Process user's speaking response and get next question
    
    Agents involved:
    - Examiner Agent (adaptive questioning)
    - Confidence Agent (real-time analysis)
    """
    try:
        result = agent_orchestrator.process_user_response(
            session_id=request.session_id,
            user_response=request.user_response,
            transcript_metadata=request.transcript_metadata
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ielts/session/end")
def end_session_and_score(request: EndSessionRequest):
    """
    End session and get comprehensive scoring
    
    Agents involved:
    - Fluency Agent
    - Grammar Agent
    - Vocabulary Agent
    - Pronunciation Agent
    - Scoring Orchestrator Agent
    - QA Agent (validation)
    - Reflection Agent
    - Coach Agent
    """
    try:
        result = agent_orchestrator.end_session_and_score(
            session_id=request.session_id,
            full_transcript=request.full_transcript,
            metadata=request.metadata
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Study Planning Endpoints
@router.post("/ielts/study-plan/generate")
def generate_study_plan(request: StudyPlanRequest):
    """
    Generate autonomous study plan
    
    Agent involved:
    - Planner Agent (fully autonomous planning)
    """
    try:
        plan = agent_orchestrator.generate_study_plan(
            user_profile=request.user_profile,
            target_band=request.target_band,
            available_days=request.available_days
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content Support Endpoints
@router.post("/ielts/content/ideas")
def get_content_ideas(request: ContentIdeasRequest):
    """
    Get content ideas for a topic
    
    Agent involved:
    - Content Agent (idea generation)
    """
    try:
        ideas = agent_orchestrator.get_content_ideas(
            topic=request.topic,
            question_type=request.question_type
        )
        return ideas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ielts/cue-card/generate")
def generate_cue_card(request: CueCardRequest):
    """
    Generate Part 2 cue card
    
    Agent involved:
    - Examiner Agent
    """
    try:
        cue_card = agent_orchestrator.generate_cue_card(
            user_profile=request.user_profile
        )
        return cue_card
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Agent Status Endpoints
@router.get("/ielts/agents/status")
def get_agents_status():
    """Get status of all agents"""
    return {
        "examiner": agent_orchestrator.examiner.state.dict(),
        "scorer": agent_orchestrator.scorer.state.dict(),
        "planner": agent_orchestrator.planner.state.dict(),
        "coach": agent_orchestrator.coach.state.dict(),
        "confidence": agent_orchestrator.confidence.state.dict(),
        "content": agent_orchestrator.content.state.dict(),
        "reflection": agent_orchestrator.reflection.state.dict()
    }

@router.get("/ielts/sessions/active")
def get_active_sessions():
    """Get all active sessions"""
    return {
        "active_sessions": list(agent_orchestrator.active_sessions.keys()),
        "count": len(agent_orchestrator.active_sessions)
    }
