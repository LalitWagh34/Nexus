# Nexus 💬

A production-grade real-time chat backend built from scratch. Not a tutorial project — every architectural decision was made with intention, understanding the *why* behind it.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)

---

## What is Nexus?

Nexus is a scalable real-time chat system built with a monolith-first approach, designed to evolve into a microservices architecture. The name reflects its core purpose — a connection point between people.

---

## Features

- **Real-time messaging** via Socket.io with room-based architecture
- **1-1 and group conversations** with proper member roles (Admin/Member)
- **Typing indicators** and online/offline presence tracking
- **Read receipts** with per-user tracking
- **Image and file uploads** via MinIO (self-hosted, S3-compatible)
- **Google OAuth** via Passport.js (no Firebase black box)
- **JWT authentication** with access + refresh token rotation
- **Soft deletes** on messages (audit trail, undo support)
- **Cursor-based pagination** for message history (performant at scale)
- **Global error handling** with custom error classes
- **Request validation** with Zod

---

## Architecture

```
Client
  ↓
Express Server (Nexus API)
  ├── Auth Layer (Google OAuth + JWT)
  ├── Conversation Service
  ├── Message Service
  ├── Socket.io (Realtime Layer)
  └── Upload Service
       ↓
  ┌────────────┬──────────┬──────────┐
  │ PostgreSQL │  Redis   │  MinIO   │
  │ (Prisma)   │(Presence)│ (Files)  │
  └────────────┴──────────┴──────────┘
```

### Layered Architecture
```
src/
├── config/          # Env, Prisma client, Passport setup
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Database queries
├── routes/          # Express route definitions
├── middlewares/     # Auth, error handling, validation
├── utils/           # JWT helpers, AppError classes
├── types/           # TypeScript type definitions
└── sockets/         # Socket.io event handlers
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Framework | Express.js + TypeScript |
| Realtime | Socket.io |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache + Presence | Redis |
| Auth | Google OAuth (Passport.js) |
| Tokens | JWT (access 15min + refresh 7d) |
| Validation | Zod |
| Logging | Pino |
| File Storage | MinIO (self-hosted S3) |
| Queue | BullMQ (coming soon) |
| Containerization | Docker |

---

## Database Schema

```
User
├── id, name, email, avatar
├── googleId (OAuth)
└── password (optional, for future email auth)

Conversation
├── id, isGroup, name, avatar
└── members (ConversationMember[])

ConversationMember
├── userId, conversationId
└── role (ADMIN | MEMBER)

Message
├── content, type (TEXT | IMAGE | VIDEO | AUDIO)
├── senderId, conversationId
├── deletedAt (soft delete)
└── attachments, readReceipts

RefreshToken
├── token, userId
├── expiresAt
└── revoked (for rotation)
```

---

## Key Engineering Decisions

**Why rooms over broadcasting?**
Broadcasting sends every message to every connected client — O(n) for every message. Rooms scope delivery to only members of a conversation, making it efficient at scale.

**Why soft deletes?**
Hard deletes are permanent and unrecoverable. Soft deletes (`deletedAt` timestamp) allow undo functionality, audit trails, and prevent foreign key issues with read receipts referencing deleted messages.

**Why cursor pagination over page numbers?**
Page numbers break when new messages are inserted (page 2 shifts). Cursor pagination uses the last seen message ID as an anchor — stable, consistent, and performant with a database index.

**Why Redis for presence, not PostgreSQL?**
Presence (online/offline) changes constantly — every connect/disconnect event. Writing that to PostgreSQL would hammer the DB. Redis keeps it in memory with TTL-based expiry, handling thousands of updates per second without breaking a sweat.

**Why refresh token rotation?**
When a refresh token is used, it's immediately revoked and a new one is issued. If a stolen token is used, the legitimate user's next request will fail (their token was already rotated), alerting you to a breach.

---

## Getting Started

### Prerequisites
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Docker Desktop installed
- Google Cloud Console project with OAuth 2.0 credentials

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/nexus.git
cd nexus

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# Run database migrations
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Start the server
bun dev
```

### Environment Variables

```bash
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nexus"

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## API Endpoints

### Auth
```
GET  /auth/google              → Redirect to Google OAuth
GET  /auth/google/callback     → Google OAuth callback
POST /auth/refresh             → Refresh access token
POST /auth/logout              → Revoke refresh token
```

### Conversations
```
POST /conversations            → Create conversation
GET  /conversations            → Get all conversations
GET  /conversations/:id        → Get single conversation
```

### Messages
```
GET  /conversations/:id/messages   → Get messages (cursor paginated)
POST /conversations/:id/messages   → Send message
DELETE /messages/:id               → Soft delete message
```

### Health
```
GET  /health                   → Server health check
```

---

## Socket Events

```
// Client → Server
join_conversation     → Join a conversation room
send_message          → Send a message
typing_start          → Start typing indicator
typing_stop           → Stop typing indicator
mark_read             → Mark messages as read

// Server → Client
new_message           → New message received
user_typing           → Someone is typing
user_stopped_typing   → Someone stopped typing
user_online           → User came online
user_offline          → User went offline
messages_read         → Messages marked as read
```

---

## Roadmap

- [x] Monolith with core chat features
- [x] Google OAuth + JWT auth
- [x] Real-time messaging via Socket.io
- [x] File uploads via MinIO
- [ ] BullMQ background jobs (notifications, cleanup)
- [ ] Split into microservices (auth, chat, notification, media)
- [ ] Kafka for async event-driven communication
- [ ] Redis Pub/Sub to sync WebSockets across instances
- [ ] Elasticsearch for full-text message search
- [ ] Idempotency for duplicate message prevention
- [ ] Next.js frontend

---

## What I Learned

Building Nexus taught me more than any course. The key shift was asking *why* before *how*:

- Why does Socket.io use rooms? → Efficient message scoping
- Why soft deletes? → Data integrity and auditability  
- Why cursor pagination? → Stability under insertion
- Why Redis for presence? → Write throughput at scale
- Why refresh token rotation? → Theft detection

Every production system is a collection of intentional trade-offs. This project was about understanding those trade-offs.

---

## License

MIT

---

> Built with curiosity, not just code.