"use client"

import { reveal } from "@/components/ui/motion-kit"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"

const copy = {
  "pt": {
    "title": "Página não",
    "em": "encontrada",
    "desc": "Este endereço não existe ou mudou de lugar.",
    "home": "Voltar ao início"
  },
  "en": {
    "title": "Page not",
    "em": "found",
    "desc": "This address doesn’t exist or has moved.",
    "home": "Back to home"
  }
}

export default function NotFound() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-background px-5 py-6 sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" aria-label={c.home}><Logo height={30} /></Link>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:min-h-[calc(100vh-100px)] lg:grid-cols-2 lg:gap-16">
        <motion.div {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none relative flex min-h-64 items-center justify-center overflow-hidden rounded-[2rem] bg-surface p-6 lg:min-h-[520px]" aria-hidden="true">
          <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} sizes="(min-width: 1024px) 540px, 90vw" className="absolute -right-24 -top-20 w-[110%] max-w-none" />
          <Image src="/images/ilustracoes/404-perdido.png" alt="" width={1200} height={1136} sizes="(min-width: 1024px) 460px, 280px" className="relative h-56 w-auto object-contain lg:h-auto lg:w-full" />
        </motion.div>
        <div>
          <h1 className="text-balance text-4xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">{c.title} <strong className="font-bold">{c.em}</strong></h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{c.desc}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Button size="lg" asChild><Link href="/">{c.home}</Link></Button>
          </div>

        </div>
      </main>
    </div>
  )
}
