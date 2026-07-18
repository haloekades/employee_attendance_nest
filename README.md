# Attendance NestJS

Employee/attendance management API built with NestJS, split into microservices that communicate over RabbitMQ.

## Architecture

Four independently runnable apps live in this one repo, under `src/`:

| App | Role | Transport |
| --- | --- | --- |
| `gateway` | The only HTTP-facing app. Exposes the REST API and forwards each request to the right microservice over RabbitMQ. | HTTP (port `3000` by default) |
| `employees-service` | Owns employee data (Postgres) — CRUD, password hashing, lookup by email/ids. | RabbitMQ (`employees_queue`) |
| `attendances-service` | Owns attendance data (Postgres) — CRUD, date-range/month filtering. Validates `employeeId` and enriches responses with employee details by calling `employees-service`. | RabbitMQ (`attendances_queue`) |
| `auth-service` | Login/JWT issuance. Verifies credentials by calling `employees-service`. | RabbitMQ (`auth_queue`) |

```
HTTP client --> gateway --(RabbitMQ)--> employees-service / attendances-service / auth-service / order-services
                                              ^                    |
                                              +--- validates & -----+
                                                   enriches via RPC
```

Each backend service has its own TypeORM connection (all pointing at the same Postgres database in this local setup) and no cross-service imports of each other's entities — they only talk to each other over RabbitMQ message patterns (defined in `src/common/message-patterns.ts`).

## Prerequisites

- Node.js 20+
- PostgreSQL (local install or Docker)
- RabbitMQ (local install or Docker)

## Project setup

```bash
npm install
cp .env.example .env
```

Edit `.env` with your local DB credentials and a real `JWT_SECRET`. Defaults assume Postgres on `localhost:5432` and RabbitMQ on `localhost:5672` with the `guest`/`guest` credentials.

### Start RabbitMQ + Postgres

Using Docker Compose (spins up both, plus the RabbitMQ management UI at `http://localhost:15672`, guest/guest):

```bash
docker compose up -d
```

Or, if you already run these locally (e.g. via Homebrew):

```bash
brew services start rabbitmq
brew services start postgresql@14   # or whichever version you have
```

## Running the app

Every service is a separate process — start each in its own terminal tab.

### Development (watch mode)

```bash
npm run start:employees:dev
npm run start:attendances:dev
npm run start:auth:dev
npm run start:orders:dev
npm run start:gateway:dev
```

Startup order doesn't matter — RabbitMQ client connections retry until the target queue's consumer comes up. Once all four log `Nest microservice successfully started` / `Nest application successfully started`, the API is live at `http://localhost:3000`.

### Production build

```bash
npm run build

npm run start:employees
npm run start:attendances
npm run start:auth
npm run start:orders
npm run start:gateway
```

Each command runs the compiled output for that one app (`dist/<app>/main.js`); `npm run build` compiles all four in one pass.

### Stopping

`Ctrl+C` in each terminal tab. RabbitMQ/Postgres keep running in the background — stop them separately if needed (`docker compose down`, or `brew services stop rabbitmq`/`postgresql@14`).

## API overview

All requests go through the gateway (`http://localhost:3000`).

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Log in with email/password, returns a JWT + employee details |
| `POST` | `/employees` | Create an employee |
| `GET` | `/employees` | List all employees |
| `GET` | `/employees/:id` | Get one employee |
| `PATCH` | `/employees/:id` | Update an employee |
| `DELETE` | `/employees/:id` | Delete an employee |
| `POST` | `/attendances` | Create an attendance record |
| `GET` | `/attendances` | List all attendance records (each includes the nested `employee`) |
| `GET` | `/attendances/employee/:employeeId` | List an employee's attendance, optionally filtered by `?startDate=&endDate=` or `?month=YYYY-MM` |
| `GET` | `/attendances/employee/:employeeId/today` | List an employee's attendance for today |
| `GET` | `/attendances/:id` | Get one attendance record |
| `PATCH` | `/attendances/:id` | Update an attendance record |
| `DELETE` | `/attendances/:id` | Delete an attendance record |

## Environment variables

See `.env.example`. Notable ones:

- `PORT` — gateway HTTP port
- `DB_*` — Postgres connection (shared by all three backend services)
- `JWT_SECRET`, `JWT_EXPIRES_IN` — used by `auth-service` to sign tokens and `gateway` to verify them
- `RABBITMQ_URL` — AMQP connection string shared by all four apps
- `EMPLOYEES_QUEUE`, `ATTENDANCES_QUEUE`, `AUTH_QUEUE` — queue names; must match between the gateway's client config and each service's own queue

## Tests

```bash
npm run test       # unit tests
npm run test:e2e   # e2e tests
npm run test:cov   # coverage
```

## Lint & format

```bash
npm run lint
npm run format
```
