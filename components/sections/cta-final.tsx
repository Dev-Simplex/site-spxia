"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { CalendarCheckIcon, type CalendarCheckIconHandle } from "@/components/icons/animated/calendar-check"
import { Logo } from "@/components/logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

// Agenda ilustrativa (decisão 12, mockup): só visual, sem lógica de horários.
const FIRST_DAY = 13
const SELECTED_DAY = 2
const SLOTS = ["09:00", "10:30", "14:00", "15:30", "16:00", "17:30"]
const SELECTED_SLOT = "10:30"

export function CtaFinal() {
  const { t } = useI18n()
  const contact = t.contato
  const reveal = useReveal()
  const calendarIcon = useRef<CalendarCheckIconHandle>(null)

  return (
    // Uma das duas faixas escuras do site (decisão 3): Azul Pulso.
    <section id="contato" className="relative isolate scroll-mt-24 overflow-hidden bg-primary text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-24 -z-10 opacity-[0.08]">
        <Logo variant="symbol" tone="white" height={720} />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-24 md:px-8 md:py-28 lg:grid-cols-[1.15fr_1fr] lg:px-10">
        <motion.div
          {...reveal()}
        >
          <h2 className="text-balance text-4xl leading-[1.08] tracking-tight md:text-5xl lg:text-[3.375rem]">
            {contact.title} <strong className="font-bold">{contact.titleEm}</strong>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/85">{contact.desc}</p>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90">
              <Link href="/diagnostico" className="group">
                {contact.cta}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/45 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`mailto:${contact.email}`}>{contact.emailCta}</a>
            </Button>
          </div>
        </motion.div>

        {/* Card de agendamento do mockup: decorativo; o clique leva ao diagnóstico. */}
        <motion.div
          aria-hidden="true"
          className="relative w-full max-w-[440px] justify-self-center rounded-[26px] bg-card p-6 text-foreground shadow-2xl shadow-brand-deep/40 sm:p-7 lg:justify-self-end"
          {...reveal(0.12)}
          onViewportEnter={() => calendarIcon.current?.startAnimation()}
        >
          <span
            className="absolute -top-5 right-8 size-11 bg-brand-green"
            style={{ mask: "url(/images/formas/estrela-4-pontas.svg) center / contain no-repeat" }}
          />
          <div className="flex items-center gap-3">
            <CalendarCheckIcon
              ref={calendarIcon}
              size={20}
              className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent text-primary"
            />
            <div>
              <b className="block text-[1.0625rem] font-semibold">{contact.booking.title}</b>
              <span className="text-sm text-muted-foreground">{contact.booking.meta}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {contact.booking.days.map((day, index) => {
              const isSelected = index === SELECTED_DAY
              return (
                <div
                  key={day}
                  className={cn(
                    "rounded-[14px] border py-2.5 text-center text-xs font-medium text-muted-foreground",
                    isSelected ? "border-primary bg-accent" : "border-border",
                  )}
                >
                  {day}
                  <b className={cn("mt-0.5 block text-lg font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                    {FIRST_DAY + index}
                  </b>
                </div>
              )
            })}
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-2">
            {SLOTS.map((slot) => (
              <span
                key={slot}
                className={cn(
                  "rounded-xl border py-2.5 text-center text-sm font-semibold",
                  slot === SELECTED_SLOT ? "border-brand-green bg-brand-green text-brand-deep" : "border-border",
                )}
              >
                {slot}
              </span>
            ))}
          </div>

          <Link href="/diagnostico" tabIndex={-1} className={buttonVariants({ size: "lg", className: "mt-5 w-full" })}>
            {contact.booking.confirm}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
