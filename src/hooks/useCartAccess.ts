"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";

export function useCartAccess() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = session?.user.role === "admin";
  const isCustomer = session?.user.role === "customer";
  const canUseCart = status === "authenticated" && isCustomer;

  const ensureCart = () => {
    if (status === "loading") return false;
    if (isAdmin) {
      toast("Kitchen login uses the orders board, not the customer cart.");
      router.push("/admin");
      return false;
    }
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/cart")}`);
      return false;
    }
    return true;
  };

  return { status, session, isAdmin, isCustomer, canUseCart, ensureCart };
}
