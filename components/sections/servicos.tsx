"use client"

import dynamic from "next/dynamic"
import type { LucideIcon } from "lucide-react"
import {
  Bot,
  Brain,
  Code,
  GraduationCap,
  Handshake,
  Workflow,
} from "lucide-react"

import { MagicCard } from "@/components/ui/magic-card"
import { ServiceGlyph, type ServiceGlyphVariant } from "@/components/ui/service-glyph"
import { ShimmerText } from "@/components/ui/shimmer-text"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"

import "@/components/ui/section-effects.css"

// Halo decorativo (aria-hidden), um por card: fora do bundle inicial e do HTML.
const GlowingEffect = dynamic(
  () => import("@/components/ui/glowing-effect").then((m) => m.GlowingEffect),
  { ssr: false },
)

const copy = {
  pt: {
    number: "02",
    label: "SERVIÇOS",
    title: "Tudo que seu negócio precisa para",
    titleEm: "lucrar com IA.",
    desc: "Da estratégia ao código. Do treinamento ao monitoramento. Soluções completas.",
    items: [
      {
        tag: "ESTRATÉGIA",
        title: "Consultoria em IA",
        desc: "Diagnóstico do seu negócio, identificação de oportunidades e elaboração de roadmap de implementação de IA com ROI projetado.",
      },
      {
        tag: "DESENVOLVIMENTO",
        title: "Desenvolvimento de Sistemas",
        desc: "Criação de sistemas sob medida: SaaS, plataformas web, aplicações internas, APIs e integrações com IA embarcada.",
      },
      {
        tag: "AUTOMAÇÃO",
        title: "Automações Inteligentes",
        desc: "Workflows automatizados com n8n, WhatsApp, CRM, financeiro, e-mail e qualquer API. Monitorados 24/7.",
      },
      {
        tag: "INTELIGÊNCIA ARTIFICIAL",
        title: "Projetos de IA",
        desc: "Elaboração e implementação de projetos com agentes de IA, chatbots, análise de dados, geração de conteúdo e assistentes virtuais.",
      },
      {
        tag: "EDUCAÇÃO",
        title: "Mentoria e Treinamento",
        desc: "Programas de capacitação para times e líderes: como usar IA no dia a dia, ferramentas práticas, estratégia e implementação.",
      },
      {
        tag: "PARCERIA",
        title: "Assessoria Contínua",
        desc: "Acompanhamento mensal do seu negócio: evolução dos projetos, novas oportunidades de IA, suporte técnico e estratégico.",
      },
    ],
  },
  en: {
    number: "02",
    label: "SERVICES",
    title: "Everything your business needs to",
    titleEm: "profit with AI.",
    desc: "From strategy to code. From training to monitoring. Complete solutions.",
    items: [
      {
        tag: "STRATEGY",
        title: "AI Consulting",
        desc: "Business diagnosis, opportunity identification and AI implementation roadmap with projected ROI.",
      },
      {
        tag: "DEVELOPMENT",
        title: "System Development",
        desc: "Custom-built systems: SaaS, web platforms, internal apps, APIs and integrations with embedded AI.",
      },
      {
        tag: "AUTOMATION",
        title: "Intelligent Automations",
        desc: "Automated workflows with n8n, WhatsApp, CRM, finance, email and any API. Monitored 24/7.",
      },
      {
        tag: "ARTIFICIAL INTELLIGENCE",
        title: "AI Projects",
        desc: "Design and implementation of projects with AI agents, chatbots, data analysis, content generation and virtual assistants.",
      },
      {
        tag: "EDUCATION",
        title: "Mentoring & Training",
        desc: "Training programs for teams and leaders: how to use AI daily, practical tools, strategy and implementation.",
      },
      {
        tag: "PARTNERSHIP",
        title: "Ongoing Advisory",
        desc: "Monthly follow-up on your business: project evolution, new AI opportunities, technical and strategic support.",
      },
    ],
  },
} as const

const icons: readonly LucideIcon[] = [
  Brain,
  Code,
  Workflow,
  Bot,
  GraduationCap,
  Handshake,
]

/** Mockup SVG de fundo de cada card — mesma ordem dos itens da seção. */
const glyphs: readonly ServiceGlyphVariant[] = [
  "strategy",
  "code",
  "workflow",
  "chat",
  "learning",
  "partnership",
]

export function Servicos() {
  const { locale } = useI18n()
  const t = copy[locale]
  const scope = useAnimationScope<HTMLElement>()

  return (
    <section
      {...scope}
      id="servicos"
      className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-32"
    >
      {/* Aurora fria no canto do header — único efeito de fundo desta seção,
          já que os cards carregam MagicCard + GlowingEffect. */}
      <div
        aria-hidden="true"
        className="spx-breathe pointer-events-none absolute -top-24 left-0 h-[28rem] w-full bg-[radial-gradient(38%_55%_at_22%_40%,rgba(249,1,8,0.24),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-primary-text">
            <span>{t.number}</span>
            <span
              aria-hidden="true"
              className="relative h-px w-8 overflow-hidden bg-primary/40"
            >
              <span className="spx-sweep absolute inset-y-0 left-0 w-1/2 bg-primary [--spx-sweep-duration:4s]" />
            </span>
            {/* Base clareada: #f90108 dá 4.17:1 neste corpo de 11px (AA pede 4.5). */}
            <ShimmerText baseColor="#ff4a4f" highlightColor="#ffb3b5">
              {t.label}
            </ShimmerText>
          </div>

          <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            {t.title}{" "}
            <em className="italic text-primary [text-shadow:0_0_44px_rgba(249,1,8,0.4)]">
              {t.titleEm}
            </em>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.desc}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((service, index) => {
            const Icon = icons[index]

            return (
              <MagicCard
                key={service.title}
                className="h-full rounded-2xl bg-[#212121]"
                gradientColor="#f90108"
                gradientFrom="#f90108"
                gradientTo="#7a1b1e"
                gradientOpacity={0.12}
                gradientSize={260}
              >
                <GlowingEffect
                  glow
                  disabled={false}
                  proximity={72}
                  spread={34}
                  borderWidth={1.25}
                />

                {/* Mockup do serviço em SVG puro, atrás do texto */}
                <ServiceGlyph
                  variant={glyphs[index]}
                  className="absolute -bottom-3 -right-3 w-44 text-foreground opacity-[0.07] transition-all duration-500 group-hover:-bottom-1 group-hover:-right-1 group-hover:text-primary group-hover:opacity-[0.22] sm:w-52"
                />

                <article className="relative flex min-h-80 h-full flex-col p-7 sm:p-8">
                  <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">
                    {service.tag}
                  </span>

                  <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition duration-300 group-hover:border-primary/50 group-hover:bg-primary/15 group-hover:shadow-[0_0_28px_-6px_rgba(249,1,8,0.85)]">
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="mt-7 font-serif text-2xl leading-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                    {service.desc}
                  </p>
                </article>
              </MagicCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
