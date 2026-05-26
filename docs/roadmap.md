# Roadmap

## Completed in this pass
- Linting and formatting setup
- Jest testing scaffold
- CI/CD pipeline
- Docker packaging
- Health checks
- Auth baseline with email verification and account lockout
- OpenAPI docs and frontend integration guide

## Next priorities
1. Expand API coverage for users, profiles, academics, attendance, assignments, payments, messaging, and files.
2. Add integration tests for protected endpoints and major workflows.
3. Replace payment provider stubs with real provider SDKs.
4. Add audit logging for sensitive actions.
5. Build richer reporting and analytics endpoints.
6. Add OAuth/SSO integration when you are ready to support external identity providers.

## Suggested frontend sequence
1. Register and verify a user.
2. Log in and persist tokens.
3. Fetch the user profile and role-based data.
4. Add a token refresh interceptor.
5. Integrate domain screens one module at a time.
