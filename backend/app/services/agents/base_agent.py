"""
Agentic AI Framework for IELTS Speaking Coach
Multi-agent system with autonomous decision-making
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class AgentRole(str, Enum):
    EXAMINER = "examiner"
    FLUENCY = "fluency"
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    PRONUNCIATION = "pronunciation"
    PLANNER = "planner"
    COACH = "coach"
    QA = "qa"
    CONFIDENCE = "confidence"
    CONTENT = "content"
    REFLECTION = "reflection"
    DIFFICULTY = "difficulty"
    ETHICS = "ethics"

class AgentMemory(BaseModel):
    """Persistent memory for each agent"""
    observations: List[Dict[str, Any]] = []
    decisions: List[Dict[str, Any]] = []
    actions: List[Dict[str, Any]] = []
    reflections: List[Dict[str, Any]] = []
    
class AgentState(BaseModel):
    """Current state of an agent"""
    role: AgentRole
    active: bool = True
    confidence: float = 1.0
    last_action: Optional[datetime] = None
    memory: AgentMemory = AgentMemory()

class BaseAgent:
    """Base class for all agents"""
    
    def __init__(self, role: AgentRole, llm_service):
        self.role = role
        self.llm_service = llm_service
        self.state = AgentState(role=role)
        
    def observe(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Observe the environment and gather information"""
        observation = {
            "timestamp": datetime.utcnow().isoformat(),
            "context": context,
            "agent": self.role.value
        }
        self.state.memory.observations.append(observation)
        return observation
    
    def decide(self, observation: Dict[str, Any]) -> Dict[str, Any]:
        """Make a decision based on observation"""
        decision = {
            "timestamp": datetime.utcnow().isoformat(),
            "based_on": observation,
            "agent": self.role.value
        }
        self.state.memory.decisions.append(decision)
        return decision
    
    def act(self, decision: Dict[str, Any]) -> Dict[str, Any]:
        """Execute action based on decision"""
        action = {
            "timestamp": datetime.utcnow().isoformat(),
            "decision": decision,
            "agent": self.role.value
        }
        self.state.memory.actions.append(action)
        self.state.last_action = datetime.utcnow()
        return action
    
    def reflect(self, action: Dict[str, Any], outcome: Dict[str, Any]) -> Dict[str, Any]:
        """Reflect on action and outcome to improve"""
        reflection = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "outcome": outcome,
            "agent": self.role.value,
            "learnings": []
        }
        self.state.memory.reflections.append(reflection)
        return reflection
    
    def get_memory_context(self, limit: int = 10) -> str:
        """Get recent memory as context for LLM"""
        recent_observations = self.state.memory.observations[-limit:]
        recent_decisions = self.state.memory.decisions[-limit:]
        recent_reflections = self.state.memory.reflections[-limit:]
        
        context = f"Agent Role: {self.role.value}\n\n"
        context += "Recent Observations:\n"
        for obs in recent_observations:
            context += f"- {obs}\n"
        context += "\nRecent Decisions:\n"
        for dec in recent_decisions:
            context += f"- {dec}\n"
        context += "\nRecent Reflections:\n"
        for ref in recent_reflections:
            context += f"- {ref}\n"
        
        return context
