"use client"

import dynamic from "next/dynamic"
import { Mail, MapPin } from "lucide-react"

import { DotPattern } from "@/components/ui/dot-pattern"
import { UnderlineLink } from "@/components/ui/underline-link"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"

// Lettering decorativo no rodapé (mantém aria-label): fora do bundle inicial.
const TextHoverEffect = dynamic(
  () => import("@/components/ui/text-hover-effect").then((m) => m.TextHoverEffect),
  { ssr: false },
)

const labels = {
  pt: {
    navigation: "NAVEGAÇÃO",
    contact: "CONTATO",
    legal: "LEGAL",
    privacy: "POLÍTICA DE PRIVACIDADE",
    terms: "TERMOS DE USO",
    origin: "FEITO EM MATO GROSSO, BRASIL",
  },
  en: {
    navigation: "NAVIGATION",
    contact: "CONTACT",
    legal: "LEGAL",
    privacy: "PRIVACY POLICY",
    terms: "TERMS OF USE",
    origin: "MADE IN MATO GROSSO, BRAZIL",
  },
} as const

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
      <span aria-hidden="true" className="h-3 w-px bg-primary" />
      {children}
    </h2>
  )
}

export function Footer() {
  const { t, locale } = useI18n()
  const ui = labels[locale]
  const scope = useAnimationScope<HTMLElement>()
  const navigation = [
    { href: "#sobre", label: t.nav.sobre },
    { href: "#servicos", label: t.nav.servicos },
    { href: "#como-funciona", label: t.nav.comoFunciona },
    { href: "#cases", label: t.nav.cases },
    { href: "#mentoria", label: t.nav.mentoria },
    { href: "#contato", label: t.nav.cta },
  ]

  return (
    <footer {...scope} className="relative isolate overflow-hidden border-t border-border bg-[#111111]">
      <DotPattern
        width={24}
        height={24}
        cr={0.7}
        className="text-white/[0.045] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="relative">
          {/* Brasa vermelha por trás do lettering — só some junto com o texto */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-primary/[0.09] blur-[70px]"
          />
          <div className="h-40 w-full sm:h-56 lg:h-72">
            <TextHoverEffect
              text="SPXIA"
              duration={0.18}
              className="cursor-crosshair select-none [mask-image:linear-gradient(to_bottom,black_0%,black_58%,transparent_100%)]"
            />
          </div>
        </div>

        <div className="grid gap-12 border-t border-border py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
          <div>
            <ColumnTitle>{ui.navigation}</ColumnTitle>
            <nav aria-label={ui.navigation} className="mt-6">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <UnderlineLink href={item.href} className="py-1 text-sm">
                      {item.label}
                    </UnderlineLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <ColumnTitle>{ui.contact}</ColumnTitle>
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <UnderlineLink
                href={`mailto:${t.contato.email}`}
                className="gap-3 py-1 text-sm"
              >
                <Mail
                  aria-hidden="true"
                  className="h-4 w-4 text-primary transition-transform duration-300 ease-out group-hover/underline:-translate-y-px group-hover/underline:scale-110 motion-reduce:transform-none"
                />
                {t.contato.email}
              </UnderlineLink>
              <p className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="h-4 w-4 text-primary" />
                {t.contato.location}
              </p>
            </div>
          </div>

          <div>
            <ColumnTitle>{ui.legal}</ColumnTitle>
            <ul className="mt-6 space-y-3">
              <li>
                <UnderlineLink href="/privacidade" className="py-1 text-sm">
                  {ui.privacy}
                </UnderlineLink>
              </li>
              <li>
                <UnderlineLink href="/termos" className="py-1 text-sm">
                  {ui.terms}
                </UnderlineLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          {/* Sem alpha: #888 a 55–80% sobre #111 fica entre 2.4:1 e 4.2:1 —
              abaixo do AA (4.5:1) para este corpo de 10px. Cheio dá 5.33:1. */}
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
            {t.footer.copy}
          </p>
          <p className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary" />
            {ui.origin}
          </p>
        </div>

        {/* Identificação legal da pessoa jurídica — exigida nas páginas do app Chat SPX */}
        <p className="pt-4 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
          SPX Inteligência e Desenvolvimento LTDA · CNPJ 68.387.997/0001-18
        </p>
      </div>
    </footer>
  )
}
