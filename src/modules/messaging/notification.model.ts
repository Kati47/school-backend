import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: "ATTENDANCE" | "PAYMENT" | "ASSIGNMENT" | "TIMETABLE" | "ANNOUNCEMENT" | "SYSTEM";
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["ATTENDANCE", "PAYMENT", "ASSIGNMENT", "TIMETABLE", "ANNOUNCEMENT", "SYSTEM"], required: true }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);
