#!/bin/bash
# GenAI Chatbot run script
# Usage: ./run.sh [backend|frontend|all]

set -e

COMPONENT=$1

if [ -z "$COMPONENT" ]; then
  echo "Usage: $0 [backend|frontend|mongo|all]"
  exit 1
fi

case "$COMPONENT" in
  mongo)
    echo "Stopping and removing any existing genai-mongo container..."
    docker stop genai-mongo 2>/dev/null || true
    docker rm genai-mongo 2>/dev/null || true
    echo "Starting MongoDB in Docker..."
    ./docker/run-mongo.sh
    ;;
  backend)
    echo "Starting backend service..."
    cd backend
    source venv/bin/activate
    python -m uvicorn main:app --host 0.0.0.0 --port 8000
    ;;
  frontend)
    echo "Starting frontend service..."
    cd frontend
    npm run dev
    ;;
  all)
    echo "Starting Ollama server..."
    nohup ollama serve > ./ollama.log 2>&1 &
    sleep 2
    echo "Pulling Llama2 model..."
    ollama pull llama2
    echo "Starting MongoDB in Docker..."
    ./docker/run-mongo.sh
    echo "Starting backend service..."
    cd backend
    source venv/bin/activate
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ../frontend
    echo "Starting frontend service..."
    npm run dev
    ;;
# End case statement
esac
