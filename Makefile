# Makefile for Automated Market Project

.PHONY: help build up down logs restart clean test

help: ## Hiển thị trợ giúp
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build tất cả Docker images
	docker-compose build

up: ## Khởi động tất cả services
	docker-compose up -d

up-logs: ## Khởi động và xem logs
	docker-compose up

down: ## Dừng tất cả services
	docker-compose down

logs: ## Xem logs của tất cả services
	docker-compose logs -f

logs-chatbot: ## Xem logs của AI Chatbot
	docker-compose logs -f ai-chatbot

logs-api: ## Xem logs của API Find Image
	docker-compose logs -f api-find-img

restart: ## Restart tất cả services
	docker-compose restart

restart-chatbot: ## Restart AI Chatbot
	docker-compose restart ai-chatbot

restart-api: ## Restart API Find Image
	docker-compose restart api-find-img

clean: ## Dừng và xóa tất cả containers, volumes
	docker-compose down -v
	docker system prune -f

rebuild: ## Clean và build lại
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) up

shell-chatbot: ## Mở shell trong AI Chatbot container
	docker-compose exec ai-chatbot bash

shell-api: ## Mở shell trong API Find Image container
	docker-compose exec api-find-img sh

ps: ## Hiển thị trạng thái containers
	docker-compose ps

install: ## Copy .env.example sang .env
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env file created. Please update with your actual values."; \
	else \
		echo ".env file already exists."; \
	fi
