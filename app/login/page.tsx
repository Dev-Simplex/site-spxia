"use client"

import { reveal } from "@/components/ui/motion-kit"
import { useState, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

import { useRouter } from "next/navigation"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { traduzErroAuth } from "@/lib/auth-errors"

type Mode = "login" | "signup" | "forgot"

const copy = {
  "pt": {
    "name": "Nome completo",
    "namePlaceholder": "Seu nome",
    "email": "E-mail",
    "emailPlaceholder": "seu@email.com",
    "password": "Senha",
    "passwordPlaceholder": "Mínimo 6 caracteres",
    "forgot": "Esqueceu a senha?",
    "wait": "Aguarde…",
    "send": "Enviar link",
    "remembered": "Lembrou a senha?",
    "signIn": "Entrar",
    "account": "Já tem conta?",
    "noAccount": "Ainda não tem conta?",
    "create": "Criar conta",
    "home": "Voltar ao site",
    "sent": "Enviamos o link para o seu e-mail. Confira a caixa de entrada.",
    "created": "Conta criada. Confirme pelo link que enviamos ao seu e-mail.",
    "titles": {
      "login": "Entrar",
      "signup": "Criar conta",
      "forgot": "Recuperar senha"
    },
    "subtitles": {
      "login": "Área de membros SPXia",
      "signup": "Crie seu acesso à área de membros SPXia",
      "forgot": "Informe seu e-mail para receber o link de recuperação."
    }
  },
  "en": {
    "name": "Full name",
    "namePlaceholder": "Your name",
    "email": "Email",
    "emailPlaceholder": "you@email.com",
    "password": "Password",
    "passwordPlaceholder": "At least 6 characters",
    "forgot": "Forgot your password?",
    "wait": "Please wait…",
    "send": "Send link",
    "remembered": "Remembered it?",
    "signIn": "Sign in",
    "account": "Already have an account?",
    "noAccount": "Don't have an account?",
    "create": "Create account",
    "home": "Back to the site",
    "sent": "We've sent the link to your email. Check your inbox.",
    "created": "Account created. Confirm it using the link we sent to your email.",
    "titles": {
      "login": "Sign in",
      "signup": "Create account",
      "forgot": "Reset password"
    },
    "subtitles": {
      "login": "SPXia members area",
      "signup": "Create your access to the SPXia members area",
      "forgot": "Enter your email to receive a password reset link."
    }
  }
}

export default function LoginPage() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  function switchMode(newMode: Mode) {
    setMode(newMode)
    setError("")
    setSuccess("")
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (mode === "forgot") {
      const { error } = await resetPassword(email)
      if (error) setError(traduzErroAuth(error.message, locale))
      else setSuccess(c.sent)
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, fullName)
      if (error) setError(traduzErroAuth(error.message, locale))
      else setSuccess(c.created)
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(traduzErroAuth(error.message, locale))
      else router.push("/admin")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background px-5 py-6 sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" aria-label={c.home}><Logo height={30} /></Link>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-8 py-8 lg:min-h-[calc(100vh-100px)] lg:grid-cols-2 lg:gap-16">
        <motion.div {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none relative flex min-h-56 items-center justify-center overflow-hidden rounded-[2rem] bg-surface p-6 lg:min-h-[560px]" aria-hidden="true">
          <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} sizes="(min-width: 1024px) 540px, 90vw" className="absolute -right-24 -top-20 w-[110%] max-w-none" />
          <Image src="/images/ilustracoes/login.png" alt="" width={1200} height={985} sizes="(min-width: 1024px) 440px, 280px" className="relative h-48 w-auto object-contain lg:h-auto lg:w-full" />
        </motion.div>
      <div className="mx-auto w-full max-w-md py-4 sm:p-6">

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">{c.titles[mode]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.subtitles[mode]}</p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-[0.8125rem] text-destructive"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-brand-green/30 bg-brand-green/10 px-3.5 py-2.5 text-[0.8125rem] text-foreground"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[0.8125rem] font-medium text-foreground">
                {c.name}
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder={c.namePlaceholder}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[0.8125rem] font-medium text-foreground">
              {c.email}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={c.emailPlaceholder}
            />
          </div>

          {mode !== "forgot" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[0.8125rem] font-medium text-foreground">
                {c.password}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={c.passwordPlaceholder}
              />
            </div>
          )}

          {mode === "login" && (
            <div className="-mt-2 text-right">
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:text-primary"
              >
                {c.forgot}
              </button>
            </div>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
            {loading ? c.wait : mode === "forgot" ? c.send : c.titles[mode]}
          </Button>
        </form>

        <div className="mt-5 text-center text-[0.8125rem] text-muted-foreground">
          {mode === "forgot" ? (
            <>
              {c.remembered}
              <button
                onClick={() => switchMode("login")}
                className="ml-1 px-1 py-2 font-semibold text-primary hover:underline"
              >
                {c.signIn}
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              {c.account}
              <button
                onClick={() => switchMode("login")}
                className="ml-1 px-1 py-2 font-semibold text-primary hover:underline"
              >
                {c.signIn}
              </button>
            </>
          ) : (
            <>
              {c.noAccount}
              <button
                onClick={() => switchMode("signup")}
                className="ml-1 px-1 py-2 font-semibold text-primary hover:underline"
              >
                {c.create}
              </button>
            </>
          )}
        </div>

        <Link
          href="/"
          className="mt-2 block py-2 text-center text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          {c.home}
        </Link>
      </div>
      </main>
    </div>
  )
}
