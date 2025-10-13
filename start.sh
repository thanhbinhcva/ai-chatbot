#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Automated Market - Quick Start${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your actual API keys and configuration${NC}"
    echo -e "${YELLOW}⚠️  Press Enter after updating .env file to continue...${NC}"
    read
fi

echo -e "${GREEN}✓ .env file found${NC}"
echo ""

# Build and start containers
echo -e "${GREEN}Building Docker images...${NC}"
docker-compose build

echo ""
echo -e "${GREEN}Starting services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Services are starting...${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Wait a bit for services to start
sleep 3

# Check service status
echo -e "${GREEN}Checking service status...${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Services are ready!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "AI Chatbot API: ${YELLOW}http://localhost:8000${NC}"
echo -e "  - Health check: http://localhost:8000/health"
echo -e "  - API docs: http://localhost:8000/docs"
echo ""
echo -e "API Find Image: ${YELLOW}http://localhost:3000${NC}"
echo -e "  - Health check: http://localhost:3000/health"
echo ""
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop: ${YELLOW}docker-compose down${NC}"
echo -e "For more commands: ${YELLOW}make help${NC}"
echo ""
