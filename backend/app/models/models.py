from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user")
    progress = relationship("UserProgress", back_populates="user")
    vocabulary_items = relationship("VocabularyItem", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    language = Column(String)
    level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

class VocabularyItem(Base):
    __tablename__ = "vocabulary_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    word = Column(String)
    definition = Column(Text)
    example = Column(Text)
    pronunciation = Column(String, nullable=True)
    language = Column(String)
    topic = Column(String, nullable=True)
    mastery_level = Column(Integer, default=0)  # 0-5 scale
    created_at = Column(DateTime, default=datetime.utcnow)
    last_reviewed = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="vocabulary_items")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    language = Column(String)
    level = Column(String)
    total_conversations = Column(Integer, default=0)
    total_vocabulary = Column(Integer, default=0)
    total_quizzes = Column(Integer, default=0)
    quiz_score_avg = Column(Float, default=0.0)
    streak_days = Column(Integer, default=0)
    last_activity = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="progress")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    topic = Column(String)
    language = Column(String)
    difficulty = Column(String)
    questions = Column(JSON)  # Store quiz questions as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    attempts = relationship("QuizAttempt", back_populates="quiz")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Float)
    answers = Column(JSON)  # Store user answers as JSON
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

class GrammarCorrection(Base):
    __tablename__ = "grammar_corrections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_text = Column(Text)
    corrected_text = Column(Text)
    mistakes = Column(JSON)  # Store mistakes as JSON
    language = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

