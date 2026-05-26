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
  emailVerified: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
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
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String },
    emailVerificationExpires: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    passwordResetTokenHash: { type: String },
    passwordResetExpires: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
