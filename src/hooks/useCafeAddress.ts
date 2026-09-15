"use client";

import { useEffect, useState } from "react";
import { BRAND, googleMapsEmbed } from "@/lib/constants";

export function useCafeAddress() {
  const [address, setAddress] = useState(BRAND.address);

  useEffect(() => {
    let live = true;
    fetch("/api/cafe-settings")
      .then((res) => res.json())
      .then((data) => {
        const next = typeof data?.settings?.address === "string" ? data.settings.address.trim() : "";
        if (live && next) setAddress(next);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return {
    address,
    location: BRAND.location,
    mapSrc: googleMapsEmbed(address),
  };
}
