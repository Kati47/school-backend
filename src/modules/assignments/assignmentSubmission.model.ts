import mongoose, { Schema, Document } from "mongoose";

export interface AssignmentSubmissionDocument extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  files: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

const assignmentSubmissionSchema = new Schema<AssignmentSubmissionDocument>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String }],
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    feedback: { type: String }
  },
  { timestamps: true }
);

export const AssignmentSubmission = mongoose.model<AssignmentSubmissionDocument>(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
