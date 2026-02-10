export const Roles = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  ACCOUNTANT: "ACCOUNTANT",
  SUPER_ADMIN: "SUPER_ADMIN"
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
