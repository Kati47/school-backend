import mongoose, { Schema, Document } from "mongoose";
import { Role, Roles } from "../../types/roles";

export interface UserDocument extends Document {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  isActive: boolean;
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    role: {
      type: String,
      enum: Object.values(Roles),
      required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    passwordResetTokenHash: { type: String },
    passwordResetExpires: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
