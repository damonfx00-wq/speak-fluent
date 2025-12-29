# Speak-Fluent Backend

AI-powered language learning platform built with **FastAPI**, **NVIDIA API**, and **PostgreSQL**.

## Features

- 🗣️ **Conversation Practice**: Interactive AI conversations in multiple languages
- ✍️ **Grammar Correction**: Real-time grammar checking with explanations
- 📚 **Vocabulary Builder**: Topic-based vocabulary generation
- 🎯 **Quiz Generation**: AI-generated quizzes with multiple question types
- 🌐 **Translation**: Context-aware translation with cultural notes
- 📊 **Progress Tracking**: Track learning progress and streaks

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **NVIDIA API**: Powered by `openai/gpt-oss-120b` model
- **PostgreSQL**: Robust database for data persistence
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and settings management

## Setup

### 1. Create a virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up PostgreSQL

Make sure PostgreSQL is installed and running. Create a database:

```sql
CREATE DATABASE speakfluent_db;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE speakfluent_db TO your_user;
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
DATABASE_URL=postgresql://your_user:your_password@localhost/speakfluent_db
OPENAI_API_KEY=your_openai_api_key_here  # Optional, for future use
```

### 5. Run the server

```bash
# From the parent directory (speak-fluent)
uvicorn backend.main:app --reload

# Or from the backend directory
cd backend
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Conversation Practice

- `POST /api/v1/conversations/` - Create a new conversation
- `POST /api/v1/conversations/{id}/messages` - Send a message
- `GET /api/v1/conversations/{id}` - Get conversation details
- `GET /api/v1/users/{user_id}/conversations` - Get all user conversations

### Grammar Correction

- `POST /api/v1/grammar/correct` - Correct grammar with explanations

### Vocabulary

- `POST /api/v1/vocabulary/generate` - Generate vocabulary for a topic
- `POST /api/v1/vocabulary/save` - Save vocabulary to user collection
- `GET /api/v1/users/{user_id}/vocabulary` - Get user's vocabulary

### Quizzes

- `POST /api/v1/quiz/generate` - Generate a quiz
- `POST /api/v1/quiz/submit` - Submit quiz answers

### Translation

- `POST /api/v1/translate` - Translate with context

### Streaming

- `POST /api/v1/chat/stream` - Stream chat responses (SSE)

### Progress

- `GET /api/v1/users/{user_id}/progress` - Get learning progress

## Example Usage

### Practice Conversation

```python
import requests

# Create conversation
response = requests.post(
    "http://localhost:8000/api/v1/conversations/",
    params={"user_id": 1},
    json={"language": "Spanish", "level": "intermediate"}
)
conversation_id = response.json()["id"]

# Send message
response = requests.post(
    f"http://localhost:8000/api/v1/conversations/{conversation_id}/messages",
    json={"content": "Hola, ¿cómo estás?"}
)
print(response.json()["ai_response"])
```

### Grammar Correction

```python
response = requests.post(
    "http://localhost:8000/api/v1/grammar/correct",
    params={"user_id": 1},
    json={
        "text": "I goed to the store yesterday",
        "language": "English"
    }
)
print(response.json())
```

### Generate Vocabulary

```python
response = requests.post(
    "http://localhost:8000/api/v1/vocabulary/generate",
    json={
        "topic": "Travel",
        "language": "French",
        "count": 10
    }
)
print(response.json())
```

## Database Schema

The backend uses the following main tables:

- `users` - User accounts
- `conversations` - Conversation sessions
- `messages` - Chat messages
- `vocabulary_items` - User's saved vocabulary
- `quizzes` - Generated quizzes
- `quiz_attempts` - Quiz submissions
- `user_progress` - Learning progress tracking
- `grammar_corrections` - Grammar correction history

## Development

### Database Migrations

For production, use Alembic for database migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and env.py
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Testing

```bash
pip install pytest pytest-asyncio httpx
pytest
```

## Production Deployment

1. Set `allow_origins` in CORS to specific domains
2. Use environment variables for all sensitive data
3. Set up proper database backups
4. Use a production ASGI server like Gunicorn with Uvicorn workers
5. Set up SSL/TLS certificates
6. Implement rate limiting and authentication

```bash
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## License

MIT

