# MicroTasker — Event-Driven Task Management Backend

MicroTasker is a Node.js microservice playground that demonstrates how to split a task
management backend into independently deployable services that communicate through
RabbitMQ. The project showcases service boundaries, domain-driven data models, and
asynchronous messaging patterns that keep services loosely coupled while still
staying in sync.

## Features at a Glance

- **User Service** for registration and authentication with password hashing and JWT issuance.
- **Task Service** that manages task lifecycle events (create, assign, list) and publishes
  domain events to RabbitMQ.
- **Notification Service** that consumes task and user events to persist notification
  records for downstream delivery channels.
- **Central Event Bus** built on RabbitMQ topic exchanges to decouple producers and
  consumers while supporting fan-out patterns.
- **Shared Infrastructure Patterns** including MongoDB persistence, rate limiting,
  CORS, Docker-based local orchestration, and retry-aware RabbitMQ connections.

## Service Architecture

```
┌─────────────┐        task.* events        ┌──────────────────────┐
│ Task API    │ ─────────────────────────▶ │                      │
│ (Express)   │                            │                      │
└─────────────┘                            │                      │
                                           │ RabbitMQ Topic       │
┌─────────────┐        user.* events       │ Exchange             │
│ User API    │ ─────────────────────────▶ │ (events.exchange)    │
│ (Express)   │                            │                      │
└─────────────┘                            │                      │
                                           │                      │
                                           └──────────────┬───────┘
                                                          │
                                              consumes    ▼
                                              events   ┌───────────────┐
                                                       │ Notification  │
                                                       │ Service       │
                                                       │ (Express +    │
                                                       │  MongoDB)     │
                                                       └───────────────┘
```

Each service exposes its own REST API, maintains an isolated MongoDB collection, and
only couples to other services via RabbitMQ messages. This allows new consumers to
subscribe to events without changes to the producers.

## Tech Stack

- **Runtime:** Node.js 18+, Express 5
- **Data Stores:** MongoDB (one database instance shared per deployment)
- **Messaging:** RabbitMQ topic exchange (`events.exchange`)
- **Security:** JWT-based auth, bcrypt password hashing, rate limiting, CORS
- **Containerization:** Docker & Docker Compose for local orchestration
- **Tooling:** dotenv for configuration, http-status-codes for consistent responses

## Repository Layout

```
MicroTasker/
├── task-service/           # Task CRUD & assignment APIs
├── user-service/           # Registration & login APIs
├── notification-service/   # Event consumer & notification APIs
└── docker-compose.yml      # Local multi-service runtime
```

Each service contains its own `package.json`, `Dockerfile`, and `src/` directory with
Express app wiring, database connectors, message queue bindings, and domain logic.

## Local Development

### Prerequisites

- Node.js 18 or later and npm
- Docker & Docker Compose (recommended for an all-in-one setup)

### Environment Variables

Create a `.env` file inside each service directory before running locally. The example
below illustrates the required keys; adjust ports and secrets to fit your setup.

```bash
# user-service/.env
PORT=4001
MONGO_URI=mongodb://localhost:27017/microtasker
JWT_SECRET=supersecret
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# task-service/.env
PORT=4002
MONGO_URI=mongodb://localhost:27017/microtasker
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# notification-service/.env
PORT=4003
MONGO_URI=mongodb://localhost:27017/microtasker
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

> **Note:** MongoDB can use a shared database for demonstration, but production
> environments should isolate collections per service and apply network-level security.

### Run with Docker Compose

1. Install dependencies for each service if you plan to develop locally:
   ```bash
   npm install --prefix user-service
   npm install --prefix task-service
   npm install --prefix notification-service
   ```
2. Build and run the stack:
   ```bash
   docker compose up --build
   ```
3. The services will be available on the following ports:
   - `http://localhost:4001` — User service (`/auth/...` routes)
   - `http://localhost:4002` — Task service (`/task/...` routes)
   - `http://localhost:4003` — Notification service (`/api/notifications/...` routes)
   - RabbitMQ management UI: `http://localhost:15672` (guest/guest)

### Run Services Manually

1. Start MongoDB and RabbitMQ locally (Docker is the easiest approach).
2. For each service:
   ```bash
   cd <service-directory>
   npm install
   node src/server.js
   ```

## API Overview

### User Service (`/auth`)

- `POST /auth/register` — Register a user (`username`, `name`, `email`, `password`).
- `POST /auth/login` — Authenticate a user and receive a JWT.

### Task Service (`/task`)

- `POST /task/u/create` — Create a task (`title`, `description`, `assignedTo`).
- `POST /task/u/assign` — Reassign a task by ID.
- `GET /task/u/getAllTasks` — Retrieve all tasks.

### Notification Service (`/api/notifications`)

- `GET /api/notifications/` — List all notifications.
- `GET /api/notifications/:userId` — List notifications for a specific user.
- `DELETE /api/notifications/:id` — Delete a notification.

Every relevant user or task action triggers a RabbitMQ event that the notification
service consumes to create notification records.

## Development Notes

- RabbitMQ connections include retry logic to avoid boot-order race conditions when
  running under Docker Compose.
- Rate limiting (100 requests/15 minutes) is enabled per service to mitigate abuse
  during demos.
- The notification consumer acknowledges messages after processing to ensure
  at-least-once delivery semantics.

## Future Enhancements

- Add automated tests for service endpoints and consumer logic.
- Expand notification delivery to include email or WebSocket push channels.
- Introduce shared libraries (e.g., TypeScript DTOs) and CI/CD pipelines.

---