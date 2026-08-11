"use client"

import dynamic from "next/dynamic"
import type { LucideIcon } from "lucide-react"
import { Cog, Handshake, Target, Zap } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { PanelMock } from "@/components/ui/panel-mock"
import { ShimmerText } from "@/components/ui/shimmer-text"
import {
  TextureCard,
  TextureCardContent,
  TextureCardDescription,
  TextureCardTitle,
} from "@/components/ui/texture-card"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n, type Locale } from "@/lib/i18n/context"

import "@/components/ui/section-effects.css"

// Fundo decorativo (aria-hidden): sai do bundle inicial e do HTML do servidor.
const AnimatedGridPattern = dynamic(
  () => import("@/components/ui/animated-grid-pattern").then((m) => m.AnimatedGridPattern),
  { ssr: false },
)

interface Value {
  title: string
  desc: string
}

interface SectionCopy {
  number: string
  label: string
  title: string
  titleEm: string
  p1: string
  p2: string
  values: Value[]
}

const copy: Record<Locale, SectionCopy> = {
  pt: {
    number: "01",
    label: "QUEM SOMOS",
    title: "A SPXIA transforma negócios com",
    titleEm: "inteligência artificial aplicada.",
    p1: "Somos a divisão de inteligência e automação da Simplex Soluções. Atuamos como parceiros estratégicos de empresas que querem usar IA para resolver problemas reais, não para seguir tendências.",
    p2: "Da consultoria ao desenvolvimento, da automação ao treinamento: entregamos projetos completos, com metodologia própria, testados em produção e focados em retorno financeiro.",
    values: [
      {
        title: "Estratégia + Execução",
        desc: "Não entregamos slides. Entregamos sistemas rodando, automações funcionando e equipes treinadas.",
      },
      {
        title: "Rigor de Engenharia",
        desc: "Cada projeto com arquitetura, testes e monitoramento. Zero improviso.",
      },
      {
        title: "Resultados Rápidos",
        desc: "Primeiras automações no ar em semanas. ROI mensurável desde o primeiro mês.",
      },
      {
        title: "Parceria de Longo Prazo",
        desc: "Assessoria contínua, não projeto-e-adeus. Crescemos junto com seu negócio.",
      },
    ],
  },
  en: {
    number: "01",
    label: "ABOUT US",
    title: "SPXIA transforms businesses with",
    titleEm: "applied artificial intelligence.",
    p1: "We are the intelligence and automation division of Simplex Soluções. We act as strategic partners for companies that want to use AI to solve real problems, not to follow trends.",
    p2: "From consulting to development, from automation to training: we deliver complete projects with our own methodology, tested in production and focused on financial return.",
    values: [
      {
        title: "Strategy + Execution",
        desc: "We don't deliver slides. We deliver running systems, working automations and trained teams.",
      },
      {
        title: "Engineering Rigor",
        desc: "Every project with architecture, testing and monitoring. Zero improvisation.",
      },
      {
        title: "Fast Results",
        desc: "First automations live within weeks. Measurable ROI from the first month.",
      },
      {
        title: "Long-Term Partnership",
        desc: "Ongoing advisory, not build-and-leave. We grow alongside your business.",
      },
    ],
  },
}

const valueIcons: LucideIcon[] = [Target, Cog, Zap, Handshake]

export function Sobre() {
  const { locale } = useI18n()
  const c = copy[locale]
  const scope = useAnimationScope<HTMLElement>()

  return (
    <section {...scope} id="sobre" className="relative scroll-mt-24 overflow-hidden bg-background">
      {/* Fundo: malha viva (MagicUI animated-grid-pattern) sob máscara radial */}
      <AnimatedGridPattern
        numSquares={26}
        maxOpacity={0.06}
        duration={5}
        repeatDelay={1}
        width={44}
        height={44}
        className="[mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)] text-primary"
      />
      <div
        aria-hidden
        className="spx-breathe pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(249,1,8,0.18),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-8 md:py-32 lg:px-10">
        <BlurFade inView delay={0.05}>
          <div className="mb-8 flex items-center gap-3">
            <span className="font-serif text-4xl leading-none text-primary [text-shadow:0_0_28px_rgba(249,1,8,0.55)]">
              {c.number}
            </span>
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em]">
              {/* Base clareada: #f90108 dá 4.17:1 neste corpo de 10px (AA pede 4.5). */}
              <ShimmerText baseColor="#ff4a4f" highlightColor="#ffb3b5">
                {c.label}
              </ShimmerText>
            </span>
          </div>
        </BlurFade>

        {/* Colunas esticam juntas: com items-start os 4 cards terminavam ~200px
            acima do mock @1440, deixando um retângulo morto no canto direito. */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <BlurFade inView delay={0.1}>
              <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">
                {c.title}{" "}
                <em className="text-primary [text-shadow:0_0_36px_rgba(249,1,8,0.35)]">
                  {c.titleEm}
                </em>
              </h2>
            </BlurFade>
            <BlurFade inView delay={0.18}>
              <p className="mt-5 leading-relaxed text-muted-foreground">{c.p1}</p>
            </BlurFade>
            <BlurFade inView delay={0.26}>
              <p className="mt-4 leading-relaxed text-muted-foreground">{c.p2}</p>
            </BlurFade>
            <BlurFade inView delay={0.34}>
              <PanelMock className="spx-float mt-10 [--spx-float-duration:9s]" />
            </BlurFade>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {c.values.map((value, i) => {
              const Icon = valueIcons[i]
              return (
                <BlurFade key={value.title} inView delay={0.3 + i * 0.08} className="h-full">
                  <div className="group relative h-full">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-2 rounded-[calc(var(--radius)+8px)] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(249,1,8,0.28),transparent_70%)] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <TextureCard className="relative h-full transition duration-500 group-hover:-translate-y-1 group-hover:border-primary/25">
                      <TextureCardContent className="flex h-full flex-col px-6 py-6">
                        <span className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 transition duration-300 group-hover:border-primary/50 group-hover:bg-primary/15 group-hover:shadow-[0_0_24px_-4px_rgba(249,1,8,0.7)]">
                          <Icon
                            className="size-5 text-primary transition-transform duration-300 group-hover:scale-110"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                        </span>
                        <TextureCardTitle className="mt-4 pl-0 text-base">
                          {value.title}
                        </TextureCardTitle>
                        <TextureCardDescription className="mt-2 pl-0 text-[0.8125rem] leading-relaxed">
                          {value.desc}
                        </TextureCardDescription>
                      </TextureCardContent>
                    </TextureCard>
                  </div>
                </BlurFade>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
