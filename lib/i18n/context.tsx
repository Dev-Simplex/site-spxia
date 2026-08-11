"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import pt, { type Dictionary } from "./pt"
import en from "./en"

export type Locale = "pt" | "en"

const translations: Record<Locale, Dictionary> = { pt, en }
const STORAGE_KEY = "spxia-lang"

interface I18nValue {
  t: Dictionary
  locale: Locale
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default pt; a preferência salva entra depois da hidratação para não divergir do SSR
  const [locale, setLocaleState] = useState<Locale>("pt")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "pt" || saved === "en") {
      setLocaleState(saved)
      document.documentElement.lang = translations[saved].lang
    }
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = translations[next].lang
  }

  const toggle = () => setLocale(locale === "pt" ? "en" : "pt")

  return (
    <I18nContext.Provider value={{ t: translations[locale], locale, setLocale, toggle }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n deve ser usado dentro de <I18nProvider>")
  }
  return ctx
}
