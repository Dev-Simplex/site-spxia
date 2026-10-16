"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Briefcase, Code2, UserRound } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { ShapePanel, useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"

// Decisão P1 do PLANO: a antiga Mentoria vira "Treinamento", curta e com ilustração.
const copy = {
  pt: {
    title: "Sua equipe à vontade",
    titleEm: "com a IA.",
    desc: "Programas práticos para quem lidera e para quem executa, com exemplos da sua empresa.",
    cta: "Vamos conversar",
    programs: [
      { audience: "Donos, diretores e gestores", title: "IA para quem decide" },
      { audience: "Desenvolvedores e analistas", title: "IA para equipes técnicas" },
      { audience: "Empreendedores e profissionais", title: "Mentoria individual" },
    ],
  },
  en: {
    title: "Your team at ease",
    titleEm: "with AI.",
    desc: "Hands-on programs for the people who lead and the people who do the work, with examples from your company.",
    cta: "Let's talk",
    programs: [
      { audience: "Owners, directors and managers", title: "AI for decision-makers" },
      { audience: "Developers and analysts", title: "AI for technical teams" },
      { audience: "Business owners and professionals", title: "One-on-one mentoring" },
    ],
  },
} as const

const icons = [Briefcase, Code2, UserRound]

export function Mentoria() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reveal = useReveal()

  return (
    <section id="mentoria" className="scroll-mt-24 bg-background">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-x-16 gap-y-12 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:px-10">
        <motion.div className="lg:col-span-7" {...reveal()}>
          <ShapePanel className="aspect-[4/3] px-6 sm:px-12">
            <Image
              src="/images/ilustracoes/treinamento.png"
              alt=""
              width={1200}
              height={765}
              sizes="(min-width: 1024px) 52vw, 90vw"
              className="h-auto w-full"
            />
          </ShapePanel>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          {...reveal(0.1)}
        >
          <h2 className="text-balance text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {t.title} <strong className="font-bold">{t.titleEm}</strong>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{t.desc}</p>

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {t.programs.map((program, index) => {
              const Icon = icons[index]
              return (
                <motion.li key={program.title} className="flex items-center gap-4 py-4" {...reveal(0.2 + index * 0.08)}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{program.title}</h3>
                    <p className="text-sm text-muted-foreground">{program.audience}</p>
                  </div>
                </motion.li>
              )
            })}
          </ul>

          <Button asChild size="lg" className="mt-8">
            <Link href="/#contato" className="group">
              {t.cta}
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
