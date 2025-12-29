from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models import models
from app.schemas import schemas
from app.db.database import get_db
from app.services.nvidia_service import nvidia_llm_service
from fastapi.responses import StreamingResponse
import json

router = APIRouter()

# Conversation Practice Endpoints
@router.post("/conversations/", response_model=schemas.ConversationResponse)
def create_conversation(
    conversation: schemas.ConversationCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Create a new conversation session"""
    db_conversation = models.Conversation(
        user_id=user_id,
        language=conversation.language,
        level=conversation.level
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.post("/conversations/{conversation_id}/messages")
def send_message(
    conversation_id: int,
    message: schemas.MessageCreate,
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    # Get conversation
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Save user message
    user_message = models.Message(
        conversation_id=conversation_id,
        role="user",
        content=message.content
    )
    db.add(user_message)
    db.commit()
    
    # Get AI response
    ai_response = nvidia_llm_service.practice_conversation(
        message.content,
        conversation.language,
        conversation.level
    )
    
    # Save AI message
    ai_message = models.Message(
        conversation_id=conversation_id,
        role="assistant",
        content=ai_response
    )
    db.add(ai_message)
    db.commit()
    
    return {
        "user_message": message.content,
        "ai_response": ai_response
    }

@router.get("/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Get conversation with all messages"""
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@router.get("/users/{user_id}/conversations", response_model=List[schemas.ConversationResponse])
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    """Get all conversations for a user"""
    conversations = db.query(models.Conversation).filter(
        models.Conversation.user_id == user_id
    ).all()
    return conversations

# Grammar Correction Endpoints
@router.post("/grammar/correct", response_model=schemas.GrammarCorrectionResponse)
def correct_grammar(
    request: schemas.GrammarCorrectionRequest,
    user_id: int = None,
    db: Session = Depends(get_db)
):
    """Correct grammar and provide explanations"""
    result = nvidia_llm_service.grammar_correction(request.text, request.language)
    
    # Save to database
    correction = models.GrammarCorrection(
        user_id=user_id,
        original_text=request.text,
        corrected_text=result.get("corrected", ""),
        mistakes=result.get("mistakes", []),
        language=request.language
    )
    db.add(correction)
    db.commit()
    
    return result

# Vocabulary Endpoints
@router.post("/vocabulary/generate", response_model=List[schemas.VocabularyWord])
def generate_vocabulary(request: schemas.VocabularyRequest):
    """Generate vocabulary words for a topic"""
    words = nvidia_llm_service.vocabulary_builder(
        request.topic,
        request.language,
        request.count
    )
    return words

@router.post("/vocabulary/save", response_model=schemas.VocabularyItemResponse)
def save_vocabulary(
    item: schemas.VocabularyItemCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Save a vocabulary item to user's collection"""
    db_item = models.VocabularyItem(
        user_id=user_id,
        **item.dict()
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/users/{user_id}/vocabulary", response_model=List[schemas.VocabularyItemResponse])
def get_user_vocabulary(
    user_id: int,
    language: str = None,
    db: Session = Depends(get_db)
):
    """Get user's vocabulary collection"""
    query = db.query(models.VocabularyItem).filter(
        models.VocabularyItem.user_id == user_id
    )
    
    if language:
        query = query.filter(models.VocabularyItem.language == language)
    
    return query.all()

# Quiz Endpoints
@router.post("/quiz/generate", response_model=schemas.QuizResponse)
def generate_quiz(request: schemas.QuizRequest, db: Session = Depends(get_db)):
    """Generate a language quiz"""
    quiz_data = nvidia_llm_service.generate_quiz(
        request.topic,
        request.language,
        request.difficulty
    )
    
    # Save quiz to database
    db_quiz = models.Quiz(
        title=quiz_data.get("title", request.topic),
        topic=request.topic,
        language=request.language,
        difficulty=request.difficulty,
        questions=quiz_data.get("questions", [])
    )
    db.add(db_quiz)
    db.commit()
    
    return quiz_data

@router.post("/quiz/submit", response_model=schemas.QuizAttemptResponse)
def submit_quiz(
    attempt: schemas.QuizAttemptCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Submit quiz answers and get score"""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == attempt.quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Calculate score
    correct = 0
    total = len(quiz.questions)
    
    for idx, question in enumerate(quiz.questions):
        user_answer = attempt.answers.get(str(idx))
        if user_answer == question.get("correct_answer"):
            correct += 1
    
    score = (correct / total) * 100 if total > 0 else 0
    
    # Save attempt
    db_attempt = models.QuizAttempt(
        user_id=user_id,
        quiz_id=attempt.quiz_id,
        score=score,
        answers=attempt.answers
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    return db_attempt

# Translation Endpoints
@router.post("/translate", response_model=schemas.TranslationResponse)
def translate_text(request: schemas.TranslationRequest):
    """Translate text with context"""
    result = nvidia_llm_service.translate_with_context(
        request.text,
        request.source_lang,
        request.target_lang
    )
    return result

# Streaming Chat Endpoint
@router.post("/chat/stream")
async def stream_chat(request: schemas.StreamingChatRequest):
    """Stream chat responses"""
    async def generate():
        for chunk in nvidia_llm_service.generate_stream(
            request.messages,
            request.temperature,
            request.max_tokens
        ):
            yield f"data: {json.dumps({'content': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

# User Progress Endpoints
@router.get("/users/{user_id}/progress", response_model=List[schemas.UserProgressResponse])
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Get user's learning progress"""
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).all()
    return progress
