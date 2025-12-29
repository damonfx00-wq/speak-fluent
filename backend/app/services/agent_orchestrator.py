"""
Multi-Agent Orchestration System
Coordinates all agents for comprehensive IELTS coaching
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from .agents.examiner_agent import ExaminerAgent
from .agents.scoring_agent import ScoringOrchestratorAgent
from .agents.support_agents import (
    PlannerAgent, CoachAgent, ConfidenceAgent, 
    ContentAgent, ReflectionAgent
)
from .nvidia_service import nvidia_llm_service

class AgentOrchestrator:
    """
    Central orchestrator for all AI agents
    Manages agent-to-agent communication and workflow
    """
    
    def __init__(self):
        self.llm_service = nvidia_llm_service
        
        # Initialize all agents
        self.examiner = ExaminerAgent(self.llm_service)
        self.scorer = ScoringOrchestratorAgent(self.llm_service)
        self.planner = PlannerAgent(self.llm_service)
        self.coach = CoachAgent(self.llm_service)
        self.confidence = ConfidenceAgent(self.llm_service)
        self.content = ContentAgent(self.llm_service)
        self.reflection = ReflectionAgent(self.llm_service)
        
        self.active_sessions = {}
    
    def start_speaking_session(
        self, 
        user_id: int,
        user_profile: Dict[str, Any],
        session_type: str = "practice"  # practice|mock|exam
    ) -> Dict[str, Any]:
        """
        Start a new speaking session
        
        Flow:
        1. Examiner Agent starts session
        2. Coach Agent provides pre-session motivation
        3. Confidence Agent assesses readiness
        """
        
        # Get motivation from coach
        motivation = self.coach.provide_motivation(
            user_state=user_profile,
            recent_performance=user_profile.get("recent_performance", {})
        )
        
        # Start examiner session
        examiner_response = self.examiner.start_session(user_profile)
        
        # Create session record
        session_id = f"{user_id}_{datetime.utcnow().timestamp()}"
        self.active_sessions[session_id] = {
            "user_id": user_id,
            "type": session_type,
            "started_at": datetime.utcnow().isoformat(),
            "examiner_state": self.examiner.state,
            "exchanges": []
        }
        
        return {
            "session_id": session_id,
            "motivation": motivation,
            "first_question": examiner_response["question"],
            "part": examiner_response["part"],
            "session_type": session_type
        }
    
    def process_user_response(
        self,
        session_id: str,
        user_response: str,
        transcript_metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process user's speaking response
        
        Flow:
        1. Examiner Agent processes response
        2. Confidence Agent analyzes speech patterns
        3. Examiner Agent generates next question
        """
        
        if session_id not in self.active_sessions:
            raise ValueError("Invalid session ID")
        
        session = self.active_sessions[session_id]
        
        # Confidence analysis (real-time)
        confidence_analysis = self.confidence.analyze_confidence(
            speech_patterns=transcript_metadata,
            user_feedback=None
        )
        
        # Examiner processes and generates next question
        examiner_response = self.examiner.process_response(
            user_response,
            transcript_metadata
        )
        
        # Record exchange
        session["exchanges"].append({
            "user_response": user_response,
            "metadata": transcript_metadata,
            "confidence_analysis": confidence_analysis,
            "examiner_response": examiner_response,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "next_question": examiner_response["question"],
            "part": examiner_response["part"],
            "confidence_tips": confidence_analysis.get("recommendations", []),
            "confidence_level": confidence_analysis.get("confidence_level"),
            "action": examiner_response.get("action")
        }
    
    def end_session_and_score(
        self,
        session_id: str,
        full_transcript: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        End session and provide comprehensive scoring
        
        Flow:
        1. Scoring Orchestrator Agent scores all criteria
        2. QA Agent validates scores
        3. Reflection Agent generates insights
        4. Coach Agent provides encouragement
        5. Planner Agent suggests next steps
        """
        
        if session_id not in self.active_sessions:
            raise ValueError("Invalid session ID")
        
        session = self.active_sessions[session_id]
        
        # Comprehensive scoring
        score = self.scorer.score_response(full_transcript, metadata)
        
        # QA validation
        validation = self.scorer.validate_score(score)
        
        # Apply corrections if needed
        if not validation["valid"] and validation["corrections"]:
            score.update(validation["corrections"])
        
        # Reflection
        reflection = self.reflection.generate_reflection(
            session_data=session,
            previous_sessions=[]  # Would come from database
        )
        
        # Coach feedback
        coach_feedback = self.coach.provide_motivation(
            user_state={"current_band": score["overall_band"]},
            recent_performance=score
        )
        
        # Planner suggestions
        # (Would integrate with full study plan)
        
        return {
            "session_id": session_id,
            "score": score,
            "validation": validation,
            "reflection": reflection,
            "coach_message": coach_feedback,
            "session_summary": {
                "duration": len(session["exchanges"]),
                "parts_completed": self.examiner.current_part,
                "exchanges": len(session["exchanges"])
            }
        }
    
    def generate_study_plan(
        self,
        user_profile: Dict[str, Any],
        target_band: float,
        available_days: List[str]
    ) -> Dict[str, Any]:
        """
        Generate autonomous study plan
        """
        
        current_band = user_profile.get("current_band", 5.0)
        
        plan = self.planner.create_study_plan(
            user_profile=user_profile,
            target_band=target_band,
            available_days=available_days,
            current_band=current_band
        )
        
        return plan
    
    def get_content_ideas(
        self,
        topic: str,
        question_type: str = "opinion"
    ) -> Dict[str, Any]:
        """
        Get content ideas for a topic
        """
        
        ideas = self.content.generate_ideas(topic, question_type)
        
        return ideas
    
    def generate_cue_card(
        self,
        user_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate Part 2 cue card
        """
        
        cue_card = self.examiner.generate_cue_card(user_profile)
        
        return cue_card

# Singleton instance
agent_orchestrator = AgentOrchestrator()
