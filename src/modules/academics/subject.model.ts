import mongoose, { Schema, Document } from "mongoose";

export interface SubjectDocument extends Document {
  name: string;
  coefficient: number;
}

const subjectSchema = new Schema<SubjectDocument>(
  {
    name: { type: String, required: true },
    coefficient: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const Subject = mongoose.model<SubjectDocument>("Subject", subjectSchema);
