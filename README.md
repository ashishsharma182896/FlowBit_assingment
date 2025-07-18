# Flowbit Multi-Tenant Backend Technical Challenge

**Author:** Ashish Sharma  
**Submission Date:** July 18, 2025

---

## Overview

This project delivers a secure, scalable multi-tenant backend for workflow automation, reflecting the Flowbit technical challenge requirements. It demonstrates strict tenant data isolation, robust RBAC, dynamic navigation, audit logging, and direct workflow engine (n8n) integration—all running locally and containerized for reproducible demos.

---

## Features Implemented

- **Authentication & RBAC**
  - Email/password login and signup
  - JWT tokens including `customerId` and `role` (`Admin`/`User`)
  - Secure `/admin/*` route guarding for tenant admins

- **Tenant Data Isolation**
  - Every main document (User, Ticket, AuditLog) references `customerId`
  - All queries and operations filter by tenant, enforced by middleware

- **User & Admin Management**
  - Admins can perform CRUD on users within their tenant only
  - Ordinary users restricted from admin endpoints (403 Forbidden)

- **Support Ticket System**
  - `/api/tickets` routes: create, list, update, delete, and per-ID fetch
  - Tickets visible only to users within the same tenant

- **Screens Registry**
  - `/me/screens` endpoint returns per-tenant allowed screens based on `registry.json`

- **Workflow Roundtrip Integration**
  - Creating a ticket triggers an n8n flow
  - n8n posts back to `/webhook/ticket-done` (protected by a shared secret)
  - Ticket status is updated and reflected to the user

- **Audit Logging (Bonus)**
  - All ticket actions are logged with `{action, userId, tenant, timestamp, details}`

- **Seed Data**
  - Scripted seeding of at least two tenants and admin users

- **Containerized Setup**
  - All services orchestrated via `docker-compose up` (MongoDB, API, n8n, etc.)

---

## Quick Start

### 1. Prerequisites

- Node.js (v18+ recommended)
- Docker + Docker Compose (if running containerized)
- MongoDB (automatically managed via Docker)

### 2. Environment Setup

Copy and adjust `.env.example` to `.env` with your secrets:
PORT=5001
MONGO_URI=mongodb://mongo:27017/flowbit-db
JWT_SECRET=yoursecuresecret
WEBHOOK_SHARED_SECRET=some-strong-secret

text

### 3. Install & Run (Local)

npm install
npm run seed # Seeds two tenants and admin users
npm start

text

### 4. Install & Run (Docker Compose)

docker-compose up --build

Automatically starts MongoDB, API, n8n, and other services
text

---

## API Overview

### **Auth**
- `POST   /api/auth/signup` — Register a user (requires `customerId`, role)
- `POST   /api/auth/login` — Login, returns JWT as cookie
- `POST   /api/auth/logout` — Destroy JWT cookie
- `GET    /api/auth/check` — Return current authenticated user

### **User Management (Admin Only, Per Tenant)**
- `GET    /admin/users` — List users in this tenant
- `POST   /admin/users` — Create user (as admin)
- `PUT    /admin/users/:id` — Update user
- `DELETE /admin/users/:id` — Delete user

### **Support Tickets**
- `POST   /api/tickets` — Create support ticket
- `GET    /api/tickets` — List tickets for this tenant
- `GET    /api/tickets/:id` — Get ticket detail (may 404 if wrong tenant)
- `PUT    /api/tickets/:id` — Update ticket
- `DELETE /api/tickets/:id` — Delete ticket

### **Screens / Dynamic Navigation**
- `GET    /api/me/screens` — Get per-tenant screens config

### **Webhook (integration)**
- `POST   /webhook/ticket-done` — n8n workflow posts status updates (header: `x-webhook-secret`)

### **Admin / Tenant Info**
- `GET    /admin/me/tenant` — View current tenant details
- `GET    /admin/me/tickets` — View all tickets for tenant
- `GET    /admin/audit-logs` — Audit logs (admin-only)

---

## Architecture Diagram

+---------+ +---------------+ +-------------+ +--------+
| React |<---> | API Server |<-->| MongoDB |<---> | n8n WF |
+---------+ +---------------+ +-------------+ +--------+
| | ^ | ^
| v | | |
| [JWT auth/cookie] |<--- strict tenant isolation --->|
+-------------------------+ |
Dynamic registry/screens Async: webhook callback

text
(Hand-drawn scan or digital diagram also attached in project root.)

---

## Known Limitations

- No production-ready monitoring or rate limiting.
- No external cloud storage (all services local).
- Real-time UI updates via WebSocket are optional (demo uses polling).
- Email notifications, password reset, etc., not included.
- No HTTPS included by default (add a proxy or HTTPS in production).

---

## Demo Video

- See video attached or linked:  
  - **Demonstrates:** Multi-tenant login, ticket creation, admin/user isolation, n8n workflow roundtrip, secure webhooks, and audit logs.

---

## Testing

- Use Postman or Jest (provided scripts) to verify endpoint behavior.
- Seed users:  
  - LogisticsCo admin: `admin@logisticsco.com` / `password123`
  - RetailGmbH admin: `admin@retailgmbh.com` / `password123`

---

## Setup and Contribution

1. Clone the repo.
2. Install dependencies (`npm install`).
3. Seed the DB and adjust `.env` as needed.
4. Submit issues or PRs for any bugs/suggestions.

---

**Thank you for reviewing my submission!**

