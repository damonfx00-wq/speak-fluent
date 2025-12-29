from openai import OpenAI
from app.core.config import settings
from typing import List, Dict, Generator
import json

class NvidiaLLMService:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.nvidia_api_key
        )
        self.model = "openai/gpt-oss-120b"
    
    def generate_stream(self, messages: List[Dict[str, str]], temperature: float = 1.0, max_tokens: int = 4096) -> Generator:
        """
        Generate streaming response from NVIDIA API
        """
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            top_p=1,
            max_tokens=max_tokens,
            stream=True
        )
        
        for chunk in completion:
            reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
            if reasoning:
                yield reasoning
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
    
    def generate_response(self, messages: List[Dict[str, str]], temperature: float = 1.0, max_tokens: int = 4096) -> str:
        """
        Generate complete response from NVIDIA API
        """
        try:
            response = ""
            for chunk in self.generate_stream(messages, temperature, max_tokens):
                response += chunk
            return response
        except Exception as e:
            print(f"⚠️ NVIDIA API Error: {e}")
            print("   Falling back to mock data...")
            
            # Simple mock fallback based on content
            last_msg = messages[-1]["content"].lower()
            if "roadmap" in last_msg:
                return json.dumps({
                    "roadmap_id": "mock_roadmap",
                    "total_weeks": 8,
                    "weekly_plan": [{"week": 1, "focus": "Mock Focus", "daily_activities": [], "milestone": "Start", "expected_improvement": "0.5"}],
                    "mock_tests": [],
                    "estimated_final_band": 7.5
                })
            elif "practice content" in last_msg:
                return json.dumps({
                    "part": 1,
                    "date": "2025-12-29",
                    "content": {
                        "questions": ["What is your favorite color?", "Do you like to travel?", "Tell me about your hometown."],
                        "tips": ["Speak clearly", "Expand your answers"],
                        "vocabulary": ["vibrant", "journey", "hometown"],
                        "expected_duration": "10"
                    }
                })
            elif "topics" in last_msg:
                return json.dumps({
                    "date": "2025-12-29",
                    "topics": [
                        {"part": 1, "topic": "Hometown", "difficulty": "easy"},
                        {"part": 2, "topic": "A book you read", "difficulty": "medium"},
                        {"part": 3, "topic": "Reading habits", "difficulty": "hard"}
                    ]
                })
            elif "vocabulary" in last_msg:
                return json.dumps({
                    "date": "2025-12-29",
                    "theme": "Travel",
                    "words": [
                        {"word": "Itinerary", "definition": "A planned route or journey", "example": "We planned a detailed itinerary.", "pronunciation": "/aɪˈtɪnəˌrɛri/"},
                        {"word": "Excursion", "definition": "A short journey or trip", "example": "We went on an excursion to the mountains.", "pronunciation": "/ɪkˈskɜːrʒən/"}
                    ]
                })
            else:
                return "I apologize, but I cannot generate a response at the moment due to API limitations. Please check your API key."
    
    def practice_conversation(self, user_message: str, language: str = "English", level: str = "intermediate") -> str:
        """
        Practice conversation in a target language
        """
        system_prompt = f"""You are a friendly language tutor helping students practice {language}. 
        The student's level is {level}. Respond naturally to their message, and gently correct any mistakes 
        they make. Keep your responses conversational and encouraging."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        return self.generate_response(messages, temperature=0.8)
    
    def grammar_correction(self, text: str, language: str = "English") -> Dict[str, any]:
        """
        Correct grammar and provide explanations
        """
        system_prompt = f"""You are a {language} grammar expert. Analyze the following text and:
        1. Identify any grammar mistakes
        2. Provide corrections
        3. Explain why each correction is needed
        
        Return your response in JSON format with the following structure:
        {{
            "original": "original text",
            "corrected": "corrected text",
            "mistakes": [
                {{"error": "mistake", "correction": "fix", "explanation": "why"}}
            ]
        }}"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
        
        response = self.generate_response(messages, temperature=0.3)
        try:
            return json.loads(response)
        except:
            return {"original": text, "corrected": response, "mistakes": []}
    
    def vocabulary_builder(self, topic: str, language: str = "English", count: int = 10) -> List[Dict[str, str]]:
        """
        Generate vocabulary words for a specific topic
        """
        system_prompt = f"""Generate {count} useful {language} vocabulary words related to '{topic}'.
        For each word, provide:
        1. The word
        2. Definition
        3. Example sentence
        4. Pronunciation guide (if applicable)
        
        Return as JSON array with structure:
        [
            {{"word": "word", "definition": "def", "example": "sentence", "pronunciation": "guide"}}
        ]"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate vocabulary for: {topic}"}
        ]
        
        response = self.generate_response(messages, temperature=0.7)
        try:
            return json.loads(response)
        except:
            return []
    
    def generate_quiz(self, topic: str, language: str = "English", difficulty: str = "intermediate") -> Dict:
        """
        Generate a language quiz
        """
        system_prompt = f"""Create a {difficulty} level {language} quiz about '{topic}' with 5 questions.
        Include multiple choice, fill-in-the-blank, and translation questions.
        
        Return as JSON:
        {{
            "title": "Quiz title",
            "questions": [
                {{
                    "type": "multiple_choice|fill_blank|translation",
                    "question": "question text",
                    "options": ["opt1", "opt2", "opt3", "opt4"],
                    "correct_answer": "answer",
                    "explanation": "why this is correct"
                }}
            ]
        }}"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Create quiz for: {topic}"}
        ]
        
        response = self.generate_response(messages, temperature=0.6)
        try:
            return json.loads(response)
        except:
            return {"title": topic, "questions": []}
    
    def translate_with_context(self, text: str, source_lang: str, target_lang: str) -> Dict:
        """
        Translate text with contextual explanations
        """
        system_prompt = f"""Translate the following text from {source_lang} to {target_lang}.
        Provide:
        1. Direct translation
        2. Literal translation (word-by-word if helpful)
        3. Cultural context or notes if relevant
        
        Return as JSON:
        {{
            "original": "original text",
            "translation": "translated text",
            "literal": "literal translation",
            "notes": "cultural context or grammar notes"
        }}"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
        
        response = self.generate_response(messages, temperature=0.5)
        try:
            return json.loads(response)
        except:
            return {"original": text, "translation": response, "literal": "", "notes": ""}

# Singleton instance
nvidia_llm_service = NvidiaLLMService()

