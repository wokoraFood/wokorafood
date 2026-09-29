import { BRAND } from "@/lib/constants";
import { sendMail, mailConfigured } from "@/lib/mail";
import { kitchenWhatsAppNumber, sendWhatsAppText } from "@/lib/whatsapp";

type SupportAlert = {
  name: string;
  phone: string;
  email?: string | null;
  subject: string;
  message: string;
};

function adminEmail() {
  return (
    process.env.KITCHEN_ADMIN_EMAIL?.trim() ||
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    BRAND.email
  );
}

export async function notifyNewSupportTicket(ticket: SupportAlert) {
  const adminBody = [
    `New support query on ${BRAND.name}.`,
    "",
    `From: ${ticket.name}`,
    ticket.phone ? `Phone: ${ticket.phone}` : null,
    ticket.email ? `Email: ${ticket.email}` : null,
    `Subject: ${ticket.subject}`,
    "",
    ticket.message,
  ]
    .filter(Boolean)
    .join("\n");

  const customerBody = [
    `Hi ${ticket.name},`,
    "",
    `We received your query at ${BRAND.name}. The kitchen team will reply here and by email.`,
    "",
    `Subject: ${ticket.subject}`,
    "",
    ticket.message,
    "",
    `— ${BRAND.name}`,
    BRAND.phone,
  ].join("\n");

  const jobs: Promise<unknown>[] = [];

  if (mailConfigured()) {
    jobs.push(
      sendMail(adminEmail(), `${BRAND.name} support: ${ticket.subject}`, adminBody).catch((error) =>
        console.error("[support] admin email", error)
      )
    );
    if (ticket.email) {
      jobs.push(
        sendMail(
          ticket.email,
          `${BRAND.name}: we received your query`,
          customerBody
        ).catch((error) => console.error("[support] customer email", error))
      );
    }
  } else {
    console.info("[support] SMTP not configured; emails skipped");
  }

  const wa = kitchenWhatsAppNumber();
  if (wa) {
    jobs.push(
      sendWhatsAppText(wa, `Wokora Foods support\n${ticket.name} (${ticket.phone || ticket.email || "customer"})\n${ticket.subject}\n\n${ticket.message}`).catch(
        (error) => console.error("[support] whatsapp", error)
      )
    );
  }

  await Promise.allSettled(jobs);
}
