from typing import Optional, Dict, Any
from app.state import model
from fastapi import HTTPException

# Store chat history for each session
chat_histories: Dict[str, list] = {}

async def process_chat_message(
    session_id: str,
    user_message: str,
    health_data_snapshot: Optional[Dict[str, Any]] = None
) -> str:
    """
    Process a chat message using the Gemini model.
    Maintains chat history per session and includes health data context when available.
    """
    if not model:
        raise HTTPException(status_code=503, detail="AI service is not initialized")

    # Initialize chat history for new sessions
    if session_id not in chat_histories:
        chat_histories[session_id] = []
        
    try:
        # Prepare context with health data if available
        context = ""
        if health_data_snapshot:
            context = "Current health metrics:\n"
            for metric, value in health_data_snapshot.items():
                context += f"- {metric}: {value}\n"
            context += "\nUser message: "
        
        # Combine context and user message
        full_message = f"{context}{user_message}" if context else user_message
        
        # Get chat history for this session
        history = chat_histories[session_id]
        
        # Generate response
        chat = model.start_chat(history=history)
        response = chat.send_message(full_message)
        
        # Update chat history
        history.extend([
            {"role": "user", "parts": [full_message]},
            {"role": "model", "parts": [response.text]}
        ])
        chat_histories[session_id] = history
        
        return response.text
        
    except Exception as e:
        print(f"Error in chat processing: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message"
        ) 