"use client"

import { useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { CalendarCheckIcon, type CalendarCheckIconHandle } from "@/components/icons/animated/calendar-check"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

const DAY_COUNT = 5
const SLOTS = ["09:00", "10:30", "14:00", "15:30", "16:00", "17:30"]
const MINUTE = 60_000
// Pedido por e-mail precisa de tempo para alguém responder.
const MIN_LEAD = 60 * MINUTE

// A home é estática: dia e hora saem do relógio de quem visita, depois da
// hidratação (no servidor o valor é null), e andam de minuto em minuto.
const subscribeMinute = (onChange: () => void) => {
  const id = setInterval(onChange, MINUTE)
  return () => clearInterval(id)
}
const nowOnClient = () => Math.floor(Date.now() / MINUTE) * MINUTE
const nowOnServer = () => null

function slotStart(day: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return new Date(day).setHours(hours, minutes, 0, 0)
}

const isPast = (day: Date, time: string, now: number) => slotStart(day, time) < now + MIN_LEAD

/** Dias úteis a partir de hoje; hoje só entra se ainda sobra horário. */
function bookableDays(now: number) {
  const days: Date[] = []
  const date = new Date(now)
  date.setHours(0, 0, 0, 0)
  while (days.length < DAY_COUNT) {
    const weekday = date.getDay()
    const isBusinessDay = weekday !== 0 && weekday !== 6
    if (isBusinessDay && SLOTS.some((time) => !isPast(date, time, now))) days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

const longDate = (date: Date, lang: string) =>
  date.toLocaleDateString(lang, { weekday: "long", day: "2-digit", month: "2-digit" })

// Ainda não há agenda online nem WhatsApp: o pedido sai pronto no e-mail de quem visita.
const mailRequest = (to: string, subject: string, body: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const optionFocus = "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"

export function CtaFinal() {
  const { t } = useI18n()
  const contact = t.contato
  const booking = contact.booking
  const reveal = useReveal()
  const calendarIcon = useRef<CalendarCheckIconHandle>(null)
  const now = useSyncExternalStore(subscribeMinute, nowOnClient, nowOnServer)
  const [dayKey, setDayKey] = useState<number | null>(null)
  const [slot, setSlot] = useState<string | null>(null)

  const days = now === null ? [] : bookableDays(now)
  // Se o dia escolhido sai da lista (o horário de hoje acabou), volta para o primeiro.
  const day = days.find((date) => date.getTime() === dayKey) ?? days[0]
  const todayKey = now === null ? null : new Date(now).setHours(0, 0, 0, 0)
  const isOpen = (time: string) => now !== null && day !== undefined && !isPast(day, time, now)
  const chosenSlot = slot && isOpen(slot) ? slot : null
  const when = day && longDate(day, t.lang)
  const requestHref =
    when && chosenSlot
      ? mailRequest(
          contact.email,
          `${booking.title} · ${when} · ${chosenSlot}`,
          booking.request.replace("{when}", when).replace("{time}", chosenSlot),
        )
      : undefined

  return (
    // A única faixa escura do site (decisão 3): Azul Pulso.
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

        {/* Card de agendamento: escolhe dia e hora; o pedido sai pelo e-mail. */}
        <motion.div
          className="relative w-full max-w-[440px] justify-self-center rounded-[26px] bg-card p-6 text-foreground shadow-2xl shadow-brand-deep/40 sm:p-7 lg:justify-self-end"
          {...reveal(0.12)}
          onViewportEnter={() => calendarIcon.current?.startAnimation()}
        >
          <span
            aria-hidden="true"
            className="absolute -top-5 right-8 size-11 bg-brand-green"
            style={{ mask: "url(/images/formas/estrela-4-pontas.svg) center / contain no-repeat" }}
          />
          <div className="flex items-center gap-3">
            <CalendarCheckIcon
              ref={calendarIcon}
              size={20}
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent text-primary"
            />
            <div>
              <b className="block text-[1.0625rem] font-semibold">{booking.title}</b>
              <span className="text-sm text-muted-foreground">{booking.meta}</span>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="sr-only">{booking.dayLegend}</legend>
            <div className="grid min-h-[4.125rem] grid-cols-5 gap-2">
              {days.map((date) => (
                <label
                  key={date.getTime()}
                  className={cn(
                    "group cursor-pointer rounded-[14px] border border-border py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-accent",
                    optionFocus,
                  )}
                >
                  <input
                    type="radio"
                    name="booking-day"
                    className="sr-only"
                    aria-label={longDate(date, t.lang)}
                    checked={date === day}
                    onChange={() => setDayKey(date.getTime())}
                  />
                  {date.getTime() === todayKey ? booking.today : booking.days[date.getDay() - 1]}
                  <b className="mt-0.5 block text-lg font-semibold text-foreground group-has-checked:text-primary">
                    {date.getDate()}
                  </b>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-3.5">
            <legend className="sr-only">{booking.slotLegend}</legend>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((time) => (
                <label
                  key={time}
                  className={cn(
                    "cursor-pointer rounded-xl border border-border py-2.5 text-center text-sm font-semibold transition-colors hover:border-brand-green has-checked:border-brand-green has-checked:bg-brand-green has-checked:text-white has-disabled:pointer-events-none has-disabled:text-muted-foreground/45 has-disabled:line-through",
                    optionFocus,
                  )}
                >
                  <input
                    type="radio"
                    name="booking-slot"
                    className="sr-only"
                    disabled={!isOpen(time)}
                    checked={time === chosenSlot}
                    onChange={() => setSlot(time)}
                  />
                  {time}
                </label>
              ))}
            </div>
          </fieldset>

          <Button asChild size="lg" className="mt-5 w-full aria-disabled:pointer-events-none aria-disabled:opacity-50">
            <a href={requestHref} aria-disabled={!requestHref}>
              {booking.confirm}
            </a>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">{booking.note}</p>
        </motion.div>
      </div>
    </section>
  )
}
