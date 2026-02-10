import mongoose, { Schema, Document } from "mongoose";

export interface FeeDocument extends Document {
  name: string;
  amount: number;
  currency: string;
  frequency: string;
}

const feeSchema = new Schema<FeeDocument>(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    frequency: { type: String, required: true }
  },
  { timestamps: true }
);

export const Fee = mongoose.model<FeeDocument>("Fee", feeSchema);
