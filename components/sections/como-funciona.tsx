"use client"

import { LampBeam } from "@/components/ui/lamp-beam"
import { ShimmerText } from "@/components/ui/shimmer-text"
import { Timeline } from "@/components/ui/timeline"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n, type Locale } from "@/lib/i18n/context"

import "@/components/ui/section-effects.css"

interface Step {
  num: string
  title: string
  desc: string
  detail: string
}

interface SectionCopy {
  number: string
  label: string
  title: string
  titleEm: string
  desc: string
  steps: Step[]
}

const copy: Record<Locale, SectionCopy> = {
  pt: {
    number: "03",
    label: "COMO FUNCIONA",
    title: "Do diagnóstico ao",
    titleEm: "resultado.",
    desc: "Processo claro, sem surpresas. Você acompanha cada etapa.",
    steps: [
      {
        num: "01",
        title: "Diagnóstico",
        desc: "Analisamos seu negócio, processos e oportunidades. Identificamos onde IA gera mais impacto financeiro.",
        detail: "Reunião inicial + relatório com ROI projetado",
      },
      {
        num: "02",
        title: "Estratégia",
        desc: "Desenhamos o roadmap: quais projetos, em que ordem, com quais ferramentas e qual investimento.",
        detail: "Plano de ação com cronograma e entregáveis",
      },
      {
        num: "03",
        title: "Execução",
        desc: "Desenvolvemos os sistemas, automações e integrações. Tudo com arquitetura, testes e documentação.",
        detail: "Entregas semanais com validação do cliente",
      },
      {
        num: "04",
        title: "Evolução",
        desc: "Monitoramos, otimizamos e expandimos. Assessoria contínua para garantir que o resultado cresça.",
        detail: "Acompanhamento mensal + novas oportunidades",
      },
    ],
  },
  en: {
    number: "03",
    label: "HOW IT WORKS",
    title: "From diagnosis to",
    titleEm: "results.",
    desc: "Clear process, no surprises. You follow every step.",
    steps: [
      {
        num: "01",
        title: "Diagnosis",
        desc: "We analyze your business, processes and opportunities. We identify where AI generates the most financial impact.",
        detail: "Initial meeting + report with projected ROI",
      },
      {
        num: "02",
        title: "Strategy",
        desc: "We design the roadmap: which projects, in what order, with which tools and what investment.",
        detail: "Action plan with timeline and deliverables",
      },
      {
        num: "03",
        title: "Execution",
        desc: "We develop systems, automations and integrations. Everything with architecture, tests and documentation.",
        detail: "Weekly deliveries with client validation",
      },
      {
        num: "04",
        title: "Evolution",
        desc: "We monitor, optimize and expand. Ongoing advisory to ensure results keep growing.",
        detail: "Monthly follow-up + new opportunities",
      },
    ],
  },
}

export function ComoFunciona() {
  const { locale } = useI18n()
  const c = copy[locale]
  const scope = useAnimationScope<HTMLElement>()

  return (
    <section {...scope} id="como-funciona" className="relative scroll-mt-24 overflow-hidden bg-card">
      {/* Abertura: feixe de lâmpada (Aceternity lamp) acendendo sobre o título */}
      <LampBeam backgroundColor="var(--card)" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 text-center md:px-8 md:pt-36 lg:px-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="font-serif text-4xl leading-none text-primary [text-shadow:0_0_28px_rgba(249,1,8,0.6)]">
            {c.number}
          </span>
          <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em]">
            <ShimmerText>{c.label}</ShimmerText>
          </span>
        </div>
        <h2 className="mx-auto max-w-4xl font-serif text-3xl leading-tight text-foreground md:text-4xl">
          {c.title}{" "}
          <em className="text-primary [text-shadow:0_0_40px_rgba(249,1,8,0.45)]">
            {c.titleEm}
          </em>
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-muted-foreground">{c.desc}</p>
      </div>

      <div className="relative z-10">
        <Timeline
          data={c.steps.map((step) => ({
            title: step.title,
            content: (
              <div className="group/step">
                <span className="relative inline-block font-serif text-6xl leading-none text-primary [text-shadow:0_0_44px_rgba(249,1,8,0.45)] md:text-7xl">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(249,1,8,0.22),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/step:opacity-100"
                  />
                  {step.num}
                </span>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                  {step.desc}
                </p>
                <code className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-background/60 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover/step:border-primary/30 md:text-sm">
                  <span aria-hidden className="spx-blink size-1.5 rounded-full bg-primary" />
                  {step.detail}
                </code>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  )
}
