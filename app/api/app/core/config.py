from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    GOOGLE_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_NAME: str = "gemini-pro"
    # Add any other configuration settings here

settings = Settings() 