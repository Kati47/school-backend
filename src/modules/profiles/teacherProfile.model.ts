import mongoose, { Schema, Document } from "mongoose";

export interface TeacherProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  subjects: mongoose.Types.ObjectId[];
  classes: mongoose.Types.ObjectId[];
  salary?: number;
}

const teacherProfileSchema = new Schema<TeacherProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
    salary: { type: Number }
  },
  { timestamps: true }
);

export const TeacherProfile = mongoose.model<TeacherProfileDocument>(
  "TeacherProfile",
  teacherProfileSchema
);
