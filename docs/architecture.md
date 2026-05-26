# Architecture Overview

## Stack
- Runtime: Node.js + Express
- Language: TypeScript
- Database: MongoDB (Mongoose)
- Realtime: Socket.IO
- Validation: Zod
- Auth: JWT (access + refresh)

## High-level Structure
- `src/app.ts`: Express app initialization, middleware, route registration
- `src/index.ts`: HTTP server bootstrap and DB connection
- `src/config`: Environment, DB, and logger configuration
- `src/common`: Shared middleware, CRUD helper, utilities
- `src/modules`: Domain modules (auth, users, academics, payments, etc.)
- `src/realtime`: Socket server and event handling
- `src/docs`: OpenAPI specification generation

## Request Flow
1. Request enters global middleware (`helmet`, CORS, body parsing, rate limit)
2. Route-level auth/authorization and Zod validation run
3. Controller/service logic executes
4. Error middleware converts thrown errors to API responses

## Security Baseline
- JWT auth with role checks
- Request validation using Zod schemas
- Account lockout on repeated failed logins
- Email verification flow on registration
- Centralized error handling and request rate limiting
