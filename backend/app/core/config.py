import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    nvidia_api_key: str = os.getenv("NVIDIA_API_KEY", "")
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/speakfluent_db")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
