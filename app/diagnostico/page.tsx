'use client'

import { reveal } from "@/components/ui/motion-kit"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Mail,
  X,
} from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'

import { WhatsAppIcon } from '@/components/icons/brand'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { whatsappHref } from '@/lib/whatsapp'

import { questionCopy } from './perguntas'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
if (!RECAPTCHA_SITE_KEY) {
  console.warn(
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY não configurada; o formulário do Diagnóstico não carregará o reCAPTCHA',
  )
}

// Uma tela só: contato, três perguntas opcionais e o captcha. O resto do
// diagnóstico acontece na conversa de 30 minutos.
type Step = 'form' | 'sending' | 'success' | 'error'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40'

const labelClass =
  'mb-2 block text-sm font-medium text-foreground'

const directLinkClass =
  'inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline'

const copy = {
  "pt": {
    "home": "Voltar ao site",
    "homeAria": "Voltar para a página inicial da SPXia",
    "start": "Para",
    "startEm": "começar",
    "intro": "Deixe seu contato. Se quiser, adiante um pouco da sua rotina.",
    "direct": "Prefere conversar direto?",
    "directSubject": "Quero conversar com a SPXia",
    "name": "Seu nome",
    "fullName": "Nome completo",
    "email": "E-mail",
    "emailPlaceholder": "seu@email.com",
    "company": "Nome da empresa",
    "companyPlaceholder": "Empresa LTDA",
    "optional": "Se quiser, adiante um pouco (opcional)",
    "cancel": "Cancelar",
    "send": "Enviar",
    "verify": "Faça a verificação para enviar.",
    "unavailable": "A verificação está indisponível; tente novamente mais tarde.",
    "sending": "Enviando…",
    "saving": "Estamos enviando seu contato.",
    "received": "Recebemos",
    "receivedEm": "seu contato.",
    "success": "Vamos chamar você no WhatsApp ou por e-mail para marcar a conversa de 30 minutos.",
    "stepReceived": "Contato recebido",
    "stepCall": "Chamamos você",
    "stepTalk": "Conversa de 30 minutos",
    "error": "Não conseguimos enviar",
    "errorDesc": "Tente novamente em instantes; o que você escreveu continua aqui.",
    "retry": "Tentar novamente",
    "privacy": "SPXia · Seus dados são usados apenas para este diagnóstico."
  },
  "en": {
    "home": "Back to the site",
    "homeAria": "Back to the SPXia home page",
    "start": "Let’s",
    "startEm": "get started",
    "intro": "Leave your contact details. If you like, tell us a bit about your routine.",
    "direct": "Rather talk to us directly?",
    "directSubject": "I'd like to talk to SPXia",
    "name": "Your name",
    "fullName": "Full name",
    "email": "Email",
    "emailPlaceholder": "you@email.com",
    "company": "Company name",
    "companyPlaceholder": "Company Ltd.",
    "optional": "If you like, tell us a bit more (optional)",
    "cancel": "Cancel",
    "send": "Send",
    "verify": "Complete the verification to send.",
    "unavailable": "Verification is unavailable; please try again later.",
    "sending": "Sending…",
    "saving": "We’re sending your details.",
    "received": "We got",
    "receivedEm": "your details.",
    "success": "We’ll reach out on WhatsApp or by email to book the 30-minute conversation.",
    "stepReceived": "Details received",
    "stepCall": "We reach out",
    "stepTalk": "30-minute conversation",
    "error": "We couldn’t send it",
    "errorDesc": "Please try again in a moment; what you wrote is still here.",
    "retry": "Try again",
    "privacy": "SPXia · Your data is used only for this diagnosis."
  }
}

export default function DiagnosticoPage() {
  const { locale, t } = useI18n()
  const c = copy[locale]
  const questions = questionCopy[locale]
  const reduceMotion = useReducedMotion()
  const stepMotion = {
    initial: reduceMotion ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -16 },
    transition: { duration: reduceMotion ? 0 : 0.35 },
  }
  const [step, setStep] = useState<Step>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setErrorMsg(c.verify)
      return
    }

    setStep('sending')
    setErrorMsg('')

    // Vai para a planilha Google pela rota /api/diagnostico.
    const sent = await fetch('/api/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        whatsapp: whatsapp.replace(/\D/g, ''),
        companyName,
        answers,
        locale,
        captchaToken,
      }),
    })
      .then((res) => res.ok)
      .catch(() => false)

    setStep(sent ? 'success' : 'error')
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="relative isolate min-h-screen bg-background">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" aria-label={c.homeAria}>
            <Logo height={30} />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              {c.home}
            </Link>
          </div>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.aside {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none relative flex h-52 items-center justify-center overflow-hidden rounded-[2rem] bg-surface p-6 lg:sticky lg:top-8 lg:h-[520px]" aria-hidden="true">
          <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} sizes="(min-width: 1024px) 450px, 90vw" className="absolute -right-20 -top-20 w-[115%] max-w-none" />
          <Image src="/images/ilustracoes/diagnostico.png" alt="" width={1200} height={968} sizes="(min-width: 1024px) 400px, 220px" className="relative h-48 w-auto object-contain lg:h-auto lg:w-full" />
        </motion.aside>
        <div className="min-w-0 rounded-[2rem] border border-border bg-background p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'form' && (
              <motion.div key="form" {...stepMotion}>
                <StepHeader
                  title={c.start}
                  titleEm={c.startEm}
                  desc={c.intro}
                />

                {/* Atalho para quem prefere falar com alguém em vez de preencher. */}
                <p className="-mt-3 mb-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl bg-surface px-4 py-3 text-sm text-foreground">
                  {c.direct}
                  <a
                    href={whatsappHref(t.contato.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={directLinkClass}
                  >
                    <WhatsAppIcon className="size-4" />
                    {t.contato.whatsapp}
                  </a>
                  <a
                    href={`mailto:${t.contato.email}?subject=${encodeURIComponent(c.directSubject)}`}
                    className={directLinkClass}
                  >
                    <Mail aria-hidden="true" className="size-4" />
                    {t.contato.email}
                  </a>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-nome" className={labelClass}>
                        {c.name} *
                      </label>
                      <input
                        id="diag-nome"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder={c.fullName}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-whatsapp" className={labelClass}>
                        WhatsApp *
                      </label>
                      <input
                        id="diag-whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        required
                        placeholder="(00) 00000-0000"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-email" className={labelClass}>
                        {c.email} *
                      </label>
                      <input
                        id="diag-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={c.emailPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-empresa" className={labelClass}>
                        {c.company} *
                      </label>
                      <input
                        id="diag-empresa"
                        autoComplete="organization"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder={c.companyPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div role="group" aria-labelledby="diag-opcional" className="space-y-4 border-t border-border pt-5">
                    <p id="diag-opcional" className="text-sm font-semibold text-foreground">
                      {c.optional}
                    </p>
                    {questions.map((q) => (
                      <div key={q.id}>
                        <label htmlFor={`diag-${q.id}`} className={labelClass}>
                          {q.label}
                        </label>
                        <textarea
                          id={`diag-${q.id}`}
                          value={answers[q.id] ?? ''}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={q.placeholder}
                          rows={2}
                          className={cn(fieldClass, 'resize-y')}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    {RECAPTCHA_SITE_KEY ? (
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => {
                          setCaptchaToken(token)
                          setErrorMsg('')
                        }}
                        onExpired={() => setCaptchaToken(null)}
                        theme="light"
                      />
                    ) : (
                      <Banner>{c.unavailable}</Banner>
                    )}
                  </div>

                  {errorMsg && <Banner>{errorMsg}</Banner>}

                  <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                    <Button variant="outline" size="lg" asChild className="h-11">
                      <Link href="/">{c.cancel}</Link>
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={Boolean(RECAPTCHA_SITE_KEY) && !captchaToken}
                      className="h-11 px-7"
                    >
                      {c.send}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'sending' && (
              <motion.div
                key="sending"
                {...stepMotion}
                className="flex flex-col items-center py-10 text-center"
              >
                <Loader2
                  aria-hidden="true"
                  className="h-9 w-9 animate-spin motion-reduce:animate-none text-primary"
                />
                <h2 className="mt-6 text-3xl text-foreground">
                  {c.sending}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.saving}
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                {...stepMotion}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                  <Check aria-hidden="true" className="h-8 w-8 text-primary" />
                </div>
                <h1 className="mt-6 text-balance text-4xl leading-tight text-foreground">
                  {c.received}{' '}
                  <strong className="font-bold">{c.receivedEm}</strong>
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {c.success}
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <SuccessStep n={1} state="done" label={c.stepReceived} />
                  <SuccessStep n={2} state="active" label={c.stepCall} />
                  <SuccessStep n={3} state="idle" label={c.stepTalk} />
                </div>

                <Button variant="outline" size="lg" asChild className="mt-8 h-11">
                  <Link href="/">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    {c.home}
                  </Link>
                </Button>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                {...stepMotion}
                className="flex flex-col items-center py-10 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 ring-1 ring-destructive/40">
                  <X aria-hidden="true" className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="mt-6 text-3xl text-foreground">
                  {c.error}
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  {c.errorDesc}
                </p>
                <Button
                  size="lg"
                  className="mt-6 h-11 px-7"
                  onClick={() => {
                    // O captcha é de uso único: o formulário volta com um novo.
                    setStep('form')
                    setCaptchaToken(null)
                    setErrorMsg('')
                  }}
                >
                  {c.retry}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {c.privacy}
        </p>
      </div>
    </div>
  )
}

function StepHeader({
  title,
  titleEm,
  desc,
}: {
  title: string
  titleEm: string
  desc: string
}) {
  return (
    <div className="mb-8">
      <h1 className="mt-2 text-balance text-3xl font-normal tracking-tight leading-tight text-foreground sm:text-4xl">
        {title}{' '}
        <strong className="font-bold">{titleEm}</strong>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

function SuccessStep({
  n,
  state,
  label,
}: {
  n: number
  state: 'done' | 'active' | 'idle'
  label: string
}) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm',
        state === 'done' && 'border-primary/40 bg-primary/10 text-foreground',
        state === 'active' && 'border-primary bg-primary/15 text-foreground',
        state === 'idle' && 'border-border bg-background/40 text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
          state === 'idle'
            ? 'bg-surface text-muted-foreground'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {state === 'done' ? <Check aria-hidden="true" className="h-4 w-4" /> : n}
      </span>
      {label}
    </div>
  )
}
