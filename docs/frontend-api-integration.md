# Frontend API Integration Guide

This guide shows the minimum request flow your frontend needs to authenticate users, handle tokens, and call the backend safely.

## Base URL
- Local development: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/docs`

## Authentication Flow
1. Register a user with `POST /auth/register`.
2. Send the verification email link or token to `POST /auth/verify-email`.
3. Log in with `POST /auth/login`.
4. Store the `accessToken` in memory or secure storage strategy of your choice.
5. Store the `refreshToken` in an HTTP-only cookie or secure storage if your app architecture requires it.
6. Use `Authorization: Bearer <accessToken>` for protected endpoints.
7. Refresh tokens with `POST /auth/refresh` when the access token expires.

## Auth Endpoints

### Register
`POST /auth/register`

Request:
```json
{
  "role": "STUDENT",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "password": "Str0ngP@ss"
}
```

Response:
```json
{
  "user": {
    "_id": "664f1c9fbd7b5f1f8d3a1111",
    "role": "STUDENT",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "isActive": true,
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "emailVerificationRequired": true
}
```

If email delivery fails in development, the response may also include `devVerificationToken` so you can complete the flow manually.

### Verify Email
`POST /auth/verify-email`

Request:
```json
{
  "token": "verification-token-from-email"
}
```

Response:
```json
{
  "message": "Email verified successfully"
}
```

### Login
`POST /auth/login`

Request:
```json
{
  "email": "jane@example.com",
  "password": "Str0ngP@ss"
}
```

Response:
```json
{
  "user": {
    "_id": "664f1c9fbd7b5f1f8d3a1111",
    "role": "STUDENT",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

Possible error states:
- `403 Email is not verified`
- `423 Account temporarily locked due to failed login attempts`

### Refresh Tokens
`POST /auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

### Forgot Password
`POST /auth/forgot-password`

Request:
```json
{
  "email": "jane@example.com"
}
```

Response:
```json
{
  "message": "If the account exists, a reset link was sent"
}
```

### Reset Password
`POST /auth/reset-password`

Request:
```json
{
  "token": "reset-token-from-email",
  "password": "NewStr0ngP@ss"
}
```

Response:
```json
{
  "message": "Password reset successfully"
}
```

## Protected Requests

Send the access token as a bearer token:

```http
Authorization: Bearer eyJhbGciOi...
```

Example fetch wrapper:

```ts
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`http://localhost:4000${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    // call /auth/refresh and retry once if needed
  }

  return response;
}
```

## Health Checks
- `GET /health/live` for liveness
- `GET /health/ready` for readiness
- `GET /health` for combined status

## Full API Catalog

### Users
Base path: `/users`

Protected: `ADMIN`, `SUPER_ADMIN`

- `POST /users` create a user
- `GET /users` list users
- `GET /users/:id` get one user
- `PUT /users/:id` update a user
- `DELETE /users/:id` delete a user

### Profiles
Base path: `/profiles`

Protected:
- `/profiles/students` -> `ADMIN`, `SUPER_ADMIN`, `TEACHER`
- `/profiles/teachers` -> `ADMIN`, `SUPER_ADMIN`
- `/profiles/parents` -> `ADMIN`, `SUPER_ADMIN`

CRUD routes for each profile type:
- `POST /...`
- `GET /...`
- `GET /.../:id`
- `PUT /.../:id`
- `DELETE /.../:id`

### Academics
Base path: `/academics`

Protected:
- `/academics/years` -> `ADMIN`, `SUPER_ADMIN`
- `/academics/classes` -> `ADMIN`, `SUPER_ADMIN`, `TEACHER`
- `/academics/subjects` -> `ADMIN`, `SUPER_ADMIN`
- `/academics/schedules` -> `ADMIN`, `SUPER_ADMIN`, `TEACHER`

CRUD routes for each resource:
- `POST /...`
- `GET /...`
- `GET /.../:id`
- `PUT /.../:id`
- `DELETE /.../:id`

Schedule side effect:
- Creating, updating, or deleting a schedule sends realtime notifications to admins.

### Attendance
Base path: `/attendance`

Protected: `ADMIN`, `SUPER_ADMIN`, `TEACHER`

- `POST /attendance` create attendance record
- `GET /attendance` list records
- `GET /attendance/:id` get one record
- `PUT /attendance/:id` update record
- `DELETE /attendance/:id` delete record

### Assignments
Base path: `/assignments`

Protected:
- `/assignments/submissions` -> `ADMIN`, `SUPER_ADMIN`, `TEACHER`, `STUDENT`
- `/assignments` -> `ADMIN`, `SUPER_ADMIN`, `TEACHER`

CRUD routes for each resource:
- `POST /...`
- `GET /...`
- `GET /.../:id`
- `PUT /.../:id`
- `DELETE /.../:id`

### Exams
Base path: `/exams`

Protected: `ADMIN`, `SUPER_ADMIN`, `TEACHER`

- `/exams/grades` CRUD for grades
- `/exams` CRUD for exams

### Payments
Base path: `/payments`

Protected: `ADMIN`, `SUPER_ADMIN`, `ACCOUNTANT`

- `/payments/fees` CRUD for fee definitions
- `/payments` CRUD for payment records
- `POST /payments/charge` record a payment
- `POST /payments/stripe/intent` initialize a Stripe payment intent stub
- `POST /payments/paypal/order` initialize a PayPal order stub

### Messaging
Base path: `/messages`

Protected: all routes require authentication

- `POST /messages/notifications/broadcast` broadcast notification to a role
- `/messages` CRUD for messages
- `/messages/notifications` CRUD for notifications

Realtime note:
- Message and notification creation emits Socket.IO events to recipients.

### Files
Base path: `/files`

Protected: authenticated users

- `POST /files/upload` upload a file with multipart form field `file`
- `GET /files/:id` download a file by GridFS id

### Reports
Base path: `/reports`

Protected: authenticated users with report access

- `GET /reports/attendance` attendance summary

Query params:
- `classId`
- `startDate`
- `endDate`

### Announcements
Base path: `/announcements`

Protected:
- `GET /announcements` any authenticated user
- `POST /announcements` `ADMIN`, `SUPER_ADMIN`
- `PUT /announcements/:id` `ADMIN`, `SUPER_ADMIN`
- `DELETE /announcements/:id` `ADMIN`, `SUPER_ADMIN`

Announcement side effect:
- Creating an announcement sends notifications to users in the selected audience roles.

## Common Response Patterns

Success responses:
- `200` for reads and updates
- `201` for creates
- `204` for deletes

Common error responses:
- `400` invalid request body or bad token
- `401` missing/invalid token
- `403` authenticated but not allowed
- `404` record not found
- `409` duplicate record
- `423` login temporarily locked
- `500` server error

## Frontend Integration Notes
- Always send the access token in `Authorization: Bearer <token>` for protected routes.
- Refresh the access token with `/auth/refresh` if you receive `401` from a protected API call.
- Use `/health/ready` before showing admin dashboards or any screen that depends on backend connectivity.
- Listen to Socket.IO events for live messaging and notifications if your frontend uses realtime updates.
- For multipart uploads to `/files/upload`, send `FormData` and do not set `Content-Type` manually.

## Frontend Tips
- Show the verification step right after registration.
- Block login UI if API returns `403 Email is not verified`.
- Show a locked-account message if API returns `423`.
- Keep the refresh token in a secure storage strategy appropriate to your frontend architecture.