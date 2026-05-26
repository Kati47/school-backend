import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { rateLimiter } from "./common/middleware/rateLimit";
import { errorHandler } from "./common/middleware/errorHandler";
import { notFoundHandler } from "./common/middleware/notFoundHandler";
import { env } from "./config/env";
import { openApiSpec } from "./docs/openapi";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import profileRoutes from "./modules/profiles/profile.routes";
import academicRoutes from "./modules/academics/academic.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes";
import assignmentRoutes from "./modules/assignments/assignment.routes";
import examRoutes from "./modules/exams/exam.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import messageRoutes from "./modules/messaging/message.routes";
import fileRoutes from "./modules/files/file.routes";
import reportRoutes from "./modules/reports/report.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

const uploadsPath = path.resolve(env.UPLOAD_DIR);
app.use("/uploads", express.static(uploadsPath));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/health", (_req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbReady = readyState === 1;

  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? "ok" : "degraded",
    env: env.NODE_ENV,
    db: {
      ready: dbReady,
      state: readyState
    }
  });
});

app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "alive" });
});

app.get("/health/ready", (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  if (!dbReady) {
    return res.status(503).json({ status: "not_ready", db: "disconnected" });
  }

  return res.status(200).json({ status: "ready" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/academics", academicRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/exams", examRoutes);
app.use("/payments", paymentRoutes);
app.use("/messages", messageRoutes);
app.use("/files", fileRoutes);
app.use("/reports", reportRoutes);
app.use("/announcements", announcementRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
