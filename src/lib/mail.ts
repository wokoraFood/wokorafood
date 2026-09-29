import nodemailer from "nodemailer";
import { BRAND } from "@/lib/constants";

function transport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE !== "false"
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(to: string, subject: string, text: string) {
  const mailer = transport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || BRAND.email;
  if (!mailer) {
    throw new Error("Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  await mailer.sendMail({
    from: `"${BRAND.name}" <${from}>`,
    to,
    subject,
    text,
  });
}
