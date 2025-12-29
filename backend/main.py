from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine
from app.models import models
from app.api.routes import router
from app.api.ielts_routes import router as ielts_router
from app.api.dynamic_routes import router as dynamic_router

# Create database tables (optional - will continue if DB not available)
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️  Database not available: {e}")
    print("   Continuing without database (some features may not work)")

app = FastAPI(
    title="Speak-Fluent Backend",
    description="AI-powered language learning platform using NVIDIA API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1", tags=["language-learning"])
app.include_router(ielts_router, prefix="/api/v1", tags=["ielts-agentic-ai"])
app.include_router(dynamic_router, prefix="/api/v1", tags=["dynamic-content"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Speak-Fluent Backend",
        "version": "1.0.0",
        "docs": "/docs",
        "features": [
            "Conversation Practice",
            "Grammar Correction",
            "Vocabulary Builder",
            "Quiz Generation",
            "Translation with Context",
            "Progress Tracking"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "speak-fluent-backend"}
