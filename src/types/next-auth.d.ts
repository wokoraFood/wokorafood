import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      role: "customer" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    phone?: string | null;
    role?: "customer" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: "customer" | "admin";
  }
}
