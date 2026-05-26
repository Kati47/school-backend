import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import { verifyAccessToken } from "../common/utils/jwt";
import { logger } from "../config/logger";
import { Message } from "../modules/messaging/message.model";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: env.CORS_ORIGIN, credentials: true }
  });

  io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization as string | undefined;
    const rawToken = socket.handshake.auth?.token as string | undefined;
    const token = rawToken || (authHeader ? authHeader.replace("Bearer ", "") : undefined);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    const room = `user:${userId}`;
    socket.join(room);
    logger.info("Socket connected", { userId, socketId: socket.id });

    socket.on("typing:start", (payload: { receiverId: string }) => {
      if (!payload?.receiverId) {
        return;
      }
      emitToUser(payload.receiverId, "typing:start", { fromUserId: userId });
    });

    socket.on("typing:stop", (payload: { receiverId: string }) => {
      if (!payload?.receiverId) {
        return;
      }
      emitToUser(payload.receiverId, "typing:stop", { fromUserId: userId });
    });

    socket.on("message:read", async (payload: { messageId: string }) => {
      if (!payload?.messageId) {
        return;
      }

      const message = await Message.findByIdAndUpdate(
        payload.messageId,
        { read: true, readAt: new Date() },
        { new: true }
      );

      if (!message) {
        return;
      }

      emitToUser(String(message.senderId), "message:read", {
        messageId: message.id,
        readerId: userId,
        readAt: message.readAt
      });
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId, socketId: socket.id });
    });
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  if (!io) {
    return;
  }
  io.to(`user:${userId}`).emit(event, payload);
}
