# 🛠️ Low-Level Design (LLD)

## TrustRoute – Transparent Intercity Bus Refund System

---

## 1. Data Model (Prisma Schema)

### Entities & Relations
- **User**: id, name, email, passwordHash, createdAt
- **BusOperator**: id, name, contactInfo, createdAt
- **RefundPolicy**: id, operatorId (FK), policyJson, version, createdAt
- **Booking**: id, userId (FK), operatorId (FK), policyVersion, status, amount, createdAt, cancelledAt
- **RefundTransaction**: id, bookingId (FK), amount, status, breakdownJson, createdAt, processedAt
- **AuditLog**: id, action, entityType, entityId, userId (FK), detailsJson, createdAt

## 2. API Endpoints (Next.js API Routes)

### Refund Policy
- `GET /api/refund-policy/[operatorId]` – Fetch current policy for operator

### Booking & Cancellation
- `POST /api/book` – Create booking, lock policy version
- `POST /api/cancel-ticket` – Cancel booking, trigger refund calculation

### Refund Status
- `GET /api/refund-status/[bookingId]` – Get refund progress & breakdown

## 3. Refund Engine (Business Logic)

- Fetch locked policy for booking
- Determine refund eligibility window
- Apply policy rules to calculate deduction & refund
- Generate breakdown (JSON)
- Persist RefundTransaction & AuditLog
- Publish status to Redis for real-time updates

## 4. Real-Time & Caching (Redis)

- Store refund status per booking (key: `refund:bookingId`)
- Publish updates to subscribed clients (WebSocket/Server-Sent Events)
- Prevent duplicate refund processing with locks (key: `lock:refund:bookingId`)

## 5. Notification System

- Trigger in-app notification on refund events
- (Optional) Send email via SMTP provider

## 6. Chatbot (Frontend + API)

- UI: Chat widget in dashboard
- API: `/api/chatbot` endpoint for refund queries
- Logic: NLP to map user queries to refund data/policy explanations

## 7. Security & Audit

- All policy changes versioned, never overwritten
- AuditLog for every refund/cancellation action
- Sensitive actions require authentication & authorization

## 8. Deployment & DevOps

- Dockerfile for backend containerization
- docker-compose for local dev (Postgres, Redis, app)
- GitHub Actions for CI/CD (test, lint, deploy)

---

## Sequence Diagram: Ticket Cancellation & Refund

1. User requests cancellation (UI)
2. API validates & routes to Refund Engine
3. Refund Engine fetches booking, locked policy, computes refund
4. RefundTransaction & AuditLog created
5. Status cached in Redis, notification sent
6. User sees real-time update in dashboard

---

## Folder Structure Reference
- `src/app/api/` – API routes
- `src/lib/prisma.ts` – DB client
- `src/lib/redis.ts` – Redis client
- `prisma/schema.prisma` – Data model

---

_This LLD complements the HLD by detailing data models, API contracts, business logic, and real-time mechanisms._
