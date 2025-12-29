"""
Example API client for Speak-Fluent Frontend
This can be used as a reference for integrating with the React frontend
"""

import requests
from typing import List, Dict, Optional

class SpeakFluentAPI:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api/v1"
    
    # Conversation Methods
    def create_conversation(self, user_id: int, language: str, level: str = "intermediate") -> Dict:
        """Create a new conversation session"""
        response = requests.post(
            f"{self.api_base}/conversations/",
            params={"user_id": user_id},
            json={"language": language, "level": level}
        )
        return response.json()
    
    def send_message(self, conversation_id: int, content: str) -> Dict:
        """Send a message in a conversation"""
        response = requests.post(
            f"{self.api_base}/conversations/{conversation_id}/messages",
            json={"content": content}
        )
        return response.json()
    
    def get_conversation(self, conversation_id: int) -> Dict:
        """Get conversation details with all messages"""
        response = requests.get(f"{self.api_base}/conversations/{conversation_id}")
        return response.json()
    
    def get_user_conversations(self, user_id: int) -> List[Dict]:
        """Get all conversations for a user"""
        response = requests.get(f"{self.api_base}/users/{user_id}/conversations")
        return response.json()
    
    # Grammar Methods
    def correct_grammar(self, text: str, language: str = "English", user_id: Optional[int] = None) -> Dict:
        """Correct grammar and get explanations"""
        params = {"user_id": user_id} if user_id else {}
        response = requests.post(
            f"{self.api_base}/grammar/correct",
            params=params,
            json={"text": text, "language": language}
        )
        return response.json()
    
    # Vocabulary Methods
    def generate_vocabulary(self, topic: str, language: str = "English", count: int = 10) -> List[Dict]:
        """Generate vocabulary words for a topic"""
        response = requests.post(
            f"{self.api_base}/vocabulary/generate",
            json={"topic": topic, "language": language, "count": count}
        )
        return response.json()
    
    def save_vocabulary(self, user_id: int, word_data: Dict) -> Dict:
        """Save a vocabulary item to user's collection"""
        response = requests.post(
            f"{self.api_base}/vocabulary/save",
            params={"user_id": user_id},
            json=word_data
        )
        return response.json()
    
    def get_user_vocabulary(self, user_id: int, language: Optional[str] = None) -> List[Dict]:
        """Get user's vocabulary collection"""
        params = {"language": language} if language else {}
        response = requests.get(
            f"{self.api_base}/users/{user_id}/vocabulary",
            params=params
        )
        return response.json()
    
    # Quiz Methods
    def generate_quiz(self, topic: str, language: str = "English", difficulty: str = "intermediate") -> Dict:
        """Generate a language quiz"""
        response = requests.post(
            f"{self.api_base}/quiz/generate",
            json={"topic": topic, "language": language, "difficulty": difficulty}
        )
        return response.json()
    
    def submit_quiz(self, user_id: int, quiz_id: int, answers: Dict[int, str]) -> Dict:
        """Submit quiz answers and get score"""
        response = requests.post(
            f"{self.api_base}/quiz/submit",
            params={"user_id": user_id},
            json={"quiz_id": quiz_id, "answers": answers}
        )
        return response.json()
    
    # Translation Methods
    def translate(self, text: str, source_lang: str, target_lang: str) -> Dict:
        """Translate text with context"""
        response = requests.post(
            f"{self.api_base}/translate",
            json={"text": text, "source_lang": source_lang, "target_lang": target_lang}
        )
        return response.json()
    
    # Progress Methods
    def get_user_progress(self, user_id: int) -> List[Dict]:
        """Get user's learning progress"""
        response = requests.get(f"{self.api_base}/users/{user_id}/progress")
        return response.json()
    
    # Streaming Methods
    def stream_chat(self, messages: List[Dict[str, str]], temperature: float = 1.0):
        """Stream chat responses (generator)"""
        response = requests.post(
            f"{self.api_base}/chat/stream",
            json={"messages": messages, "temperature": temperature},
            stream=True
        )
        
        for line in response.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                if decoded.startswith('data: '):
                    yield decoded[6:]  # Remove 'data: ' prefix


# Example Usage
if __name__ == "__main__":
    api = SpeakFluentAPI()
    
    # Example 1: Practice Conversation
    print("=== Conversation Practice ===")
    conv = api.create_conversation(user_id=1, language="Spanish", level="beginner")
    print(f"Created conversation: {conv['id']}")
    
    response = api.send_message(conv['id'], "Hola, ¿cómo estás?")
    print(f"AI Response: {response['ai_response']}")
    
    # Example 2: Grammar Correction
    print("\n=== Grammar Correction ===")
    correction = api.correct_grammar("I goed to the store yesterday")
    print(f"Original: {correction['original']}")
    print(f"Corrected: {correction['corrected']}")
    for mistake in correction.get('mistakes', []):
        print(f"  - {mistake['error']} → {mistake['correction']}: {mistake['explanation']}")
    
    # Example 3: Vocabulary Generation
    print("\n=== Vocabulary Builder ===")
    vocab = api.generate_vocabulary("Travel", "French", 5)
    for word in vocab:
        print(f"  {word['word']}: {word['definition']}")
        print(f"    Example: {word['example']}")
    
    # Example 4: Translation
    print("\n=== Translation ===")
    translation = api.translate("Hello, how are you?", "English", "Spanish")
    print(f"Translation: {translation['translation']}")
    print(f"Notes: {translation['notes']}")
