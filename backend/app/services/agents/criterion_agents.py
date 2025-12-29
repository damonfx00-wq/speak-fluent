"""
Specialized IELTS Criterion Agents
Each agent handles one IELTS scoring criterion autonomously
"""

from typing import Dict, List, Any
from .base_agent import BaseAgent, AgentRole
import json

class FluencyAgent(BaseAgent):
    """
    Analyzes fluency and coherence
    - Pause patterns
    - Speech rate
    - Hesitation markers
    - Logical flow
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.FLUENCY, llm_service)
    
    def analyze(self, transcript: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze fluency and coherence"""
        context = {
            "transcript": transcript,
            "metadata": metadata
        }
        
        observation = self.observe(context)
        
        prompt = f"""You are a fluency and coherence expert for IELTS speaking.

Transcript: "{transcript}"
Metadata: {json.dumps(metadata, indent=2)}

Analyze:
1. Pause frequency and duration
2. Speech rate (words per minute)
3. Hesitation markers (um, uh, like, you know)
4. Logical connectors usage
5. Coherence and cohesion

Return JSON:
{{
    "fluency_score": "0-9",
    "pause_analysis": {{"frequency": "low|medium|high", "impact": "description"}},
    "speech_rate": "slow|moderate|fast",
    "hesitation_count": 0,
    "coherence": "poor|fair|good|excellent",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"],
    "band_estimate": "5.0-9.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.3
        )
        
        try:
            analysis = json.loads(response)
        except:
            analysis = {
                "fluency_score": "6.0",
                "pause_analysis": {"frequency": "medium", "impact": "Some pauses affect flow"},
                "speech_rate": "moderate",
                "hesitation_count": 0,
                "coherence": "fair",
                "strengths": ["Maintains conversation"],
                "weaknesses": ["Some hesitation"],
                "band_estimate": "6.0"
            }
        
        decision = self.decide({"analysis": analysis})
        action = self.act(decision)
        
        return analysis


class GrammarAgent(BaseAgent):
    """
    Analyzes grammatical range and accuracy
    - Tense usage
    - Sentence structures
    - Common errors
    - Complexity
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.GRAMMAR, llm_service)
    
    def analyze(self, transcript: str) -> Dict[str, Any]:
        """Analyze grammar"""
        observation = self.observe({"transcript": transcript})
        
        prompt = f"""You are a grammar expert for IELTS speaking.

Transcript: "{transcript}"

Analyze:
1. Grammatical errors (list each)
2. Tense usage (correct/incorrect)
3. Sentence complexity (simple/compound/complex)
4. Range of structures
5. Error frequency

Return JSON:
{{
    "errors": [
        {{"error": "text", "correction": "fix", "explanation": "why"}}
    ],
    "tense_accuracy": "poor|fair|good|excellent",
    "complexity": "simple|moderate|complex",
    "error_frequency": "high|medium|low",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"],
    "band_estimate": "5.0-9.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.2
        )
        
        try:
            analysis = json.loads(response)
        except:
            analysis = {
                "errors": [],
                "tense_accuracy": "good",
                "complexity": "moderate",
                "error_frequency": "low",
                "strengths": ["Correct basic structures"],
                "weaknesses": ["Limited complex sentences"],
                "band_estimate": "6.0"
            }
        
        return analysis


class VocabularyAgent(BaseAgent):
    """
    Analyzes lexical resource
    - Word choice
    - Collocations
    - Repetition
    - Range and precision
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.VOCABULARY, llm_service)
    
    def analyze(self, transcript: str) -> Dict[str, Any]:
        """Analyze vocabulary"""
        observation = self.observe({"transcript": transcript})
        
        prompt = f"""You are a vocabulary expert for IELTS speaking.

Transcript: "{transcript}"

Analyze:
1. Lexical range (basic/intermediate/advanced)
2. Repetition of words/phrases
3. Collocations (natural word combinations)
4. Topic-specific vocabulary
5. Paraphrasing ability

Return JSON:
{{
    "lexical_range": "limited|adequate|wide|very_wide",
    "repetitions": [
        {{"word": "word", "count": 5, "alternatives": ["alt1", "alt2"]}}
    ],
    "collocations": {{"correct": ["example"], "incorrect": ["example"]}},
    "topic_vocabulary": "weak|adequate|strong",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"],
    "band_estimate": "5.0-9.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.3
        )
        
        try:
            analysis = json.loads(response)
        except:
            analysis = {
                "lexical_range": "adequate",
                "repetitions": [],
                "collocations": {"correct": [], "incorrect": []},
                "topic_vocabulary": "adequate",
                "strengths": ["Uses appropriate vocabulary"],
                "weaknesses": ["Some repetition"],
                "band_estimate": "6.0"
            }
        
        return analysis


class PronunciationAgent(BaseAgent):
    """
    Analyzes pronunciation
    - Clarity
    - Stress patterns
    - Intonation
    - Individual sounds
    """
    
    def __init__(self, llm_service):
        super().__init__(AgentRole.PRONUNCIATION, llm_service)
    
    def analyze(self, transcript: str, audio_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze pronunciation"""
        context = {
            "transcript": transcript,
            "audio_metadata": audio_metadata
        }
        
        observation = self.observe(context)
        
        prompt = f"""You are a pronunciation expert for IELTS speaking.

Transcript: "{transcript}"
Audio Metadata: {json.dumps(audio_metadata, indent=2)}

Analyze:
1. Overall clarity
2. Word stress patterns
3. Sentence intonation
4. Problematic sounds
5. Intelligibility

Return JSON:
{{
    "clarity": "poor|fair|good|excellent",
    "stress_accuracy": "weak|moderate|strong",
    "intonation": "flat|varied|natural",
    "problem_sounds": ["sound 1", "sound 2"],
    "intelligibility": "difficult|mostly_clear|clear|very_clear",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"],
    "band_estimate": "5.0-9.0"
}}"""
        
        response = self.llm_service.generate_response(
            [{"role": "system", "content": prompt}],
            temperature=0.3
        )
        
        try:
            analysis = json.loads(response)
        except:
            analysis = {
                "clarity": "good",
                "stress_accuracy": "moderate",
                "intonation": "varied",
                "problem_sounds": [],
                "intelligibility": "mostly_clear",
                "strengths": ["Generally clear"],
                "weaknesses": ["Some pronunciation issues"],
                "band_estimate": "6.0"
            }
        
        return analysis
