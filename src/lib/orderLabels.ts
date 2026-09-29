export function kitchenStatusLabel(status: string) {
  if (status === "served") return "Delivered";
  if (status === "placed") return "Placed";
  if (status === "preparing") return "Preparing";
  if (status === "ready") return "Ready";
  if (status === "cancelled") return "Cancelled";
  return status.replace(/_/g, " ");
}

export function paymentStatusLabel(status: string) {
  if (status === "paid") return "Paid";
  if (status === "failed") return "Payment failed";
  if (status === "pending") return "Payment pending";
  if (status === "pay_at_counter") return "Pay at counter";
  return status.replace(/_/g, " ");
}

export function paymentMethodLabel(method?: string | null) {
  if (!method) return "";
  if (method === "upi") return "UPI";
  if (method === "card") return "Card";
  if (method === "cash") return "Cash";
  return method;
}
