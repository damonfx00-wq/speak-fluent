# Speak-Fluent Backend 🚀

AI-powered language learning platform built with **FastAPI**, **NVIDIA API**, and **PostgreSQL**.

## Quick Start

```bash
cd backend
./start.sh
```

Or manually:

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Run the server
uvicorn main:app --reload
```

## Environment Variables

Create a `.env` file:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
DATABASE_URL=postgresql://username:password%40special@localhost/speak
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: URL-encode special characters in passwords (e.g., `@` → `%40`)

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Features

- 🗣️ Conversation Practice
- ✍️ Grammar Correction
- 📚 Vocabulary Builder
- 🎯 Quiz Generation
- 🌐 Translation with Context
- 📊 Progress Tracking

## Documentation

- [Full Documentation](docs/README.md)
- [Directory Structure](docs/STRUCTURE.md)
- [API Examples](docs/examples/)

## Tech Stack

- FastAPI
- NVIDIA API (openai/gpt-oss-120b)
- PostgreSQL
- SQLAlchemy
- Pydantic

## Project Structure

```
backend/
├── main.py              # Entry point
├── app/                 # Application code
│   ├── api/            # API routes
│   ├── core/           # Configuration
│   ├── db/             # Database
│   ├── models/         # ORM models
│   ├── schemas/        # Pydantic schemas
│   └── services/       # Business logic
├── tests/              # Test suite
└── docs/               # Documentation
```

## License

MIT
