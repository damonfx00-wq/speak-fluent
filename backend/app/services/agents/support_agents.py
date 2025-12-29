"""
Supporting Agents for Holistic IELTS Preparation
- Planner Agent: Autonomous study planning
- Coach Agent: Motivation and guidance
- Confidence Agent: Psychology and mindset
- Content Agent: Idea generation support
- Reflection Agent: Self-improvement
"""

from typing import Dict, List, Any, Optional
from .base_agent import BaseAgent, AgentRole
from datetime import datetime, timedelta
import json

class PlannerAgent(BaseAgent):
    """
    Autonomous study planner
    - Adapts to user progress
    - Considers calendar availability
    - Adjusts difficulty dynamically
    - Prevents burnout
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.PLANNER, llm_service)
    
    def create_study_plan(
        self, 
        user_profile: Dict[str, Any],
        target_band: float,
        available_days: List[str],
        current_band: float
    ) -> Dict[str, Any]:
        """Generate personalized study plan"""
        
        context = {
            "user_profile": user_profile,
            "target_band": target_band,
            "current_band": current_band,
            "available_days": available_days,
            "gap": target_band - current_band
        }
        
        observation = self.observe(context)
        
        prompt = f"""You are an autonomous IELTS study planner.

User Profile: {json.dumps(user_profile, indent=2)}
Current Band: {current_band}
Target Band: {target_band}
Available Days: {available_days}

Create a personalized study plan:
1. Daily practice schedule
2. Focus areas based on weaknesses
3. Mock test schedule
4. Rest days to prevent burnout
5. Milestone targets

Return JSON:
{{
    "duration_weeks": 4-12,
    "daily_schedule": [
        {{
            "day": "Monday",
            "activities": [
                {{"type": "practice", "focus": "fluency", "duration": 30}}
            ]
        }}
    ],
    "weekly_goals": ["goal 1", "goal 2"],
    "mock_tests": ["week 2", "week 4"],
    "rest_days": ["Sunday"],
    "reasoning": "why this plan"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.6
        )
        
        try:
            plan = json.loads(response)
        except:
            plan = {
                "duration_weeks": 8,
                "daily_schedule": [],
                "weekly_goals": ["Improve fluency"],
                "mock_tests": ["week 4", "week 8"],
                "rest_days": ["Sunday"],
                "reasoning": "Balanced approach"
            }
        
        decision = self.decide({"plan": plan})
        action = self.act(decision)
        
        return plan
    
    def adapt_plan(
        self, 
        current_plan: Dict[str, Any],
        progress_data: Dict[str, Any],
        missed_sessions: int
    ) -> Dict[str, Any]:
        """Adapt plan based on progress"""
        
        prompt = f"""Adapt the study plan based on progress.

Current Plan: {json.dumps(current_plan, indent=2)}
Progress Data: {json.dumps(progress_data, indent=2)}
Missed Sessions: {missed_sessions}

Decide:
1. Should we increase difficulty?
2. Should we reduce load?
3. Should we change focus areas?
4. Should we reschedule mock tests?

Return JSON with adaptations.
"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.5
        )
        
        try:
            adapted_plan = json.loads(response)
        except:
            adapted_plan = current_plan
        
        return adapted_plan


class CoachAgent(BaseAgent):
    """
    Motivational coach
    - Encouragement
    - Progress celebration
    - Setback support
    - Goal reinforcement
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.COACH, llm_service)
    
    def provide_motivation(
        self, 
        user_state: Dict[str, Any],
        recent_performance: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Provide personalized motivation"""
        
        context = {
            "user_state": user_state,
            "recent_performance": recent_performance
        }
        
        observation = self.observe(context)
        
        prompt = f"""You are a supportive IELTS coach.

User State: {json.dumps(user_state, indent=2)}
Recent Performance: {json.dumps(recent_performance, indent=2)}

Provide:
1. Personalized encouragement
2. Progress acknowledgment
3. Next steps motivation
4. Confidence boost

Return JSON:
{{
    "message": "motivational message",
    "tone": "encouraging|celebratory|supportive",
    "action_items": ["next step 1", "next step 2"],
    "mindset_tip": "psychological tip"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.8
        )
        
        try:
            motivation = json.loads(response)
        except:
            motivation = {
                "message": "Keep going! You're making progress.",
                "tone": "encouraging",
                "action_items": ["Practice daily"],
                "mindset_tip": "Focus on improvement, not perfection"
            }
        
        return motivation


class ConfidenceAgent(BaseAgent):
    """
    Psychology and confidence coach
    - Detects nervousness
    - Provides calming techniques
    - Builds exam confidence
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.CONFIDENCE, llm_service)
    
    def analyze_confidence(
        self, 
        speech_patterns: Dict[str, Any],
        user_feedback: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze confidence level from speech"""
        
        context = {
            "speech_patterns": speech_patterns,
            "user_feedback": user_feedback
        }
        
        observation = self.observe(context)
        
        prompt = f"""You are a confidence and psychology expert.

Speech Patterns: {json.dumps(speech_patterns, indent=2)}
User Feedback: {user_feedback}

Detect:
1. Signs of nervousness (rushed speech, long pauses)
2. Confidence level
3. Anxiety indicators

Provide:
1. Confidence assessment
2. Calming techniques
3. Mindset tips

Return JSON:
{{
    "confidence_level": "low|medium|high",
    "nervousness_indicators": ["indicator 1"],
    "recommendations": ["technique 1", "technique 2"],
    "breathing_exercise": "description",
    "mindset_shift": "psychological tip"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.6
        )
        
        try:
            analysis = json.loads(response)
        except:
            analysis = {
                "confidence_level": "medium",
                "nervousness_indicators": [],
                "recommendations": ["Take deep breaths", "Speak slowly"],
                "breathing_exercise": "Breathe in for 4, hold for 4, out for 4",
                "mindset_shift": "Focus on communication, not perfection"
            }
        
        return analysis


class ContentAgent(BaseAgent):
    """
    Idea and content generation support
    - Helps with thinking, not just speaking
    - Generates ideas for topics
    - Provides examples and contrasts
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.CONTENT, llm_service)
    
    def generate_ideas(
        self, 
        topic: str,
        question_type: str = "opinion"
    ) -> Dict[str, Any]:
        """Generate ideas for a topic"""
        
        prompt = f"""Help generate ideas for IELTS speaking.

Topic: {topic}
Question Type: {question_type}

Provide:
1. Main ideas (2-3)
2. Supporting examples
3. Contrasting viewpoints
4. Logical structure

Return JSON:
{{
    "main_ideas": ["idea 1", "idea 2"],
    "examples": ["example 1", "example 2"],
    "contrasts": ["viewpoint A vs viewpoint B"],
    "structure": "suggested flow"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        try:
            ideas = json.loads(response)
        except:
            ideas = {
                "main_ideas": ["Consider different perspectives"],
                "examples": ["Use personal experience"],
                "contrasts": ["Compare pros and cons"],
                "structure": "Introduction → Main points → Conclusion"
            }
        
        return ideas


class ReflectionAgent(BaseAgent):
    """
    Self-reflection and improvement agent
    - Post-session analysis
    - Identifies patterns
    - Suggests focused improvements
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.REFLECTION, llm_service)
    
    def generate_reflection(
        self, 
        session_data: Dict[str, Any],
        previous_sessions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate post-session reflection"""
        
        prompt = f"""You are a reflection coach for IELTS.

Current Session: {json.dumps(session_data, indent=2)}
Previous Sessions: {json.dumps(previous_sessions[-3:], indent=2)}

Generate reflection questions and insights:
1. What went well?
2. What needs improvement?
3. What patterns do you notice?
4. What should be the focus next time?

Return JSON:
{{
    "went_well": ["positive 1", "positive 2"],
    "needs_work": ["area 1", "area 2"],
    "patterns": ["pattern 1"],
    "next_focus": "specific area",
    "actionable_steps": ["step 1", "step 2"],
    "reattempt_recommendation": "yes|no|later"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.5
        )
        
        try:
            reflection = json.loads(response)
        except:
            reflection = {
                "went_well": ["Completed session"],
                "needs_work": ["Fluency"],
                "patterns": ["Consistent effort"],
                "next_focus": "Grammar",
                "actionable_steps": ["Practice daily"],
                "reattempt_recommendation": "later"
            }
        
        return reflection
