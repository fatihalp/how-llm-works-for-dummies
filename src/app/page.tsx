"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserLang = window.navigator.language || (window.navigator as any).userLanguage || "";
      const locale = browserLang.toLowerCase().startsWith("tr") ? "tr" : "en";
      router.replace(`/${locale}`);
    }
  }, [router]);

  return null;
}
