import mongoose, { Schema, Document } from "mongoose";

export interface ClassDocument extends Document {
  name: string;
  level: string;
  students: mongoose.Types.ObjectId[];
  teachers: mongoose.Types.ObjectId[];
}

const classSchema = new Schema<ClassDocument>(
  {
    name: { type: String, required: true },
    level: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teachers: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const ClassModel = mongoose.model<ClassDocument>("Class", classSchema);
