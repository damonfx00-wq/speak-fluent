"""
IELTS Examiner Agent - Autonomous Speaking Test Conductor
Fully adaptive, context-aware, no fixed scripts
"""

from typing import Dict, List, Any, Optional
from .base_agent import BaseAgent, AgentRole
import json

class ExaminerAgent(BaseAgent):
    """
    Autonomous IELTS examiner that:
    - Asks contextual questions
    - Adapts to user responses
    - Follows IELTS format dynamically
    - Evaluates speaking in real-time
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.EXAMINER, llm_service)
        self.current_part = 1  # IELTS has 3 parts
        self.conversation_history = []
        
    def start_session(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Start a new IELTS speaking session"""
        context = {
            "user_profile": user_profile,
            "part": 1,
            "action": "start_session"
        }
        
        observation = self.observe(context)
        
        # Decide on opening question
        prompt = f"""You are an IELTS speaking examiner starting Part 1.
        
User Profile: {json.dumps(user_profile, indent=2)}

Generate an appropriate opening question for IELTS Speaking Part 1.
Topics: work/study, hometown, hobbies, daily routine, etc.

Return JSON:
{{
    "question": "your question here",
    "part": 1,
    "topic": "topic name",
    "expected_duration": "30-60 seconds"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        try:
            decision = json.loads(response)
        except:
            decision = {
                "question": "Let's begin. Can you tell me about your work or studies?",
                "part": 1,
                "topic": "work_study",
                "expected_duration": "30-60 seconds"
            }
        
        action = self.act({"type": "ask_question", "data": decision})
        
        return {
            "question": decision["question"],
            "part": decision["part"],
            "topic": decision.get("topic"),
            "session_started": True
        }
    
    def process_response(
        self, 
        user_response: str, 
        transcript_metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process user's response and decide next question
        Fully adaptive based on conversation flow
        """
        context = {
            "user_response": user_response,
            "metadata": transcript_metadata,
            "current_part": self.current_part,
            "conversation_history": self.conversation_history[-5:]  # Last 5 exchanges
        }
        
        observation = self.observe(context)
        
        # Add to conversation history
        self.conversation_history.append({
            "role": "user",
            "content": user_response,
            "metadata": transcript_metadata
        })
        
        # Decide next question using reasoning
        prompt = f"""You are an IELTS speaking examiner in Part {self.current_part}.

Conversation so far:
{json.dumps(self.conversation_history[-5:], indent=2)}

User's last response: "{user_response}"
Metadata: {json.dumps(transcript_metadata, indent=2)}

Based on the conversation flow and IELTS format:
1. Decide if you should:
   - Ask a follow-up question (same topic)
   - Move to a new topic (still Part {self.current_part})
   - Transition to Part {self.current_part + 1} (if Part {self.current_part} is complete)

2. Generate the next question naturally

Return JSON:
{{
    "action": "follow_up|new_topic|transition",
    "next_question": "your question",
    "part": {self.current_part},
    "reasoning": "why you chose this action",
    "topic": "topic name"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        try:
            decision = json.loads(response)
        except:
            decision = {
                "action": "follow_up",
                "next_question": "That's interesting. Can you tell me more about that?",
                "part": self.current_part,
                "reasoning": "Continue conversation",
                "topic": "general"
            }
        
        # Handle part transitions
        if decision.get("action") == "transition":
            self.current_part += 1
            decision["part"] = self.current_part
        
        action = self.act({"type": "ask_question", "data": decision})
        
        self.conversation_history.append({
            "role": "examiner",
            "content": decision["next_question"],
            "part": self.current_part
        })
        
        return {
            "question": decision["next_question"],
            "part": self.current_part,
            "action": decision.get("action"),
            "reasoning": decision.get("reasoning"),
            "topic": decision.get("topic")
        }
    
    def generate_cue_card(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate Part 2 cue card dynamically"""
        prompt = f"""Generate an IELTS Speaking Part 2 cue card.

User Profile: {json.dumps(user_profile, indent=2)}

Create a cue card with:
- Main topic
- 3-4 bullet points to cover
- Preparation time: 1 minute
- Speaking time: 2 minutes

Return JSON:
{{
    "topic": "Describe a...",
    "points": ["point 1", "point 2", "point 3"],
    "preparation_time": 60,
    "speaking_time": 120
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.8
        )
        
        try:
            cue_card = json.loads(response)
        except:
            cue_card = {
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
        
        return cue_card
    
    def evaluate_response(
        self, 
        user_response: str, 
        criteria: str = "overall"
    ) -> Dict[str, Any]:
        """
        Evaluate user's response using IELTS rubric reasoning
        No ML training - pure reasoning
        """
        prompt = f"""You are an IELTS examiner evaluating a response.

User's Response: "{user_response}"

Evaluate based on IELTS {criteria} criteria.

Provide:
1. Strengths
2. Weaknesses
3. Specific examples from the response
4. Improvement suggestions

Return JSON:
{{
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "examples": {{"good": ["example"], "needs_work": ["example"]}},
    "suggestions": ["suggestion 1", "suggestion 2"],
    "preliminary_band": "estimated band (5.0-9.0)"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.3
        )
        
        try:
            evaluation = json.loads(response)
        except:
            evaluation = {
                "strengths": ["Response provided"],
                "weaknesses": ["Needs more detail"],
                "examples": {"good": [], "needs_work": []},
                "suggestions": ["Expand your answers"],
                "preliminary_band": "6.0"
            }
        
        return evaluation
