type OtpRecord = { code: string; expiresAt: number };

const store = new Map<string, OtpRecord>();

export function createOtp(phone: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  store.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  return code;
}

export function verifyOtp(phone: string, code: string) {
  const record = store.get(phone);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (record.code !== code) return false;
  store.delete(phone);
  return true;
}

/**
 * Placeholder SMS sender. Wire Twilio / MSG91 here later:
 * - Twilio: client.messages.create({ to, from, body })
 * - MSG91: POST flow with authkey + template
 */
export async function sendOtpSms(phone: string, code: string) {
  console.info(`[OTP] ${phone} → ${code} (SMS provider not configured)`);
  return { delivered: false, provider: "placeholder", code };
}
