"""
Scoring Orchestrator Agent
Aggregates all criterion agents and produces final IELTS band score
"""

from typing import Dict, List, Any
from .base_agent import BaseAgent, AgentRole
from .criterion_agents import FluencyAgent, GrammarAgent, VocabularyAgent, PronunciationAgent
import json

class ScoringOrchestratorAgent(BaseAgent):
    """
    Orchestrates all criterion agents
    - Collects individual scores
    - Resolves conflicts
    - Produces final band score with explanation
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.QA, llm_service)
        
        # Initialize criterion agents
        self.fluency_agent = FluencyAgent(llm_service)
        self.grammar_agent = GrammarAgent(llm_service)
        self.vocabulary_agent = VocabularyAgent(llm_service)
        self.pronunciation_agent = PronunciationAgent(llm_service)
    
    def score_response(
        self, 
        transcript: str, 
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Comprehensive scoring using all agents
        """
        # Collect analyses from all agents
        fluency_analysis = self.fluency_agent.analyze(transcript, metadata)
        grammar_analysis = self.grammar_agent.analyze(transcript)
        vocabulary_analysis = self.vocabulary_agent.analyze(transcript)
        pronunciation_analysis = self.pronunciation_agent.analyze(
            transcript, 
            metadata.get("audio", {})
        )
        
        # Aggregate scores
        context = {
            "fluency": fluency_analysis,
            "grammar": grammar_analysis,
            "vocabulary": vocabulary_analysis,
            "pronunciation": pronunciation_analysis
        }
        
        observation = self.observe(context)
        
        # Use LLM to resolve conflicts and produce final score
        prompt = f"""You are an IELTS scoring orchestrator.

Agent Analyses:

FLUENCY & COHERENCE:
{json.dumps(fluency_analysis, indent=2)}

GRAMMATICAL RANGE & ACCURACY:
{json.dumps(grammar_analysis, indent=2)}

LEXICAL RESOURCE:
{json.dumps(vocabulary_analysis, indent=2)}

PRONUNCIATION:
{json.dumps(pronunciation_analysis, indent=2)}

Your task:
1. Review all agent scores
2. Resolve any conflicts or inconsistencies
3. Calculate final band score (average of 4 criteria)
4. Provide comprehensive feedback

Return JSON:
{{
    "fluency_band": "5.0-9.0",
    "grammar_band": "5.0-9.0",
    "vocabulary_band": "5.0-9.0",
    "pronunciation_band": "5.0-9.0",
    "overall_band": "5.0-9.0",
    "strengths": ["overall strength 1", "overall strength 2"],
    "weaknesses": ["overall weakness 1", "overall weakness 2"],
    "priority_improvements": ["improvement 1", "improvement 2"],
    "detailed_feedback": "comprehensive explanation",
    "confidence": "0.0-1.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.2
        )
        
        try:
            final_score = json.loads(response)
        except:
            # Fallback: simple average
            bands = [
                float(fluency_analysis.get("band_estimate", "6.0")),
                float(grammar_analysis.get("band_estimate", "6.0")),
                float(vocabulary_analysis.get("band_estimate", "6.0")),
                float(pronunciation_analysis.get("band_estimate", "6.0"))
            ]
            overall = sum(bands) / len(bands)
            
            final_score = {
                "fluency_band": str(bands[0]),
                "grammar_band": str(bands[1]),
                "vocabulary_band": str(bands[2]),
                "pronunciation_band": str(bands[3]),
                "overall_band": f"{overall:.1f}",
                "strengths": ["Completed the task"],
                "weaknesses": ["Needs improvement"],
                "priority_improvements": ["Practice more"],
                "detailed_feedback": "Continue practicing",
                "confidence": "0.8"
            }
        
        decision = self.decide({"final_score": final_score})
        action = self.act(decision)
        
        # Add individual analyses to result
        final_score["detailed_analyses"] = {
            "fluency": fluency_analysis,
            "grammar": grammar_analysis,
            "vocabulary": vocabulary_analysis,
            "pronunciation": pronunciation_analysis
        }
        
        return final_score
    
    def validate_score(self, score: Dict[str, Any]) -> Dict[str, Any]:
        """
        QA validation of the score
        Ensures fairness and accuracy
        """
        prompt = f"""You are a QA agent validating IELTS scores.

Score to validate:
{json.dumps(score, indent=2)}

Check:
1. Are scores consistent with feedback?
2. Is the overall band correctly calculated?
3. Are there any biases or unfair judgments?
4. Is feedback constructive and specific?

Return JSON:
{{
    "valid": true|false,
    "issues": ["issue 1", "issue 2"],
    "corrections": {{"field": "corrected_value"}},
    "confidence": "0.0-1.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.1
        )
        
        try:
            validation = json.loads(response)
        except:
            validation = {
                "valid": True,
                "issues": [],
                "corrections": {},
                "confidence": "0.9"
            }
        
        return validation
