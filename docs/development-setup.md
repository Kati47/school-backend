# Development Setup

## Quick Start
1. `cp .env.example .env`
2. `docker compose up -d mongo`
3. `npm install`
4. `npm run dev`

## Useful Commands
- `npm run lint`
- `npm run test`
- `npm run test:cov`
- `npm run build`
- `npm run format:write`

## API Documentation
- Swagger UI: `GET /docs`
- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`
