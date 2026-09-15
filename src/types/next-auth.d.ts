import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      role: "customer" | "admin";
      storeId: string;
    } & DefaultSession["user"];
  }

  interface User {
    phone?: string | null;
    role?: "customer" | "admin";
    storeId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: "customer" | "admin";
    storeId: string;
  }
}
