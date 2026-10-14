"use client"

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Footer } from '@/components/sections/footer'
import { reveal } from '@/components/ui/motion-kit'
import { useI18n } from '@/lib/i18n/context'

export interface TocEntry {
  id: string
  number: string
  title: string
  titleEn: string
}

interface LegalShellProps {
  title: string
  titleEn: string
  intro: string
  introEn: string
  updatedAt: string
  updatedAtEn: string
  toc?: TocEntry[]
  children: ReactNode
  childrenEn: ReactNode
}

export function LegalShell({ title, titleEn, intro, introEn, updatedAt, updatedAtEn, toc, children, childrenEn }: LegalShellProps) {
  const { locale } = useI18n()
  const english = locale === 'en'
  const reduceMotion = useReducedMotion()
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <Link href="/" aria-label={english ? 'Back to home' : 'Voltar ao início'}><Logo height={30} /></Link>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        <motion.header {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none relative isolate mb-10 overflow-hidden rounded-[2rem] bg-surface px-6 py-10 sm:p-12">
          <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} sizes="240px" className="pointer-events-none absolute -right-28 -top-28 -z-10 w-64 opacity-20" />
          <Link href="/" className="inline-flex items-center gap-2 py-2 text-sm text-primary hover:underline">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />{english ? 'Back to the site' : 'Voltar ao site'}
          </Link>
          <h1 className="mt-5 max-w-3xl text-balance text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">
            {english ? titleEn : title}<br /><strong className="font-bold">Chat SPX</strong>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{english ? introEn : intro}</p>
          <p className="mt-6 text-sm text-muted-foreground">{english ? 'Last updated: ' : 'Última atualização: '}{english ? updatedAtEn : updatedAt}</p>
        </motion.header>
        <div className="grid items-start gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          {toc && toc.length > 0 && (
            <nav aria-label={english ? 'Document contents' : 'Índice do documento'} className="rounded-3xl border border-border bg-surface p-6 lg:sticky lg:top-8">
              <details open>
                <summary className="cursor-pointer text-base font-semibold text-foreground">{english ? 'Contents' : 'Índice'}</summary>
                <ol className="mt-5 space-y-3">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a href={`#${entry.id}`} className="group flex gap-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:text-primary">
                        <span className="shrink-0 text-primary">{entry.number}</span>
                        <span className="underline-offset-4 group-hover:underline">{english ? entry.titleEn : entry.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </nav>
          )}
          <div className="min-w-0 space-y-12 text-[0.9375rem] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
            {english ? childrenEn : children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface LegalSectionProps {
  number: string
  title: string
  id?: string
  children: ReactNode
}

export function LegalSection({ number, title, id, children }: LegalSectionProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.section {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} id={id} className="motion-reduce:!opacity-100 motion-reduce:!transform-none scroll-mt-8 border-t border-border pt-8">
      <h2 className="flex items-start gap-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
        <span className="mt-1 text-sm font-medium text-primary">{number}</span>{title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </motion.section>
  )
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5">{children}</ul>
}

export function LegalItem({ children }: { children: ReactNode }) {
  return <li className="relative pl-5 before:absolute before:left-0 before:top-[0.6875em] before:h-1 before:w-1 before:rounded-full before:bg-primary">{children}</li>
}

export function LegalTerm({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}
