import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "School Management Backend API",
      version: "1.0.0",
      description: "Core API documentation for authentication, health checks, and system endpoints."
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    paths: {
      "/health": {
        get: {
          summary: "Combined health status",
          tags: ["Health"],
          responses: {
            "200": { description: "Service healthy" },
            "503": { description: "Service degraded" }
          }
        }
      },
      "/health/live": {
        get: {
          summary: "Liveness probe",
          tags: ["Health"],
          responses: {
            "200": { description: "Process is alive" }
          }
        }
      },
      "/health/ready": {
        get: {
          summary: "Readiness probe",
          tags: ["Health"],
          responses: {
            "200": { description: "Service ready" },
            "503": { description: "Service not ready" }
          }
        }
      },
      "/auth/register": {
        post: {
          summary: "Register user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["role", "firstName", "lastName", "email", "password"],
                  properties: {
                    role: { type: "string", example: "STUDENT" },
                    firstName: { type: "string", example: "Jane" },
                    lastName: { type: "string", example: "Doe" },
                    email: { type: "string", format: "email", example: "jane@example.com" },
                    phone: { type: "string", example: "+15551234567" },
                    password: { type: "string", format: "password", example: "Str0ngP@ss" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Registered" },
            "409": { description: "Email already registered" }
          }
        }
      },
      "/auth/verify-email": {
        post: {
          summary: "Verify registered email",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token"],
                  properties: {
                    token: { type: "string", example: "verification-token" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Email verified" },
            "400": { description: "Invalid or expired token" }
          }
        }
      },
      "/auth/login": {
        post: {
          summary: "Authenticate user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", format: "password" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Authenticated" },
            "401": { description: "Invalid credentials" },
            "403": { description: "Email is not verified" },
            "423": { description: "Account locked" }
          }
        }
      }
    }
  },
  apis: []
};

export const openApiSpec = swaggerJsdoc(options);
