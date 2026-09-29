export type UpiAppId =
  | "any"
  | "gpay"
  | "phonepe"
  | "paytm"
  | "bhim"
  | "amazonpay"
  | "cred"
  | "mobikwik";

export type UpiApp = {
  id: UpiAppId;
  name: string;
  hint: string;
  color: string;
};

export const UPI_APPS: UpiApp[] = [
  { id: "gpay", name: "Google Pay", hint: "GPay", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", hint: "PhonePe", color: "#5F259F" },
  { id: "paytm", name: "Paytm", hint: "Paytm", color: "#00BAF2" },
  { id: "bhim", name: "BHIM", hint: "BHIM UPI", color: "#0066B3" },
  { id: "amazonpay", name: "Amazon Pay", hint: "Amazon", color: "#FF9900" },
  { id: "cred", name: "CRED", hint: "CRED UPI", color: "#C9A227" },
  { id: "mobikwik", name: "MobiKwik", hint: "MobiKwik", color: "#E21B22" },
];

export function normalizeUpiVpa(value: string) {
  return value.trim().replace(/\s/g, "").toLowerCase();
}

export function isValidUpiVpa(value: string) {
  return /^[a-z0-9._-]{2,256}@[a-z]{2,64}$/i.test(normalizeUpiVpa(value));
}

export function upiAmount(rupees: number) {
  return Math.max(1, Math.round(rupees)).toFixed(2);
}

export function buildUpiQuery(options: {
  vpa: string;
  payeeName: string;
  amount: number;
  note: string;
  txnRef?: string;
}) {
  const params = new URLSearchParams({
    pa: normalizeUpiVpa(options.vpa),
    pn: options.payeeName.slice(0, 99) || "Wokora Foods",
    am: upiAmount(options.amount),
    cu: "INR",
    tn: options.note.slice(0, 50),
  });
  if (options.txnRef) params.set("tr", options.txnRef.slice(0, 35));
  return params.toString();
}

/** Generic intent — Android shows every installed UPI app. */
export function upiPayUri(query: string) {
  return `upi://pay?${query}`;
}

export function upiAppUri(appId: UpiAppId, query: string) {
  switch (appId) {
    case "any":
      return upiPayUri(query);
    case "gpay":
      return `tez://upi/pay?${query}`;
    case "phonepe":
      return `phonepe://pay?${query}`;
    case "paytm":
      return `paytmmp://pay?${query}`;
    case "bhim":
      return `bhim://pay?${query}`;
    case "amazonpay":
      return `amazonpay://upi/pay?${query}`;
    case "cred":
      return `cred://upi/pay?${query}`;
    case "mobikwik":
      return `mobikwik://upi/pay?${query}`;
  }
}

export function gpayFallbackUri(query: string) {
  return `gpay://upi/pay?${query}`;
}
