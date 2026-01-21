# 🧭 High-Level Design (HLD)

## TrustRoute – Transparent Intercity Bus Refund System

---

## 🎯 Objective

Design a **transparent, explainable, and trackable refund system** for intercity bus bookings that builds **user trust** and enforces **operator accountability**.

This document describes the **high-level architecture**, major components, and system workflows without diving into low-level implementation details.

---

## 🧩 System Overview

TrustRoute is a **web-based platform** that sits between users and bus operators to:

* Display refund policies clearly
* Calculate refunds deterministically
* Track refund status in real time
* Notify users and explain outcomes

The system follows a **modular, service-oriented design** for scalability and clarity.

---

## 🏗️ Architecture Overview

```
Client (Next.js UI)
        ↓
API Layer (Next.js API Routes)
        ↓
Business Logic (Refund Engine)
        ↓
Data Layer (PostgreSQL + Prisma)
        ↓
Cache & Events (Redis)
```

---

## 🧠 Core Components

### 1️⃣ Frontend (Client Layer)

**Technology:** Next.js (TypeScript)

**Responsibilities:**

* Bus selection & booking UI
* Refund policy preview during booking
* Ticket cancellation dashboard
* Refund breakdown & timeline view
* Chatbot interface for refund queries

---

### 2️⃣ API Layer

**Technology:** Next.js API Routes

**Responsibilities:**

* Handle client requests
* Validate inputs
* Route requests to business logic
* Return structured responses

Example APIs:

* `GET /refund-policy/{operatorId}`
* `POST /cancel-ticket`
* `GET /refund-status/{bookingId}`

---

### 3️⃣ Refund Engine (Business Logic Layer)

**Core of the system** 🧠

**Responsibilities:**

* Determine applicable refund window
* Apply operator refund rules
* Calculate deductions and final refund
* Generate refund breakdown
* Lock refund policy at booking time

This layer ensures **deterministic and explainable refunds**.

---

### 4️⃣ Data Layer

**Technology:** PostgreSQL + Prisma

**Key Entities:**

* Users
* Bookings
* BusOperators
* RefundPolicies
* RefundTransactions
* AuditLogs

**Purpose:**

* Persistent storage
* Policy versioning
* Refund traceability

---

### 5️⃣ Cache & Real-Time Layer

**Technology:** Redis

**Responsibilities:**

* Cache refund status
* Enable real-time refund timeline updates
* Prevent duplicate refund processing
* Improve system performance

---

## 🔔 Notification System

Users are notified when:

* Ticket cancellation is confirmed
* Refund is initiated
* Refund is credited

**Channels:**

* In-app notifications
* Email (optional)

---

## 🤖 Refund Assistant Chatbot

An integrated chatbot helps users:

* Understand refund deductions
* Check refund status
* Read refund policies in simple language

This reduces confusion and support dependency.

---

## 🔐 Transparency & Accountability

* Refund policies are **publicly visible**
* Policies are **versioned and immutable per booking**
* Every refund action generates an **audit log**

This ensures no silent policy changes and full traceability.

---

## ☁️ Deployment Overview

* Application containerized using **Docker**
* Deployed on **AWS / Azure**
* CI/CD automated using **GitHub Actions**

---

## 🏁 Summary

TrustRoute’s high-level design focuses on:

* Transparency by default
* Explainability over assumptions
* Trust as a system feature

This architecture enables a **scalable, fair, and user-first refund experience** for public transport platforms.

---

✨ End of High-Level Design ✨
