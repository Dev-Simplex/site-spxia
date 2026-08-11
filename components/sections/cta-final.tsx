"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UnderlineLink } from "@/components/ui/underline-link"
import { useI18n } from "@/lib/i18n/context"

// Última seção da página: gradiente e partículas são decorativos (aria-hidden)
// e não precisam entrar no bundle inicial nem no HTML do servidor. O
// SparklesCore ainda espera a seção entrar na viewport para subir o tsparticles.
const AnimatedGradientBackground = dynamic(
  () => import("@/components/ui/animated-gradient-background"),
  { ssr: false },
)
const SparklesCore = dynamic(
  () => import("@/components/ui/sparkles").then((m) => m.SparklesCore),
  { ssr: false },
)

// Núcleo escuro no centro (onde fica o headline) e o vermelho empurrado para
// o anel externo: mantém o drama do gradiente sem derrubar o contraste do texto.
const gradientColors = [
  "#0a0a0a",
  "#121212",
  "#2b0d0e",
  "#7a1b1e",
  "#f90108",
  "#1a1a1a",
]
const gradientStops = [12, 32, 50, 68, 86, 100]

const labels = {
  pt: { emailCta: "FALAR POR E-MAIL" },
  en: { emailCta: "SEND AN EMAIL" },
} as const

export function CtaFinal() {
  const { t, locale } = useI18n()
  const contact = t.contato

  return (
    <section
      id="contato"
      className="relative isolate overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      <AnimatedGradientBackground
        Breathing={true}
        gradientColors={gradientColors}
        gradientStops={gradientStops}
        animationSpeed={0.018}
        breathingRange={6}
      />

      {/* Scrim radial: garante contraste do texto branco sobre o gradiente vivo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_38%,rgba(6,6,6,0.62),rgba(6,6,6,0.2)_55%,transparent_78%)]"
      />

      {/* Glow que nasce na borda superior da seção */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[min(92%,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-primary/25 blur-[80px]"
      />

      {/* Fade para a cor do footer: transição suave entre as seções */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#111111]"
      />

      {/* Fio de luz no topo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative flex min-h-56 items-center justify-center">
            <div className="absolute inset-0">
              <SparklesCore
                id="cta-final-sparkles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={48}
                className="h-full w-full"
                particleColor="#ffffff"
                speed={0.8}
              />
            </div>

            <h2 className="relative z-20 text-balance font-serif text-4xl leading-[1.08] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-7xl">
              {contact.title}{" "}
              <em className="bg-gradient-to-b from-white to-white/55 bg-clip-text italic text-transparent">
                {contact.titleEm}
              </em>
            </h2>
          </div>

          <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {contact.desc}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group relative h-12 overflow-hidden bg-primary-btn px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground shadow-[0_12px_32px_-14px_rgba(249,1,8,0.95)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-btn hover:shadow-[0_18px_44px_-12px_rgba(249,1,8,0.8)] focus-visible:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <Link href="/diagnostico">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
                />
                <span className="relative">{contact.cta}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="group h-12 border-white/35 bg-white/[0.04] px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 hover:text-white hover:shadow-[0_18px_40px_-20px_rgba(255,255,255,0.5)] focus-visible:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <a href={`mailto:${contact.email}`}>
                <Mail
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:scale-110 motion-reduce:transform-none"
                />
                {labels[locale].emailCta}
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/15 pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-white/50 sm:flex-row sm:gap-8">
            <UnderlineLink
              href={`mailto:${contact.email}`}
              className="gap-2 text-white/50 hover:text-white focus-visible:text-white"
            >
              <Mail aria-hidden="true" className="h-3.5 w-3.5" />
              {contact.email}
            </UnderlineLink>
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {contact.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
