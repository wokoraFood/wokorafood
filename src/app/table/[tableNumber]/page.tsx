"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function TableDeepLinkPage() {
  const params = useParams<{ tableNumber: string }>();
  const router = useRouter();
  const setTableNumber = useCartStore((state) => state.setTableNumber);
  const setOrderType = useCartStore((state) => state.setOrderType);

  useEffect(() => {
    setTableNumber(params.tableNumber);
    setOrderType("dine_in");
    router.replace(`/menu?table=${params.tableNumber}`);
  }, [params.tableNumber, router, setOrderType, setTableNumber]);

  return (
    <div className="px-4 py-20 text-center">
      Opening the menu for table {params.tableNumber}...
    </div>
  );
}
