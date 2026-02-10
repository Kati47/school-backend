# School Management Backend

Production-grade Node.js (Express) + MongoDB backend for a School Management System.

## Features
- JWT auth (access + refresh)
- RBAC (Admin, Teacher, Student, Parent, Accountant, Super Admin)
- Core academic models (classes, subjects, schedules, exams, grades)
- Attendance, assignments, payments, messaging, notifications
- File uploads (local storage)
- Reporting (attendance summary)
- Rate limiting, security headers, centralized error handling

## Setup
1. Create .env from .env.example
2. Start MongoDB (Docker optional)
3. Install dependencies
4. Run the API

## Scripts
- npm run dev
- npm run build
- npm run start

## API Overview
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /users
- /profiles/*
- /academics/*
- /attendance
- /assignments
- /exams
- /payments
- /messages
- /files/upload
- /reports/attendance

## Notes
- Payment integrations are stubs; replace with real Stripe/PayPal SDK calls.
- File uploads store files in UPLOAD_DIR.
