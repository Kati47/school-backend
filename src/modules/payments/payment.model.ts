import mongoose, { Schema, Document } from "mongoose";

export interface PaymentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  feeId: mongoose.Types.ObjectId;
  amount: number;
  method: "CARD" | "CASH" | "PAYPAL";
  status: "PAID" | "UNPAID";
  paymentDate?: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    feeId: { type: Schema.Types.ObjectId, ref: "Fee", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["CARD", "CASH", "PAYPAL"], required: true },
    status: { type: String, enum: ["PAID", "UNPAID"], default: "UNPAID" },
    paymentDate: { type: Date }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<PaymentDocument>("Payment", paymentSchema);
