import QRCode from "qrcode";
import { displayOrderNumber } from "@/lib/constants";
import { publicPayeeName, settlementVpa } from "@/lib/payoutAccount";
import {
  UPI_APPS,
  type UpiAppId,
  buildUpiQuery,
  gpayFallbackUri,
  isValidUpiVpa,
  upiAppUri,
  upiPayUri,
} from "@/lib/upi";

export function buildOrderUpiQuery(order: { id: string; serialNumber: number; totalAmount: number }) {
  const vpa = settlementVpa();
  if (!isValidUpiVpa(vpa)) return "";
  return buildUpiQuery({
    vpa,
    payeeName: publicPayeeName(),
    amount: order.totalAmount,
    note: `Wokora ${displayOrderNumber(order.serialNumber)}`,
    txnRef: order.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 35),
  });
}

export function upiOpenUri(query: string, appId: string, ios: boolean) {
  const id = (UPI_APPS.some((app) => app.id === appId) ? appId : "any") as UpiAppId | "any";
  if (id === "any") return upiPayUri(query);
  if (id === "gpay" && ios) return gpayFallbackUri(query);
  return upiAppUri(id, query);
}

export async function upiQrDataUrl(query: string) {
  if (!query) return "";
  return QRCode.toDataURL(upiPayUri(query), {
    margin: 1,
    width: 280,
    color: { dark: "#0D0D0D", light: "#FFFFFF" },
  });
}

export function publicUpiApps() {
  return UPI_APPS.map(({ id, name, hint, color }) => ({ id, name, hint, color }));
}
