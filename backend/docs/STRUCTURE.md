# Speak-Fluent Backend - Professional Directory Structure

## 📁 Directory Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── requirements.txt                 # Python dependencies
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── start.sh                        # Quick start script
│
├── app/                            # Main application package
│   ├── __init__.py
│   │
│   ├── core/                       # Core configuration
│   │   ├── __init__.py
│   │   └── config.py              # Settings and environment config
│   │
│   ├── db/                        # Database layer
│   │   ├── __init__.py
│   │   └── database.py            # PostgreSQL connection setup
│   │
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── models.py              # All database models
│   │
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   └── schemas.py             # Request/response schemas
│   │
│   ├── api/                       # API routes
│   │   ├── __init__.py
│   │   └── routes.py              # All API endpoints
│   │
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   └── nvidia_service.py      # NVIDIA API integration
│   │
│   └── utils/                     # Utility functions
│       └── __init__.py
│
├── tests/                         # Test suite
│   ├── __init__.py
│   └── test_api.py               # API tests
│
├── docs/                          # Documentation
│   ├── README.md                  # Main documentation
│   ├── STRUCTURE.md              # This file
│   └── examples/                 # Code examples
│       └── api_client_example.py # Python API client
│
└── scripts/                       # Utility scripts
    └── (future scripts)

```

## 🎯 Module Responsibilities

### `main.py`
- FastAPI app initialization
- Middleware configuration (CORS)
- Router registration
- Root endpoints

### `app/core/`
- **config.py**: Environment variables, settings management

### `app/db/`
- **database.py**: SQLAlchemy engine, session management, Base class

### `app/models/`
- **models.py**: All SQLAlchemy ORM models
  - User, Conversation, Message
  - VocabularyItem, Quiz, QuizAttempt
  - UserProgress, GrammarCorrection

### `app/schemas/`
- **schemas.py**: Pydantic models for validation
  - Request schemas
  - Response schemas
  - Data transfer objects (DTOs)

### `app/api/`
- **routes.py**: All API endpoints
  - Conversation endpoints
  - Grammar correction
  - Vocabulary management
  - Quiz system
  - Translation
  - Progress tracking

### `app/services/`
- **nvidia_service.py**: NVIDIA API integration
  - Streaming responses
  - Conversation practice
  - Grammar correction
  - Vocabulary generation
  - Quiz generation
  - Translation

### `tests/`
- Unit tests
- Integration tests
- API tests

### `docs/`
- Documentation files
- API examples
- Usage guides

## 🚀 Import Structure

### From main.py
```python
from app.db.database import engine
from app.models import models
from app.api.routes import router
```

### From routes.py
```python
from app.models import models
from app.schemas import schemas
from app.db.database import get_db
from app.services.nvidia_service import nvidia_llm_service
```

### From models.py
```python
from app.db.database import Base
```

### From services
```python
from app.core.config import settings
```

## 🔧 Running the Application

### Development
```bash
# From project root
uvicorn main:app --reload

# Or using the start script
cd backend
./start.sh
```

### Production
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📊 Key Features

1. ✅ **Separation of Concerns**: Each module has a single responsibility
2. ✅ **Scalability**: Easy to add new features in appropriate directories
3. ✅ **Testability**: Clear structure for unit and integration tests
4. ✅ **Maintainability**: Logical organization makes code easy to find
5. ✅ **Professional**: Follows Python/FastAPI best practices

## 🎓 Benefits of This Structure

### Before (Flat Structure)
```
backend/
├── main.py
├── config.py
├── database.py
├── models.py
├── schemas.py
├── routes.py
└── langchain_utils.py
```

### After (Organized Structure)
- ✅ Clear module boundaries
- ✅ Easy to navigate
- ✅ Scalable for growth
- ✅ Professional organization
- ✅ Better IDE support
- ✅ Easier testing
- ✅ Team-friendly

## 📝 Adding New Features

### New API Endpoint
1. Add route in `app/api/routes.py`
2. Add schema in `app/schemas/schemas.py` (if needed)
3. Add model in `app/models/models.py` (if needed)
4. Add service logic in `app/services/` (if needed)

### New Service
1. Create new file in `app/services/`
2. Import in routes or other services
3. Add tests in `tests/`

### New Model
1. Add to `app/models/models.py`
2. Add corresponding schema in `app/schemas/schemas.py`
3. Create migration (if using Alembic)

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_api.py

# Run with coverage
pytest --cov=app tests/
```

## 📦 Deployment

This structure is ready for:
- Docker containerization
- CI/CD pipelines
- Cloud deployment (AWS, GCP, Azure)
- Kubernetes orchestration

## 🔐 Security Best Practices

1. ✅ Environment variables in `.env`
2. ✅ `.env` in `.gitignore`
3. ✅ Separate config module
4. ⚠️ Add authentication middleware
5. ⚠️ Add rate limiting
6. ⚠️ Add input validation

---

**Status**: ✅ Professional structure implemented
**Version**: 1.0.0
**Last Updated**: 2025-12-29
