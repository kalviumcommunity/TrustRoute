# TrustRoute Backend Foundation 🚌

This is the backend foundation for TrustRoute, built with Next.js, Prisma, PostgreSQL, Redis, and Docker.

## Tech Stack
- **Framework:** Next.js (API Routes)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis
- **Containerization:** Docker

## Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+
- npm

### 2. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Spin up Services
Use Docker Compose to start PostgreSQL and Redis:
```bash
docker compose up -d postgres redis
```

### 4. Database Migration
Run Prisma migrations to set up the database schema:
```bash
npx prisma migrate dev --name init
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`.

## API Endpoints
- `GET /api/health`: Health check for Backend, Database, and Redis.

## Project Structure
- `prisma/schema.prisma`: Database models (User, Booking, Operator, etc.)
- `src/lib/prisma.ts`: Prisma client singleton
- `src/lib/redis.ts`: Redis client singleton
- `src/app/api/health/route.ts`: Health check logic
