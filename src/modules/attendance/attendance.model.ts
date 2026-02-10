import mongoose, { Schema, Document } from "mongoose";

export interface AttendanceDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE";
}

const attendanceSchema = new Schema<AttendanceDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], required: true }
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<AttendanceDocument>(
  "Attendance",
  attendanceSchema
);
