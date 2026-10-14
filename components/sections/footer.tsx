"use client"

import { motion } from "motion/react"

import { Logo } from "@/components/logo"
import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

// Identificação legal da pessoa jurídica — exigida nas páginas do app Chat SPX
const LEGAL_ENTITY = "SPX Inteligência e Desenvolvimento LTDA · CNPJ 68.387.997/0001-18"

const linkClass =
  "rounded-sm transition-colors hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

export function Footer() {
  const { t } = useI18n()
  const f = t.footer
  const reveal = useReveal()

  // Âncoras com "/" na frente: o rodapé também aparece nas páginas legais.
  const columns = [
    {
      title: f.navigation,
      className: "",
      links: [
        { href: "/#servicos", label: t.nav.servicos },
        { href: "/#como-funciona", label: t.nav.comoFunciona },
        { href: "/#cases", label: t.nav.cases },
        { href: "/#mentoria", label: t.nav.mentoria },
        { href: "/#faq", label: f.faq },
      ],
    },
    {
      title: f.solutions,
      className: "",
      links: f.solutionItems.map((label) => ({ href: "/#servicos", label })),
    },
    {
      title: f.contact,
      className: "col-span-2 sm:col-span-1",
      links: [
        { href: `mailto:${t.contato.email}`, label: t.contato.email },
        { href: "/diagnostico", label: f.schedule },
        { href: "/login", label: f.clientArea },
      ],
    },
  ]

  return (
    // A outra faixa escura do site (decisão 3): Azul Profundo.
    <footer className="bg-brand-deep text-white/75">
      <motion.div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-16 md:px-8 md:pt-20 lg:px-10" {...reveal()}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a href="/" className={`inline-block ${linkClass}`}>
              <Logo height={30} tone="white" />
            </a>
            <p className="mt-5 max-w-[300px] text-[0.9375rem]">{f.tagline}</p>
            <p className="mt-3 text-[0.9375rem]">{t.contato.location}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className={column.className}>
              <h2 className="text-sm font-semibold text-white">{column.title}</h2>
              <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {f.copy} · {LEGAL_ENTITY}
          </p>
          <nav aria-label={f.legal} className="flex gap-5">
            <a href="/privacidade" className={linkClass}>
              {f.privacy}
            </a>
            <a href="/termos" className={linkClass}>
              {f.terms}
            </a>
          </nav>
        </div>
      </motion.div>
    </footer>
  )
}
