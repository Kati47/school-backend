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
- npm run lint
- npm run test
- npm run test:cov
- npm run format

## Quality and CI
- ESLint + Prettier configured
- Jest + Supertest test setup with coverage output
- Husky pre-commit hook (`lint` + `test`)
- GitHub Actions CI/CD in `.github/workflows/ci-cd.yml`

## API Documentation
- Swagger UI: `GET /docs`
- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`

## API Overview
- POST /auth/register
- POST /auth/verify-email
- POST /auth/login
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password
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

## Additional Documentation
- Architecture: `docs/architecture.md`
- Database schema: `docs/database-schema.md`
- Frontend API integration: `docs/frontend-api-integration.md`
- Roadmap: `docs/roadmap.md`
- Deployment: `docs/deployment.md`
- Development setup: `docs/development-setup.md`
- Contribution guide: `CONTRIBUTING.md`

## Email (Password Reset)
Set these env vars to enable password reset emails via Nodemailer:
- APP_BASE_URL
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- SMTP_SECURE
