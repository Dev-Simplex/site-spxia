"use client"

import dynamic from "next/dynamic"
import { Check, TriangleAlert, X } from "lucide-react"

import { StickyScroll, type StickyScrollItem } from "@/components/ui/sticky-scroll-reveal"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

import "@/components/ui/section-effects.css"

// Feixes decorativos (aria-hidden): fora do bundle inicial e do HTML do servidor.
const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then((m) => m.BackgroundBeams),
  { ssr: false },
)

// Conteúdo real migrado de legacy/src/i18n/{pt,en}.js — mantido local à seção
const copy = {
  pt: {
    callout: {
      pre: "A maioria das empresas ",
      em: "está perdendo dinheiro",
      post: " com IA.",
    },
    text: "Investem em ferramentas, contratam cursos rasos e tentam implementar sozinhas. O resultado: projetos abandonados, equipes frustradas e zero retorno. A SPXIA existe pra mudar isso.",
    semTitle: "SEM A SPXIA",
    comTitle: "COM A SPXIA",
    semItems: [
      "Equipe perdida entre dezenas de ferramentas de IA",
      "Automações que quebram e ninguém sabe consertar",
      "Investimento em tecnologia sem retorno claro",
      "Projetos de IA que nunca saem do PowerPoint",
      "Fornecedores que entregam e somem",
    ],
    comItems: [
      "Estratégia clara: qual IA usar, onde e por quê",
      "Automações monitoradas, com fallback e alertas",
      "ROI documentado desde o primeiro mês",
      "Projetos em produção com dados reais",
      "Assessoria contínua e evolução constante",
    ],
  },
  en: {
    callout: {
      pre: "Most companies are ",
      em: "losing money",
      post: " with AI.",
    },
    text: "They invest in tools, hire shallow courses and try to implement alone. The result: abandoned projects, frustrated teams and zero return. SPXIA exists to change that.",
    semTitle: "WITHOUT SPXIA",
    comTitle: "WITH SPXIA",
    semItems: [
      "Team lost among dozens of AI tools",
      "Automations that break and no one can fix",
      "Tech investment with no clear return",
      "AI projects that never leave PowerPoint",
      "Vendors that deliver and disappear",
    ],
    comItems: [
      "Clear strategy: which AI to use, where and why",
      "Monitored automations with fallback and alerts",
      "Documented ROI from the first month",
      "Projects in production with real data",
      "Continuous advisory and constant evolution",
    ],
  },
} as const

function ItemList({
  items,
  polarity,
}: {
  items: readonly string[]
  polarity: "sem" | "com"
}) {
  const Icon = polarity === "sem" ? X : Check
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="group/item flex items-start gap-3 rounded-lg px-2 py-1.5 transition-colors duration-300 hover:bg-white/[0.03]"
        >
          <span
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition duration-300",
              polarity === "sem"
                ? "border-primary/30 bg-primary/10 group-hover/item:border-primary/60 group-hover/item:shadow-[0_0_18px_-4px_rgba(249,1,8,0.8)]"
                : "border-[#4ade80]/30 bg-[#4ade80]/10 group-hover/item:border-[#4ade80]/60 group-hover/item:shadow-[0_0_18px_-4px_rgba(74,222,128,0.7)]",
            )}
          >
            <Icon
              aria-hidden
              strokeWidth={2.5}
              className={cn(
                "size-3.5 transition-transform duration-300 group-hover/item:scale-110",
                polarity === "sem" ? "text-primary" : "text-[#4ade80]",
              )}
            />
          </span>
          <span className="text-sm leading-relaxed transition-colors duration-300 group-hover/item:text-foreground md:text-base">
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

function StepPanel({ label, polarity }: { label: string; polarity: "sem" | "com" }) {
  const Icon = polarity === "sem" ? X : Check
  const tint = polarity === "sem" ? "rgba(249,1,8,0.22)" : "rgba(74,222,128,0.2)"

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden">
      <div
        aria-hidden
        className="spx-breathe pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(45% 45% at 50% 42%, ${tint}, transparent 70%)`,
        }}
      />

      <div className="relative flex size-16 items-center justify-center">
        {/* Ondas concêntricas saindo do selo */}
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "spx-ring absolute inset-0 rounded-full border",
              polarity === "sem" ? "border-primary/50" : "border-[#4ade80]/50",
            )}
            style={{ animationDelay: `${i * 1.4}s` }}
          />
        ))}
        <div
          className={cn(
            "relative flex size-16 items-center justify-center rounded-full border",
            polarity === "sem"
              ? "border-primary/40 bg-primary/10 shadow-[0_0_36px_-8px_rgba(249,1,8,0.9)]"
              : "border-[#4ade80]/40 bg-[#4ade80]/10 shadow-[0_0_36px_-8px_rgba(74,222,128,0.8)]",
          )}
        >
          <Icon
            aria-hidden
            strokeWidth={2.5}
            className={cn("size-8", polarity === "sem" ? "text-primary" : "text-[#4ade80]")}
          />
        </div>
      </div>

      <span className="relative font-mono text-xs tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function Problema() {
  const { locale } = useI18n()
  const t = copy[locale]
  const scope = useAnimationScope<HTMLElement>()

  const steps: StickyScrollItem[] = [
    {
      title: t.semTitle,
      description: <ItemList items={t.semItems} polarity="sem" />,
      content: <StepPanel label={t.semTitle} polarity="sem" />,
    },
    {
      title: t.comTitle,
      description: <ItemList items={t.comItems} polarity="com" />,
      content: <StepPanel label={t.comTitle} polarity="com" />,
    },
  ]

  return (
    <section {...scope} id="problema" className="relative overflow-hidden bg-card py-24 sm:py-28 lg:py-32">
      {/* Fundo: feixes (Aceternity background-beams) recolorados na paleta SPX */}
      <BackgroundBeams className="[mask-image:linear-gradient(to_bottom,black,black_55%,transparent)] opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(45%_100%_at_50%_0%,rgba(249,1,8,0.14),transparent_72%)]"
      />

      <div className="container relative mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative mx-auto flex size-12 items-center justify-center">
            {[0, 1].map((i) => (
              <span
                key={i}
                aria-hidden
                className="spx-ring absolute inset-0 rounded-full border border-primary/50"
                style={{ animationDelay: `${i * 1.4}s` }}
              />
            ))}
            <span className="relative flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-[0_0_40px_-8px_rgba(249,1,8,0.9)]">
              <TriangleAlert aria-hidden className="size-6 text-primary" />
            </span>
          </div>

          <h2 className="mt-6 text-balance font-serif text-3xl text-foreground md:text-4xl">
            {t.callout.pre}
            <em className="relative inline-block italic text-primary [text-shadow:0_0_32px_rgba(249,1,8,0.5)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
              {t.callout.em}
            </em>
            {t.callout.post}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t.text}</p>
        </div>

        <div className="mt-16">
          <StickyScroll content={steps} />
        </div>
      </div>
    </section>
  )
}
