#!/bin/bash
# Run MongoDB in Docker

docker run --name genai-mongo -d -p 27017:27017 mongo:latest
