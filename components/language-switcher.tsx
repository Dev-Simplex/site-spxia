"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useI18n, type Locale } from "@/lib/i18n/context"

const options: { locale: Locale; flag: string; label: string; name: string }[] = [
  { locale: "pt", flag: "/flags/br.svg", label: "PT", name: "Português (Brasil)" },
  { locale: "en", flag: "/flags/us.svg", label: "EN", name: "English (US)" },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const current = options.find((o) => o.locale === locale) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // Padrão listbox: ao abrir, o foco vai para a opção do idioma ativo
  useEffect(() => {
    if (!open) return
    const idx = options.findIndex((o) => o.locale === locale)
    optionRefs.current[idx]?.focus()
  }, [open, locale])

  const closeAndRefocus = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const selectOption = (next: Locale) => {
    setLocale(next)
    closeAndRefocus()
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedIdx = optionRefs.current.findIndex((el) => el === document.activeElement)
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const delta = e.key === "ArrowDown" ? 1 : -1
      const next = (focusedIdx + delta + options.length) % options.length
      optionRefs.current[next]?.focus()
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault()
      optionRefs.current[e.key === "Home" ? 0 : options.length - 1]?.focus()
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeAndRefocus()
    } else if (e.key === "Tab") {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={locale === "pt" ? "Selecionar idioma" : "Select language"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-300 border border-[#333] bg-[rgba(31,31,31,0.62)] rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.flag} alt="" width={16} height={16} className="rounded-full" />
        <span>{current.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            aria-label={locale === "pt" ? "Idiomas" : "Languages"}
            onKeyDown={onListKeyDown}
            className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-1 shadow-lg shadow-black/50"
          >
            {options.map((option, i) => {
              const selected = option.locale === locale
              return (
                <button
                  key={option.locale}
                  ref={(el) => {
                    optionRefs.current[i] = el
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  onClick={() => selectOption(option.locale)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 focus:outline-none focus-visible:bg-white/10 ${
                    selected
                      ? "bg-white/[0.06] text-white"
                      : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={option.flag} alt="" width={18} height={18} className="rounded-full" />
                  <span className="flex-1 whitespace-nowrap">{option.name}</span>
                  {selected && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
