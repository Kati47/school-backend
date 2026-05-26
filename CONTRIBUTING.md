# Contributing

## Prerequisites
- Node.js 20 LTS (recommended)
- Docker Desktop (optional, for MongoDB)

## Development Setup
1. Copy `.env.example` to `.env` and fill values.
2. Start MongoDB:
   - Local: run a local MongoDB service
   - Docker: `docker compose up -d mongo`
3. Install dependencies: `npm install`
4. Run in dev mode: `npm run dev`

## Quality Standards
- Lint: `npm run lint`
- Format check: `npm run format`
- Tests: `npm run test`
- Build: `npm run build`

Pre-commit hooks run lint and tests automatically.

## Pull Requests
- Create focused PRs with a clear title and summary.
- Link related issue(s).
- Include test updates for behavior changes.
- Ensure CI is green before requesting review.

## Branch Strategy
- `main` is protected and deployable.
- Work on feature branches and open PRs to `main`.
