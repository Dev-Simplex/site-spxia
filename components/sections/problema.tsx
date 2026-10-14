"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { ClockIcon } from "@/components/icons/animated/clock"
import { LayersIcon } from "@/components/icons/animated/layers"
import { MessageCircleMoreIcon } from "@/components/icons/animated/message-circle-more"
import { IconItem, ShapePanel, useParallax, useReveal, type AnimatedIcon } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

const copy = {
  pt: {
    title: "Por onde começar com IA?",
    titleEm: "Pelo que complica o seu dia.",
    pains: [
      "O cliente chama fora do horário",
      "A mesma resposta, várias vezes por dia",
      "Informação espalhada entre sistemas",
    ],
  },
  en: {
    title: "Where do you start with AI?",
    titleEm: "With what makes your day harder.",
    pains: [
      "Customers message after hours",
      "The same answer, many times a day",
      "Information scattered across systems",
    ],
  },
} as const

const painIcons: readonly AnimatedIcon[] = [ClockIcon, MessageCircleMoreIcon, LayersIcon]

export function Problema() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reveal = useReveal()
  const parallax = useParallax()

  return (
    <section id="problema" className="bg-background py-20 lg:py-30">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-18 lg:px-10">
        <motion.div {...reveal()}>
          <ShapePanel parallax={parallax}>
            <Image
              src="/images/ilustracoes/ilustracao-fio-embolado.png"
              alt=""
              width={1115}
              height={1011}
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 36vw, 78vw"
              className="h-auto w-[78%]"
            />
          </ShapePanel>
        </motion.div>

        <div>
          <motion.h2
            {...reveal(0.05)}
            className="text-balance text-[2.125rem] leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.875rem]"
          >
            {t.title} <strong className="block font-bold">{t.titleEm}</strong>
          </motion.h2>

          <ul className="mt-9 grid gap-5">
            {t.pains.map((pain, i) => (
              <IconItem key={pain} icon={painIcons[i]} delay={0.12 + i * 0.08}>
                {pain}
              </IconItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
