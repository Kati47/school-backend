import mongoose, { Schema, Document } from "mongoose";

export interface AcademicYearDocument extends Document {
  year: string;
  isActive: boolean;
}

const academicYearSchema = new Schema<AcademicYearDocument>(
  {
    year: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const AcademicYear = mongoose.model<AcademicYearDocument>(
  "AcademicYear",
  academicYearSchema
);
