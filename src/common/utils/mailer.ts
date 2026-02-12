import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { ApiError } from "./ApiError";

function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE } = env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new ApiError(500, "Email service is not configured");
  }

  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    from: SMTP_FROM
  };
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth
  });

  const subject = "Reset your password";
  const text = `You requested a password reset. Use this link to set a new password:\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.`;
  const html = `
    <p>You requested a password reset.</p>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html
  });
}
