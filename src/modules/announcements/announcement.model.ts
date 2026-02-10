import mongoose, { Schema, Document } from "mongoose";
import { Role, Roles } from "../../types/roles";

export interface AnnouncementDocument extends Document {
  title: string;
  body: string;
  audienceRoles: Role[];
  createdBy: mongoose.Types.ObjectId;
  publishedAt: Date;
}

const announcementSchema = new Schema<AnnouncementDocument>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audienceRoles: { type: [String], enum: Object.values(Roles), default: [Roles.STUDENT] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<AnnouncementDocument>(
  "Announcement",
  announcementSchema
);
