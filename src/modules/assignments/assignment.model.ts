import mongoose, { Schema, Document } from "mongoose";

export interface AssignmentDocument extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  attachments: string[];
}

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    attachments: [{ type: String }]
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<AssignmentDocument>(
  "Assignment",
  assignmentSchema
);
