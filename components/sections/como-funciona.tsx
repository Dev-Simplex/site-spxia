"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useScroll } from "motion/react"

import { ShapePanel, useReveal } from "@/components/ui/motion-kit"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useI18n, type Locale } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  desc: string
}

interface SectionCopy {
  title: string
  titleEm: string
  desc: string
  steps: Step[]
  cta: string
  ctaNote: string
}

const copy: Record<Locale, SectionCopy> = {
  pt: {
    title: "Do diagnóstico ao",
    titleEm: "resultado.",
    desc: "Um passo de cada vez, e você acompanha todos eles.",
    cta: "Vamos conversar",
    ctaNote: "O diagnóstico é gratuito e sem compromisso.",
    steps: [
      { title: "Diagnóstico", desc: "Você conta como é a rotina e nós achamos o que mais toma tempo." },
      { title: "Estratégia", desc: "Mostramos o que simplificar primeiro, quanto custa e quanto tempo leva." },
      { title: "Execução", desc: "Configuramos tudo e conectamos ao seu CRM, testado antes de entrar no ar." },
      { title: "Evolução", desc: "Seguimos junto: ajustamos, treinamos a equipe e sugerimos o próximo passo." },
    ],
  },
  en: {
    title: "From diagnosis to",
    titleEm: "results.",
    desc: "One step at a time, and you follow every one.",
    cta: "Let's talk",
    ctaNote: "The diagnosis is free, with no commitment.",
    steps: [
      { title: "Diagnosis", desc: "You tell us how your day runs and we find what takes the most time." },
      { title: "Strategy", desc: "We show what to simplify first, what it costs and how long it takes." },
      { title: "Execution", desc: "We set everything up and connect it to your CRM, tested before going live." },
      { title: "Evolution", desc: "We stay with you: we fine-tune, train your team and suggest the next step." },
    ],
  },
}

// Mesma ordem dos passos; width/height reais de cada PNG.
const stepArt = [
  { src: "/images/ilustracoes/passo-1-diagnostico.png", width: 1000, height: 771 },
  { src: "/images/ilustracoes/passo-2-estrategia.png", width: 1200, height: 902 },
  { src: "/images/ilustracoes/passo-3-execucao.png", width: 1200, height: 933 },
  { src: "/images/ilustracoes/passo-4-evolucao.png", width: 1048, height: 1200 },
] as const

/**
 * P3 + P6 do REFERENCIAS. Desktop: o painel fica preso à esquerda e troca a
 * ilustração conforme o passo que cruza o meio da tela. Mobile: sem sticky, cada
 * passo traz a própria ilustração. A linha do tempo preenche nos dois.
 */
export function ComoFunciona() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reveal = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section id="como-funciona" className="scroll-mt-24 bg-background py-20 lg:py-30">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <motion.h2
            {...reveal()}
            className="text-balance text-[2.125rem] leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.875rem]"
          >
            {c.title} <strong className="font-bold">{c.titleEm}</strong>
          </motion.h2>
          <motion.p {...reveal(0.08)} className="mt-5 text-lg text-muted-foreground">
            {c.desc}
          </motion.p>
        </div>

        <div className="mt-12 grid gap-18 lg:mt-16 lg:grid-cols-2">
          <div aria-hidden className="hidden lg:block">
            <ShapePanel className="sticky top-28">
              {stepArt.map((art, i) => (
                <Image
                  key={art.src}
                  {...art}
                  alt=""
                  sizes="(min-width: 1280px) 420px, 34vw"
                  className={cn(
                    "col-start-1 row-start-1 h-auto max-h-[72%] w-[72%] object-contain transition duration-500 ease-out motion-reduce:transition-none",
                    i === active ? "scale-100 opacity-100" : "scale-95 opacity-0",
                  )}
                />
              ))}
            </ShapePanel>
          </div>

          <div>
            <ol>
              {c.steps.map((step, i) => (
                <StepItem
                  key={step.title}
                  step={step}
                  index={i}
                  isLast={i === c.steps.length - 1}
                  isReached={i <= active}
                  onReach={() => setActive(i)}
                />
              ))}
            </ol>
            <motion.div {...reveal(0.1)} className="mt-10 flex flex-col items-start gap-3 pl-[4.75rem] sm:flex-row sm:items-center sm:gap-5 lg:mt-2">
              <Button
                asChild
                size="lg"
                className="group h-[52px] px-[26px] shadow-lg shadow-primary/30 hover:-translate-y-px hover:shadow-xl hover:shadow-primary/35"
              >
                <Link href="/#contato">
                  {c.cta}
                  <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">{c.ctaNote}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface StepItemProps {
  step: Step
  index: number
  isLast: boolean
  isReached: boolean
  onReach: () => void
}

/**
 * Um passo da linha do tempo (P6 do REFERENCIAS). O trecho azul abaixo do círculo
 * cresce enquanto o passo cruza o meio da tela, e o círculo fica azul quando a
 * linha chega nele. Com prefers-reduced-motion a linha já vem cheia.
 */
function StepItem({ step, index, isLast, isReached, onReach }: StepItemProps) {
  const ref = useRef<HTMLLIElement>(null)
  const reveal = useReveal()
  // Começa falso no servidor e na hidratação, então o scaleY inicial bate.
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] })

  return (
    <motion.li
      ref={ref}
      onViewportEnter={onReach}
      viewport={{ once: false, margin: "-45% 0px -45% 0px" }}
      className={cn("relative grid grid-cols-[3.5rem_1fr] gap-5", !isLast && "pb-12 lg:min-h-[32vh]")}
    >
      {!isLast && (
        <span aria-hidden className="absolute bottom-1.5 left-[1.6875rem] top-[3.75rem] w-0.5 overflow-hidden rounded-full bg-border">
          <motion.span style={{ scaleY: reduce ? 1 : scrollYProgress }} className="block h-full origin-top bg-primary" />
        </span>
      )}
      <span
        className={cn(
          "grid size-14 place-items-center rounded-full border-2 border-primary text-lg font-bold transition-colors duration-300",
          isReached ? "bg-primary text-primary-foreground" : "bg-background text-primary",
        )}
      >
        {index + 1}
      </span>
      <motion.div {...reveal(0.05)}>
        <h3 className="mt-3 text-[1.375rem] font-semibold tracking-[-0.015em] text-foreground">{step.title}</h3>
        <p className="mt-1.5 max-w-md text-muted-foreground">{step.desc}</p>
        <ShapePanel className="mt-6 aspect-[4/3] lg:hidden">
          <Image {...stepArt[index]} alt="" sizes="70vw" className="h-auto max-h-[78%] w-[66%] object-contain" />
        </ShapePanel>
      </motion.div>
    </motion.li>
  )
}
