"""
Test suite for Speak-Fluent Backend
Run with: pytest tests/
"""
import pytest
from app.services.nvidia_service import NvidiaLLMService
from app.core.config import settings
from app.models.models import User, Conversation, Message
from app.schemas.schemas import UserCreate, ConversationCreate

def test_nvidia_service_initialization():
    """Test NVIDIA LLM service initialization"""
    service = NvidiaLLMService()
    assert service.model == "openai/gpt-oss-120b"
    assert service.client is not None

def test_config_loading():
    """Test configuration loading"""
    assert settings is not None
    assert hasattr(settings, 'nvidia_api_key')
    assert hasattr(settings, 'database_url')

def test_models_import():
    """Test that all models can be imported"""
    assert User is not None
    assert Conversation is not None
    assert Message is not None

def test_schemas_validation():
    """Test Pydantic schema validation"""
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        full_name="Test User"
    )
    assert user_data.email == "test@example.com"
    assert user_data.username == "testuser"
    
    conv_data = ConversationCreate(
        language="Spanish",
        level="intermediate"
    )
    assert conv_data.language == "Spanish"
    assert conv_data.level == "intermediate"

# Integration tests would require database and API keys
# Add those separately for full testing
