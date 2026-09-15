import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Enter phone or email"),
  password: z.string().min(1, "Password is required"),
});

export const orderSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required for dine-in").optional(),
  type: z.enum(["dine_in", "takeaway"]),
  notes: z.string().max(240).optional(),
  paymentMethod: z.enum(["upi", "card", "cash"]).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        quantity: z.number().int().min(1).max(20),
        selections: z.record(z.array(z.string())).optional(),
        customization: z.string().max(240).optional(),
      })
    )
    .min(1, "Cart is empty"),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
