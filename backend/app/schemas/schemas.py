from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Conversation Schemas
class ConversationCreate(BaseModel):
    language: str
    level: str = "intermediate"

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    language: str
    level: str
    created_at: datetime
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True

# Grammar Correction Schemas
class GrammarCorrectionRequest(BaseModel):
    text: str
    language: str = "English"

class MistakeDetail(BaseModel):
    error: str
    correction: str
    explanation: str

class GrammarCorrectionResponse(BaseModel):
    original: str
    corrected: str
    mistakes: List[MistakeDetail]

# Vocabulary Schemas
class VocabularyRequest(BaseModel):
    topic: str
    language: str = "English"
    count: int = 10

class VocabularyWord(BaseModel):
    word: str
    definition: str
    example: str
    pronunciation: Optional[str] = None

class VocabularyItemCreate(BaseModel):
    word: str
    definition: str
    example: str
    pronunciation: Optional[str] = None
    language: str
    topic: Optional[str] = None

class VocabularyItemResponse(BaseModel):
    id: int
    word: str
    definition: str
    example: str
    pronunciation: Optional[str]
    language: str
    topic: Optional[str]
    mastery_level: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Schemas
class QuizRequest(BaseModel):
    topic: str
    language: str = "English"
    difficulty: str = "intermediate"

class QuizQuestion(BaseModel):
    type: str
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    title: str
    questions: List[QuizQuestion]

class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: Dict[int, str]

class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: float
    completed_at: datetime
    
    class Config:
        from_attributes = True

# Translation Schemas
class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    original: str
    translation: str
    literal: str
    notes: str

# Progress Schemas
class UserProgressResponse(BaseModel):
    id: int
    language: str
    level: str
    total_conversations: int
    total_vocabulary: int
    total_quizzes: int
    quiz_score_avg: float
    streak_days: int
    last_activity: datetime
    
    class Config:
        from_attributes = True

# Streaming Response
class StreamingChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    temperature: float = 1.0
    max_tokens: int = 4096
