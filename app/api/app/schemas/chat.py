from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatInput(BaseModel):
    user_message: str
    session_id: Optional[str] = None
    health_data_snapshot: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    ai_response: str
    session_id: str 