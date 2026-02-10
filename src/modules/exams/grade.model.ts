import mongoose, { Schema, Document } from "mongoose";

export interface GradeDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  score: number;
}

const gradeSchema = new Schema<GradeDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    score: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Grade = mongoose.model<GradeDocument>("Grade", gradeSchema);
