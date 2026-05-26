# Deployment Guide

## CI/CD
- Workflow file: `.github/workflows/ci-cd.yml`
- Pull requests to `main` run:
  - lint
  - tests with coverage
  - TypeScript build
- Pushes to `main` also build and publish container image to GHCR.

## Local Container Run
1. Configure `.env`.
2. Build and start services:
   - `docker compose up --build`
3. API is available at `http://localhost:4000`.
4. Swagger docs are available at `http://localhost:4000/docs`.

## Production Notes
- Set strong JWT and SMTP secrets.
- Use managed MongoDB and secure network policies.
- Store container registry and cloud credentials in GitHub Secrets.
- Add an environment-specific deploy step (Kubernetes, App Service, ECS, etc.) after image publish.
