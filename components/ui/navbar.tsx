"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

const linkClass =
  "whitespace-nowrap rounded-md text-[0.9375rem] font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"

export function Navbar() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  // Sombra suave depois de 80 px de rolagem (REFERENCIAS P9); sem ela com
  // prefers-reduced-motion, onde a borda já basta.
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, reduceMotion ? 0 : 1])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  // "/#…" em vez de "#…": a navbar também aparece nas páginas legais.
  const links = [
    { label: t.nav.sobre, href: "/#sobre" },
    { label: t.nav.servicos, href: "/#servicos" },
    { label: t.nav.comoFunciona, href: "/#como-funciona" },
    { label: t.nav.cases, href: "/#cases" },
    { label: t.nav.mentoria, href: "/#mentoria" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <motion.div
        aria-hidden="true"
        style={{ opacity: shadowOpacity }}
        className="pointer-events-none absolute inset-0 -z-10 shadow-lg shadow-brand-deep/10"
      />
      <div className="mx-auto flex h-[76px] w-full max-w-[1248px] items-center justify-between gap-5 px-6 xl:gap-6">
        <Link href="/" aria-label={t.nav.inicio} className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <Logo height={30} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 xl:gap-[18px]">
          <div className="hidden items-center gap-4 lg:flex xl:gap-[18px]">
            <LanguageSwitcher />
            <Link href="/login" className={linkClass}>
              {t.nav.entrar}
            </Link>
          </div>
          <Button asChild className="hidden h-11 px-5 text-[0.9375rem] shadow-lg shadow-primary/30 sm:inline-flex">
            <Link href="/#contato">{t.nav.diagnostico}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            aria-label={isOpen ? t.nav.fecharMenu : t.nav.abrirMenu}
            className="-mr-2.5 grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
          >
            {isOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="menu-mobile"
          className="border-t border-border bg-background transition duration-200 ease-out starting:-translate-y-2 starting:opacity-0 lg:hidden"
        >
          <nav className="mx-auto flex w-full max-w-[1248px] flex-col px-6 py-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mx-auto flex w-full max-w-[1248px] items-center justify-between border-t border-border px-6 py-4">
            <LanguageSwitcher />
            <Link href="/login" onClick={close} className={`${linkClass} py-2`}>
              {t.nav.entrar}
            </Link>
          </div>
          <div className="mx-auto w-full max-w-[1248px] px-6 pb-6">
            <Button asChild size="lg" className="w-full">
              <Link href="/#contato" onClick={close}>
                {t.nav.diagnostico}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
