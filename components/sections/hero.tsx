"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

const copy = {
  pt: {
    title: "Sua rotina pode ser",
    titleEm: "mais simples.",
    sub: "Inteligência artificial para facilitar o atendimento e reduzir as tarefas repetitivas da sua empresa.",
    ctaSolucoes: "Quero conhecer",
    ctaConversa: "Vamos conversar",
    imageAlt: "Mulher de blazer claro, com um sorriso tranquilo.",
    chatQuestion: "Ainda tem unidade de 3 quartos?",
    chatAnswer: "Temos, sim! Financiamento ou à vista?",
    visitTitle: "Visita agendada",
    visitWhen: "sábado, 10h",
  },
  en: {
    title: "Your routine can be",
    titleEm: "simpler.",
    sub: "Artificial intelligence that makes customer service easier and takes repetitive work off your team.",
    ctaSolucoes: "Tell me more",
    ctaConversa: "Let's talk",
    imageAlt: "A woman in a light blazer with a calm smile.",
    chatQuestion: "Is the 3-bedroom unit still available?",
    chatAnswer: "It is! Financing or paying upfront?",
    visitTitle: "Visit booked",
    visitWhen: "Saturday, 10 a.m.",
  },
} as const

// Mesma assinatura do reveal() de problema.tsx (16 px, 0,6 s, mesma curva), mas
// em CSS (@starting-style): acima da dobra, o initial do motion sairia do SSR
// com opacity 0 e o título ficaria invisível até a hidratação. A foto não entra
// aqui de propósito: é o LCP.
const reveal =
  "motion-safe:transition motion-safe:duration-600 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:starting:translate-y-4 motion-safe:starting:opacity-0"
const pop =
  "motion-safe:transition motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:starting:translate-y-2 motion-safe:starting:scale-95 motion-safe:starting:opacity-0"
const floatingCard = "rounded-2xl border border-border bg-card shadow-xl shadow-brand-deep/10"

export function Hero() {
  const { locale } = useI18n()
  const t = copy[locale]

  // Parallax leve (REFERENCIAS P2): a forma desce e as estrelas sobem enquanto o
  // hero sai da tela. Vai por variável CSS para valer só a partir de md.
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const shapeY = useTransform(scrollYProgress, [0, 1], ["0px", reduceMotion ? "0px" : "64px"])
  const starsY = useTransform(scrollYProgress, [0, 1], ["0px", reduceMotion ? "0px" : "-40px"])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-background pt-8 lg:pt-14"
    >
      <div className="mx-auto grid w-full max-w-[1248px] items-center gap-10 px-6 lg:grid-cols-[1.02fr_1fr]">
        <div className="lg:pb-[72px]">
          <h1
            id="hero-title"
            className={`text-[2.625rem] font-normal leading-[1.04] tracking-[-0.04em] text-foreground sm:text-6xl xl:text-[4.625rem] ${reveal}`}
          >
            {t.title} <strong className="font-bold">{t.titleEm}</strong>
          </h1>

          <p
            className={`mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground lg:text-[1.1875rem] ${reveal} motion-safe:delay-100`}
          >
            {t.sub}
          </p>

          <div className={`mt-9 flex flex-col gap-3.5 sm:flex-row ${reveal} motion-safe:delay-200`}>
            <Button
              asChild
              size="lg"
              className="group h-[52px] px-[26px] shadow-lg shadow-primary/30 hover:-translate-y-px hover:shadow-xl hover:shadow-primary/35"
            >
              <a href="#servicos">
                {t.ctaSolucoes}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] border-[1.5px] border-input px-[26px] text-foreground hover:border-primary/40 hover:text-primary"
            >
              <Link href="/#contato">{t.ctaConversa}</Link>
            </Button>
          </div>
        </div>

        {/* Visual: forma do símbolo atrás e, por cima, a caixa da foto. Cards e
            estrelas ficam em % dessa caixa para acompanhar a pessoa em qualquer
            largura. Zona proibida (cabeça, cabelo e pescoço): x 25–79%, y 0–40%. */}
        <div className="relative mx-auto h-[440px] w-full max-w-[400px] sm:h-[560px] sm:max-w-[520px] lg:h-[600px] lg:max-w-none xl:h-[640px]">
          <motion.div
            style={{ "--parallax-y": shapeY } as MotionStyle}
            className="absolute md:translate-y-(--parallax-y) -right-20 bottom-5 w-[400px] sm:-right-16 sm:w-[520px] lg:-right-[50px] lg:bottom-[30px] lg:w-[540px] xl:-right-[70px] xl:w-[600px]"
          >
            <Image
              src="/images/formas/simbolo-verde.svg"
              alt=""
              width={734}
              height={691}
              className="h-auto w-full motion-safe:transition motion-safe:duration-1000 motion-safe:ease-out motion-safe:starting:scale-95 motion-safe:starting:opacity-0"
            />
          </motion.div>

          <div className="absolute bottom-0 left-[58%] aspect-[2/3] h-[420px] -translate-x-1/2 sm:left-[56%] sm:h-[540px] lg:h-[570px] xl:h-[610px]">
            <Image
              src="/images/fotos/hero-pessoa.png"
              alt={t.imageAlt}
              width={960}
              height={1440}
              priority
              sizes="(min-width: 1280px) 410px, (min-width: 640px) 380px, 280px"
              className="h-full w-full drop-shadow-2xl drop-shadow-brand-deep/15"
            />

            <motion.div
              style={{ "--parallax-y": starsY } as MotionStyle}
              aria-hidden="true"
              className="absolute inset-0 md:translate-y-(--parallax-y)"
            >
              <Image
                src="/images/formas/estrela-4-pontas.svg"
                alt=""
                width={66}
                height={70}
                className="absolute left-[92%] top-[3%] size-6 lg:size-[34px]"
              />
              <Image
                src="/images/formas/estrela-4-pontas-contorno.svg"
                alt=""
                width={103}
                height={111}
                className="absolute left-[84%] top-[17%] size-4 lg:size-[22px]"
              />
            </motion.div>

            {/* Chat: à esquerda, na altura do blazer. */}
            <div
              aria-hidden="true"
              className={`absolute left-[-22%] top-[42%] w-[220px] p-2.5 sm:top-[45%] sm:w-[224px] lg:w-[240px] ${floatingCard} ${pop} motion-safe:delay-300`}
            >
              <p className="flex items-center gap-1.5 px-1 text-[0.6875rem] font-semibold text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-green" />
                WhatsApp · 23:04
              </p>
              <p className="mt-2 w-fit max-w-[92%] rounded-xl rounded-bl-[4px] bg-surface px-3 py-2 text-xs leading-snug text-foreground lg:text-[0.8125rem]">
                {t.chatQuestion}
              </p>
              <p
                className={`ml-auto mt-1.5 w-fit max-w-[92%] rounded-xl rounded-br-[4px] bg-primary px-3 py-2 text-xs leading-snug text-primary-foreground lg:text-[0.8125rem] ${pop} motion-safe:delay-[450ms]`}
              >
                {t.chatAnswer}
              </p>
            </div>

            {/* Visita: embaixo à direita, sobre as mãos. */}
            <div
              aria-hidden="true"
              className={`absolute right-[-8%] top-[80%] flex items-center sm:top-[78%] gap-2.5 py-2 pl-2 pr-4 ${floatingCard} ${pop} motion-safe:delay-[600ms]`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-green">
                <Check className="size-4 stroke-[3.5] text-white" />
              </span>
              <span className="flex flex-col whitespace-nowrap leading-tight">
                <span className="text-[0.8125rem] font-semibold text-foreground">{t.visitTitle}</span>
                <span className="text-xs text-muted-foreground">{t.visitWhen}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
