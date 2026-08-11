"use client"

import dynamic from "next/dynamic"
import { ChevronRight } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { GlareCard } from "@/components/ui/glare-card"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"

// Rastros decorativos (aria-hidden), um por card: fora do bundle inicial.
const Meteors = dynamic(() => import("@/components/ui/meteors").then((m) => m.Meteors), {
  ssr: false,
})

// Textos copiados de legacy/src/i18n/{pt,en}.js (seção mentoria).
const copy = {
  pt: {
    number: "06",
    label: "MENTORIA E TREINAMENTO",
    title: "Conhecimento que",
    titleEm: "gera resultado.",
    desc: "Programas práticos para líderes e times. Sem teoria vazia: tudo aplicado ao seu contexto.",
    counterLabel: "empresas atendidas",
    programs: [
      {
        audience: "CEOs, diretores, gestores",
        title: "IA para Líderes de Negócio",
        topics: [
          "Panorama real de IA em 2026",
          "Onde IA gera receita vs onde queima caixa",
          "Como avaliar fornecedores e projetos",
          "Roadmap prático para sua empresa",
        ],
      },
      {
        audience: "Desenvolvedores, tech leads, analistas",
        title: "IA para Times Técnicos",
        topics: [
          "Claude Code e agentes na prática",
          "Automações com n8n e APIs",
          "Integração de IA em sistemas existentes",
          "Boas práticas e armadilhas",
        ],
      },
      {
        audience: "Empreendedores e profissionais",
        title: "Mentoria Individual",
        topics: [
          "Diagnóstico personalizado",
          "Plano de implementação sob medida",
          "Acompanhamento semanal",
          "Acesso direto ao time SPXIA",
        ],
      },
    ],
  },
  en: {
    number: "06",
    label: "MENTORING & TRAINING",
    title: "Knowledge that",
    titleEm: "drives results.",
    desc: "Practical programs for leaders and teams. No empty theory: everything applied to your context.",
    counterLabel: "companies served",
    programs: [
      {
        audience: "CEOs, directors, managers",
        title: "AI for Business Leaders",
        topics: [
          "Real AI landscape in 2026",
          "Where AI generates revenue vs burns cash",
          "How to evaluate vendors and projects",
          "Practical roadmap for your company",
        ],
      },
      {
        audience: "Developers, tech leads, analysts",
        title: "AI for Technical Teams",
        topics: [
          "Claude Code and agents in practice",
          "Automations with n8n and APIs",
          "AI integration into existing systems",
          "Best practices and pitfalls",
        ],
      },
      {
        audience: "Entrepreneurs and professionals",
        title: "Individual Mentoring",
        topics: [
          "Personalized diagnosis",
          "Custom implementation plan",
          "Weekly follow-up",
          "Direct access to SPXIA team",
        ],
      },
    ],
  },
} as const

// Iniciais fictícias — a tarefa pede círculos gerados, sem fotos reais.
const avatars = [
  { initials: "MC" },
  { initials: "RS" },
  { initials: "AL" },
  { initials: "JP" },
  { initials: "TF" },
]

export function Mentoria() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reduceMotion = useReducedMotion()
  const scope = useAnimationScope<HTMLElement>()

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 30,
      filter: reduceMotion ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: "easeOut" },
      // Limpa o filter para o GlareCard voltar a compor sem camada rasterizada.
      transitionEnd: { filter: "none" },
    },
  }

  return (
    <section {...scope} id="mentoria" className="bg-background py-24 sm:py-28 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary-text">
            {t.number} · {t.label}
          </p>
          <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
            {t.title} <em className="italic text-primary">{t.titleEm}</em>
          </h2>
          <p className="mt-4 text-muted-foreground">{t.desc}</p>
        </div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {t.programs.map((program, index) => (
            <motion.div key={program.title} variants={cardVariants} className="group relative h-full">
              <GlareCard className="flex flex-col p-8">
                <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.15em] text-primary-text">
                  {program.audience}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-foreground">
                  {program.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {program.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </GlareCard>

              {/* Meteoros passam por cima do card; o clip acompanha o raio do GlareCard. */}
              <Meteors
                number={7 + index}
                className="rounded-[20px] opacity-60 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AvatarCircles avatars={avatars} numPeople={50} />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {t.counterLabel}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
