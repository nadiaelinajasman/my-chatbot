
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
import os
import json



# MongoDB setup
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["chatbot_db"]
sessions_collection = db["sessions"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    user: str
    text: str


class ChatRequest(BaseModel):
    session_id: str
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str



import requests

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat: ChatRequest):
    # Find or create session
    session = sessions_collection.find_one({"session_id": chat.session_id})
    if not session:
        session = {"session_id": chat.session_id, "conversation": []}
        sessions_collection.insert_one(session)
    # Add user messages
    for msg in chat.messages:
        sessions_collection.update_one(
            {"session_id": chat.session_id},
            {"$push": {"conversation": {"user": msg.user, "text": msg.text}}}
        )
    # Prepare prompt: only use the latest user message, no previous bot answers
    prompt = "System: You are a helpful assistant.\n"
    if chat.messages:
        latest_user_msg = chat.messages[-1].text
        prompt += f"User: {latest_user_msg}\nBot:"
    # Call Ollama API
    ollama_url = "http://localhost:11434/api/generate"
    payload = {
    "model": "llama3.2:1b",
    "prompt": prompt,
    "stream": True
    }
    try:
        response = requests.post(ollama_url, json=payload, timeout=60, stream=True)
        response.raise_for_status()
        bot_response = ""
        # Collect streamed chunks
        for line in response.iter_lines():
            if line:
                try:
                    chunk = line.decode("utf-8")
                    data = json.loads(chunk)
                    bot_response += data.get("response", "")
                except Exception:
                    continue
        if not bot_response:
            bot_response = "Sorry, I couldn't generate a reply."
    except Exception as e:
        bot_response = f"Error: {str(e)}"
    # Add bot response to conversation
    sessions_collection.update_one(
        {"session_id": chat.session_id},
        {"$push": {"conversation": {"user": "bot", "text": bot_response}}}
    )
    return ChatResponse(response=bot_response)



# Endpoint to get conversation by session_id
@app.get("/history/{session_id}")
async def get_history(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id}, {"_id": 0})
    if session and "conversation" in session:
        return {"conversation": session["conversation"]}
    else:
        return {"conversation": []}

# Endpoint to list all session ids
@app.get("/sessions")
async def list_sessions():
    sessions = sessions_collection.find({}, {"_id": 0, "session_id": 1})
    return {"session_ids": [s["session_id"] for s in sessions]}
