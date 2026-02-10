import mongoose, { Schema, Document } from "mongoose";

export interface StudentProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  studentCode: string;
  classId?: mongoose.Types.ObjectId;
  parentIds: mongoose.Types.ObjectId[];
  dateOfBirth?: Date;
  address?: string;
  academicYear?: string;
}

const studentProfileSchema = new Schema<StudentProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    studentCode: { type: String, required: true, unique: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class" },
    parentIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dateOfBirth: { type: Date },
    address: { type: String },
    academicYear: { type: String }
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model<StudentProfileDocument>(
  "StudentProfile",
  studentProfileSchema
);
