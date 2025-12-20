# ============================================================================
# DOCKERFILE FOR VOICE AGENT SIMULATOR
# ============================================================================
# Multi-stage build optimized for Azure Container Apps deployment
#
# LEARNING NOTES:
# - Based on Python 3.11 slim (smaller image size than full Python)
# - Installs only necessary system dependencies
# - Uses --no-cache-dir to reduce image size
# - Sets PYTHONUNBUFFERED for real-time log output in Azure
# - Exposes port 5000 (Flask default)
# ============================================================================

FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# ============================================================================
# INSTALL SYSTEM DEPENDENCIES
# ============================================================================
# gcc: Required for compiling Python packages with C extensions
# Clean up apt cache to reduce image size
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ============================================================================
# INSTALL PYTHON DEPENDENCIES
# ============================================================================
# Copy requirements first (Docker layer caching optimization)
# If requirements.txt hasn't changed, this layer is cached
COPY requirements.txt .

# Install Python packages
# --no-cache-dir: Don't cache pip downloads (saves space)
# --pre: Required for preview packages like agent-framework-azure-ai
RUN pip install --no-cache-dir -r requirements.txt --pre

# ============================================================================
# COPY APPLICATION CODE
# ============================================================================
# Copy all application files into the container
# IMPORTANT: Use .dockerignore to exclude unnecessary files:
#   - .env (secrets should never be in image!)
#   - __pycache__/
#   - *.pyc
#   - .git/
#   - node_modules/ (if any)
COPY . .

# ============================================================================
# EXPOSE PORT
# ============================================================================
# Document which port the app listens on
# Azure Container Apps will map this to a public port
EXPOSE 5000

# ============================================================================
# SET ENVIRONMENT VARIABLES
# ============================================================================
# PYTHONUNBUFFERED: Force Python output to appear in real-time in logs
# This is CRITICAL for seeing logs in Azure Container Apps
ENV PYTHONUNBUFFERED=1

# FLASK_APP: Tell Flask which file contains the app
ENV FLASK_APP=app.py

# ============================================================================
# RUN THE APPLICATION
# ============================================================================
# Start the Flask app with SocketIO
# In production, Azure Container Apps sets environment variables:
#   - AZURE_AI_FOUNDRY_ENDPOINT
#   - AZURE_AI_FOUNDRY_API_KEY (as secret)
#   - AZURE_AI_MODEL_NAME
#   - APPLICATIONINSIGHTS_CONNECTION_STRING
#   - AZURE_STORAGE_ACCOUNT_NAME
#
# The app automatically uses managed identity for Azure services
CMD ["python", "app.py"]

# ============================================================================
# BUILD & RUN COMMANDS
# ============================================================================
#
# Build image:
#   docker build -t voice-agent-simulator .
#
# Run locally:
#   docker run -p 5000:5000 --env-file .env voice-agent-simulator
#
# Push to Azure Container Registry (done by azd automatically):
#   az acr login --name <your-registry>
#   docker tag voice-agent-simulator <your-registry>.azurecr.io/voice-agent-simulator
#   docker push <your-registry>.azurecr.io/voice-agent-simulator
#
# ============================================================================
