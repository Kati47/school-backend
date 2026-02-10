import mongoose, { Schema, Document } from "mongoose";

export interface ExamDocument extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  date: Date;
  type: "MIDTERM" | "FINAL";
}

const examSchema = new Schema<ExamDocument>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["MIDTERM", "FINAL"], required: true }
  },
  { timestamps: true }
);

export const Exam = mongoose.model<ExamDocument>("Exam", examSchema);
