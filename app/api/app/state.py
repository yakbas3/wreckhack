import google.generativeai as genai
from app.core.config import settings

# Initialize the model
model = None

try:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    model = genai.GenerativeModel(settings.MODEL_NAME)
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None 