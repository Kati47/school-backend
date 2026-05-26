# Database Schema Diagram

```mermaid
erDiagram
  USER ||--o| STUDENT_PROFILE : has
  USER ||--o| TEACHER_PROFILE : has
  USER ||--o| PARENT_PROFILE : has
  USER ||--o{ MESSAGE : sends
  USER ||--o{ MESSAGE : receives
  USER ||--o{ NOTIFICATION : receives

  CLASS ||--o{ STUDENT_PROFILE : contains
  CLASS ||--o{ SCHEDULE : has
  SUBJECT ||--o{ SCHEDULE : scheduled_as
  USER ||--o{ SCHEDULE : teaches

  CLASS ||--o{ ASSIGNMENT : has
  SUBJECT ||--o{ ASSIGNMENT : targets
  USER ||--o{ ASSIGNMENT : created_by
  ASSIGNMENT ||--o{ ASSIGNMENT_SUBMISSION : receives
  USER ||--o{ ASSIGNMENT_SUBMISSION : submits

  CLASS ||--o{ EXAM : has
  SUBJECT ||--o{ EXAM : targets
  EXAM ||--o{ GRADE : produces
  USER ||--o{ GRADE : receives

  USER ||--o{ ATTENDANCE : has
  CLASS ||--o{ ATTENDANCE : tracks

  FEE ||--o{ PAYMENT : billed_as
  USER ||--o{ PAYMENT : pays
```

## Notes
- `USER` is the core identity record with role and auth fields.
- Student, teacher, and parent domain attributes are separated into profile collections.
- Academic and operational data is segmented by module for maintainability.
