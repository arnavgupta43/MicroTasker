# Task Management App — Backend

A small Node.js microservice example demonstrating patterns and best practices for building distributed services. The backend contains three services that communicate via RabbitMQ and can be run locally or in Docker.

Summary
- Services: task-service, user-service, notification-service
- Messaging: RabbitMQ for async events (producer/consumer)
- Goals: illustrate microservice boundaries, messaging patterns, retries/idempotency, and simple infra with Docker

What’s included
- task-service — create, update, list, delete tasks
- user-service — user management and auth middleware
- notification-service — consumes events and sends notifications
- shared patterns: RabbitMQ config, producers/consumers, service-specific Dockerfiles

Prerequisites
- Node.js 18+ and npm
- Docker & docker-compose (recommended)
- (Optional) Local RabbitMQ if not using Docker
Project structure
- /task-service
- /user-service
- /notification-service
- /shared (shared types, utils, message schemas) — create if required
Each service contains its own package.json, Dockerfile, src/, and config for DB/RabbitMQ.