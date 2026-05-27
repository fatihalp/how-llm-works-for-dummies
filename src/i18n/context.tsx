"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { translations, Locale } from "./translations";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  
  // Read locale from URL parameter dynamic route [locale]
  const locale: Locale = (params?.locale as Locale) === "tr" ? "tr" : "en";

  const setLocale = useCallback((newLocale: Locale) => {
    router.push(`/${newLocale}`);
  }, [router]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = translations[locale][key] || translations["en"][key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
