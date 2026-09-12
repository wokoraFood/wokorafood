import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";
import { normalizeIdentifier } from "./phone";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Phone or Email",
      credentials: {
        identifier: { label: "Phone or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const identifier = normalizeIdentifier(parsed.data.identifier);
        const password = parsed.data.password;
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ phone: identifier }, { email: identifier.toLowerCase() }],
          },
        });

        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role as "customer" | "admin",
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            name: user.name || "Wokora Guest",
            email: user.email,
            phone: `g${account.providerAccountId.replace(/\D/g, "").slice(-10).padStart(10, "0")}`,
            passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
            role: "customer",
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.phone = user.phone || "";
        token.role = (user.role as "customer" | "admin") || "customer";
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.phone = dbUser.phone;
          token.role = dbUser.role as "customer" | "admin";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.role = token.role;
      return session;
    },
  },
};
