"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "EN",
  zh: "中文",
  th: "ไทย",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("locale");

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-1 py-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            locale === loc
              ? "bg-white text-amber-700"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
