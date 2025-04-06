from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.schemas.chat import ChatInput, ChatResponse
from app.services.chat_service import process_chat_message
from app.state import model

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_input: ChatInput):
    try:
        if not model:
            raise HTTPException(
                status_code=503,
                detail="AI service is not initialized. Check API key and logs."
            )

        ai_response = await process_chat_message(
            session_id=chat_input.session_id,
            user_message=chat_input.user_message,
            health_data_snapshot=chat_input.health_data_snapshot
        )

        return ChatResponse(
            ai_response=ai_response,
            session_id=chat_input.session_id
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Error processing chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while processing the chat message."
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 