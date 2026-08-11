"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { Button } from "@/components/ui/button"
import { SpotlightNew } from "@/components/ui/spotlight-new"
import { SplineScene } from "@/components/ui/spline-scene"
import { SparklesCore } from "@/components/ui/sparkles"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { ScrollCue } from "@/components/ui/scroll-cue"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"

const SPLINE_SCENE = "https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"

// Textos derivados de legacy/src/i18n/{pt,en}.js (seção hero), enxugados a pedido do cliente.
const copy = {
  pt: {
    badge: "CONSULTORIA · AUTOMAÇÃO · IA PARA NEGÓCIOS",
    title1: "Seu negócio precisa de",
    titleEm1: "IA que funciona.",
    title2: "Não de promessas.",
    sub: "Consultoria, automações e IA sob medida: da estratégia à produção, com resultados mensuráveis.",
    cta1: "Nossos Serviços",
    cta2: "Agendar Diagnóstico",
    loading: "carregando cena…",
    scroll: "role",
  },
  en: {
    badge: "CONSULTING · AUTOMATION · AI FOR BUSINESS",
    title1: "Your business needs",
    titleEm1: "AI that works.",
    title2: "Not promises.",
    sub: "Consulting, automation and custom AI: from strategy to production, with measurable results.",
    cta1: "Our Services",
    cta2: "Book a Diagnosis",
    loading: "loading scene…",
    scroll: "scroll",
  },
} as const

// Entrada em cascata: o container só orquestra o atraso entre os filhos.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

// Sem blur — o h1 usa bg-clip-text e filtros sobre gradiente recortado dão artefato no Safari.
const itemPlain: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

// Quem pediu menos movimento recebe só o fade.
const itemFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
}

export function Hero() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reduceMotion = useReducedMotion()
  const scope = useAnimationScope<HTMLElement>()

  const enter = reduceMotion ? itemFade : item
  const enterPlain = reduceMotion ? itemFade : itemPlain

  return (
    <section
      {...scope}
      id="hero"
      className="relative isolate flex min-h-dvh w-full items-center overflow-hidden bg-[#050505]"
    >
      {/* ————— Fundo: grade de pontos com máscara radial ————— */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:38px_38px] [-webkit-mask-image:radial-gradient(ellipse_75%_65%_at_45%_35%,#000_5%,transparent_75%)] [mask-image:radial-gradient(ellipse_75%_65%_at_45%_35%,#000_5%,transparent_75%)]"
      />

      {/* ————— Fundo: partículas sutis (densidade baixa) ————— */}
      {/* O wrapper controla a intensidade: o SparklesCore anima o próprio opacity inline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.1}
          particleDensity={12}
          speed={0.6}
          particleColor="#FEFEFE"
          className="h-full w-full"
        />
      </div>

      {/* ————— Fundo: spotlight animado ————— */}
      <SpotlightNew />

      {/* ————— Robô: tela cheia no mobile, sangrando à direita no desktop —————
          O topo desce abaixo da navbar flutuante (top-6 + ~68px de altura), senão
          a cabeça da cena fica encoberta pelo header. */}
      <div className="absolute inset-x-0 bottom-0 top-24 z-0 lg:left-[36%] lg:right-0 lg:top-28">
        {/* Sem scale no wrapper: a cena renderiza nativamente no tamanho do container (mais nítida). */}
        <SplineScene
          scene={SPLINE_SCENE}
          loadingLabel={t.loading}
          className="h-full w-full"
          containerClassName="h-full w-full"
        />

        {/* Escurece o robô atrás do texto no mobile */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/70 lg:hidden" />
        {/* Funde a coluna do robô com o preto da coluna de texto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent"
        />
      </div>

      {/* ————— Brilho vermelho na base ————— */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72 bg-[radial-gradient(ellipse_55%_100%_at_50%_100%,rgba(249,1,8,0.16),transparent_70%)]"
      />

      {/* ————— Conteúdo ————— */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-28 sm:px-8 sm:py-32 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pointer-events-auto w-full max-w-xl lg:max-w-2xl"
        >
          {/* Badge com shimmer */}
          <motion.div variants={enter}>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-sm">
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F90108] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F90108]" />
              </span>
              <TextShimmer
                as="span"
                duration={3}
                className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em]"
              >
                {t.badge}
              </TextShimmer>
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            variants={enterPlain}
            className="mt-7 bg-gradient-to-b from-[#FEFEFE] via-[#FEFEFE] to-[#8A8A8A] bg-clip-text font-serif text-[2.75rem] leading-[1.05] text-transparent sm:text-6xl lg:text-7xl xl:text-[5rem]"
          >
            {t.title1}{" "}
            <em className="italic text-[#F90108] drop-shadow-[0_0_28px_rgba(249,1,8,0.35)]">
              {t.titleEm1}
            </em>
            <br />
            {t.title2}
          </motion.h1>

          <motion.p
            variants={enter}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {t.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={enter} className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group bg-primary-btn text-primary-foreground shadow-[0_0_40px_-12px_rgba(249,1,8,0.9)] transition-all duration-200 hover:bg-primary-btn/90 hover:shadow-[0_0_52px_-8px_rgba(249,1,8,0.95)]"
            >
              <a href="#servicos">
                {t.cta1}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/15 bg-white/[0.02] text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.06]"
            >
              <Link href="/diagnostico">{t.cta2}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ————— Indicador de scroll ————— */}
      <ScrollCue
        label={t.scroll}
        href="#servicos"
        // Só a partir de md: no mobile o conteúdo empilhado alcança a base e colidiria com o indicador.
        className="pointer-events-auto absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 md:flex"
      />

      {/* ————— Emenda com a seção seguinte ————— */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  )
}
