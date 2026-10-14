"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

// Decisão P3 do PLANO: a frase da marca (arte da camiseta), sem assinatura.
const copy = {
  pt: { text: "A tecnologia trabalha.", textEm: "O tempo é seu." },
  en: { text: "Technology does the work.", textEm: "The time is yours." },
} as const

export function Quote() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reveal = useReveal()

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-24 md:px-8 md:py-28 lg:grid-cols-[1fr_1.15fr] lg:px-10">
        <motion.h2
          className="text-balance text-5xl leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          {...reveal()}
        >
          {t.text} <strong className="block font-bold text-primary">{t.textEm}</strong>
        </motion.h2>

        {/* REFERENCIAS.md: os mascotes entram depois do texto. */}
        <motion.div className="relative" {...reveal(0.25)}>
          {/* Forma do símbolo atrás dos mascotes; a seção corta o que passa da borda. */}
          <Image
            src="/images/formas/simbolo-verde.svg"
            alt=""
            width={734}
            height={691}
            className="pointer-events-none absolute -right-[22%] top-1/2 w-[105%] max-w-none -translate-y-1/2"
          />
          <Image
            src="/images/ilustracoes/mascotes-dupla.svg"
            alt=""
            width={896}
            height={677}
            sizes="(min-width: 1024px) 50vw, 92vw"
            className="relative h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
