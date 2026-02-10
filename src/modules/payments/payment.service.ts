import { Payment } from "./payment.model";

export async function recordPayment(payload: {
  studentId: string;
  feeId: string;
  amount: number;
  method: "CARD" | "CASH" | "PAYPAL";
}) {
  const payment = await Payment.create({
    ...payload,
    status: "PAID",
    paymentDate: new Date()
  });

  return payment;
}

export async function initializeStripeCharge(_payload: { amount: number; currency: string }) {
  return { provider: "stripe", status: "stub", clientSecret: "replace_with_real" };
}

export async function initializePaypalOrder(_payload: { amount: number; currency: string }) {
  return { provider: "paypal", status: "stub", orderId: "replace_with_real" };
}
