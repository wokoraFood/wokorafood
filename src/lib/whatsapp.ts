function adminWhatsAppPhone() {
  const raw = process.env.KITCHEN_ADMIN_PHONE || process.env.WHATSAPP_ADMIN_PHONE || "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("91") ? digits : `91${digits}`;
}

export async function sendWhatsAppText(toPhone: string, body: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = toPhone.replace(/\D/g, "");
  const dest = to.startsWith("91") ? to : `91${to}`;

  if (!token || !phoneId || dest.length < 10) {
    console.info(`[whatsapp] not configured — would send to ${dest}: ${body.slice(0, 80)}`);
    return false;
  }

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: dest,
      type: "text",
      text: { preview_url: false, body },
    }),
  });

  if (!res.ok) {
    console.error("[whatsapp]", res.status, await res.text());
    return false;
  }
  return true;
}

export function kitchenWhatsAppNumber() {
  return adminWhatsAppPhone();
}
