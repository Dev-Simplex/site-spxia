"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { HeartHandshakeIcon } from "@/components/icons/animated/heart-handshake"
import { MapPinIcon } from "@/components/icons/animated/map-pin"
import { IconItem, useParallax, useReveal, type AnimatedIcon } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

const copy = {
  pt: {
    title: "A SPXia nasce para",
    titleEm: "simplificar a sua rotina.",
    text: "SPX vem de Simplex: somos a área de inteligência artificial e automação da Simplex Soluções.",
    facts: ["Sinop · Mato Grosso", "Perto de você, antes e depois da entrega"],
    photoAlt: "Três pessoas sorrindo em volta de um notebook, numa reunião de trabalho.",
  },
  en: {
    title: "SPXia is here to",
    titleEm: "make your routine simpler.",
    text: "SPX comes from Simplex: we are the artificial intelligence and automation arm of Simplex Soluções.",
    facts: ["Sinop · Mato Grosso, Brazil", "Close by, before and after launch"],
    photoAlt: "Three people smiling around a laptop in a work meeting.",
  },
} as const

const factIcons: readonly AnimatedIcon[] = [MapPinIcon, HeartHandshakeIcon]

export function Sobre() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reveal = useReveal()
  const parallax = useParallax()

  return (
    <section id="sobre" className="scroll-mt-24 overflow-x-clip bg-background py-20 lg:py-30">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-18 lg:px-10">
        <div>
          <motion.h2
            {...reveal()}
            className="text-balance text-[2.125rem] leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.875rem]"
          >
            {c.title} <strong className="font-bold">{c.titleEm}</strong>
          </motion.h2>
          <motion.p {...reveal(0.08)} className="mt-5 max-w-[34rem] text-lg text-muted-foreground">
            {c.text}
          </motion.p>
          <ul className="mt-8 grid gap-4">
            {c.facts.map((fact, i) => (
              <IconItem key={fact} icon={factIcons[i]} delay={0.16 + i * 0.08}>
                {fact}
              </IconItem>
            ))}
          </ul>
        </div>

        <motion.div {...reveal(0.1)} ref={parallax.ref} className="relative">
          <motion.div
            style={parallax.shape}
            className="pointer-events-none absolute -bottom-10 -left-10 w-[46%] sm:-bottom-14 sm:-left-14"
          >
            <Image src="/images/formas/simbolo-azul.svg" alt="" width={734} height={691} className="h-auto w-full" />
          </motion.div>
          <Image
            src="/images/formas/estrela-4-pontas.svg"
            alt=""
            width={66}
            height={70}
            className="pointer-events-none absolute -right-2 -top-9 w-9 sm:-right-4 sm:w-11"
          />
          <motion.div style={parallax.art} className="relative">
            <Image
              src="/images/fotos/equipe-escritorio.jpg"
              alt={c.photoAlt}
              width={1536}
              height={1024}
              sizes="(min-width: 1280px) 630px, (min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full rounded-[2rem]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
