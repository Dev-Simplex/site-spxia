"use client"

import { useI18n, type Locale } from "@/lib/i18n/context"

const options: { locale: Locale; flag: string; name: string }[] = [
  { locale: "pt", flag: "/flags/br.svg", name: "Português (Brasil)" },
  { locale: "en", flag: "/flags/us.svg", name: "English (US)" },
]

/** Pílula com as duas bandeiras; a do idioma ativo fica acesa. */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div
      role="group"
      aria-label={locale === "pt" ? "Selecionar idioma" : "Select language"}
      className="flex gap-1 rounded-full border border-border p-[3px]"
    >
      {options.map((option) => {
        const active = option.locale === locale
        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            aria-pressed={active}
            aria-label={option.name}
            title={option.name}
            className={`rounded-full p-[3px] transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-primary ${
              active ? "opacity-100" : "opacity-45 hover:opacity-80"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={option.flag} alt="" width={22} height={22} className="size-[22px] rounded-full" />
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
