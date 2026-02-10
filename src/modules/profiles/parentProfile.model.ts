import mongoose, { Schema, Document } from "mongoose";

export interface ParentProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  childrenIds: mongoose.Types.ObjectId[];
}

const parentProfileSchema = new Schema<ParentProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    childrenIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const ParentProfile = mongoose.model<ParentProfileDocument>(
  "ParentProfile",
  parentProfileSchema
);
