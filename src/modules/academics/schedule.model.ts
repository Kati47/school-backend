import mongoose, { Schema, Document } from "mongoose";

export interface ScheduleDocument extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  day: string;
  startTime: string;
  endTime: string;
}

const scheduleSchema = new Schema<ScheduleDocument>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { timestamps: true }
);

export const Schedule = mongoose.model<ScheduleDocument>(
  "Schedule",
  scheduleSchema
);
