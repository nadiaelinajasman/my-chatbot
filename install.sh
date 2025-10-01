#!/bin/bash
# GenAI Chatbot install script
# Add install steps for each component as you build them



set -e

# Node.js check/install function
ensure_nodejs() {
  if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js v22 (LTS)..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "Node.js found: $(node -v)"
  fi
}


# pip check/install function
ensure_pip() {
  if ! command -v pip &> /dev/null; then
    echo "pip not found. Installing python3-pip..."
    sudo apt-get update
    sudo apt-get install -y python3-pip
  else
    echo "pip found: $(pip --version)"
  fi
}




# Example usage:
# ./install.sh backend
# ./install.sh frontend
# ./install.sh all

# Ollama install function
ensure_ollama() {
  if ! command -v ollama &> /dev/null; then
    echo "Ollama not found. Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "Ollama installed."
  else
    echo "Ollama found: $(ollama --version)"
  fi
}

COMPONENT=$1

if [ -z "$COMPONENT" ]; then
  echo "Usage: $0 [backend|frontend|all]"
  exit 1
fi

case "$COMPONENT" in
  ollama)
    ensure_ollama
    ;;
  docker)
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "Docker installed."
    ;;
    sudo systemctl daemon-reload
    sudo systemctl restart docker
  backend)
    ensure_pip
    echo "Setting up Python virtual environment for backend..."
    if [ ! -d "backend/venv" ]; then
      python3 -m venv backend/venv
    fi
    source backend/venv/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    pip install requests
  # uvicorn is included in requirements.txt, no need to install separately
    deactivate
    ;;
  frontend)
    ensure_nodejs
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    ;;
  all)
    ensure_nodejs
    ensure_pip
    ensure_ollama
    echo "Setting up Python virtual environment for backend..."
    if [ ! -d "backend/venv" ]; then
      python3 -m venv backend/venv
    fi
    source backend/venv/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    pip install requests
  # uvicorn is included in requirements.txt, no need to install separately
    deactivate
    cd frontend
    npm install
    cd ..
    ;;
  *)
    echo "Unknown component: $COMPONENT"
    exit 1
    ;;
esac

# Install Ollama model
ollama pull llama3.2:1b

echo "Install complete."

setup_shadcn_ui() {
  npm install shadcn-ui @radix-ui/react-scroll-area @radix-ui/react-dialog @radix-ui/react-tooltip
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add input
  npx shadcn-ui@latest add scroll-area
}

# To run shadcn/ui setup, call:
# setup_shadcn_ui
