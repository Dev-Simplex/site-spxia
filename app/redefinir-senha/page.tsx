"use client"

import { reveal } from "@/components/ui/motion-kit"
import { useEffect, useState, type FormEvent } from "react"
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

const copy = {
  "pt": {
    "title": "Nova senha",
    "sub": "Escolha sua nova senha de acesso",
    "password": "Nova senha",
    "passwordPlaceholder": "Mínimo 6 caracteres",
    "confirm": "Confirmar senha",
    "repeat": "Repita a senha",
    "wait": "Aguarde…",
    "save": "Salvar nova senha",
    "back": "Voltar ao login",
    "home": "Voltar ao site",
    "mismatch": "As senhas não são iguais.",
    "success": "Pronto, sua senha foi alterada."
  },
  "en": {
    "title": "New password",
    "sub": "Choose your new password",
    "password": "New password",
    "passwordPlaceholder": "At least 6 characters",
    "confirm": "Confirm password",
    "repeat": "Repeat the password",
    "wait": "Please wait…",
    "save": "Save new password",
    "back": "Back to sign in",
    "home": "Back to the site",
    "mismatch": "The passwords don't match.",
    "success": "Done, your password has been changed."
  }
}

export default function RedefinirSenhaPage() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reduceMotion = useReducedMotion()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { updatePassword } = useAuth()
  const router = useRouter()

  // O link do e-mail volta com os tokens no hash; o supabase-js consome e limpa a URL
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("error")) {
      const params = new URLSearchParams(window.location.hash.slice(1))
      setError(traduzErroAuth(params.get("error_description") ?? params.get("error"), locale))
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(c.mismatch)
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)
    if (error) {
      setError(traduzErroAuth(error.message, locale))
    } else {
      setSuccess(c.success)
      setTimeout(() => router.push("/admin"), 2000)
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

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.sub}</p>

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

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                autoComplete="new-password"
                placeholder={c.passwordPlaceholder}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[0.8125rem] font-medium text-foreground">
                {c.confirm}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder={c.repeat}
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              {loading ? c.wait : c.save}
            </Button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-4 block text-center text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          {c.back}
        </Link>
      </div>
      </main>
    </div>
  )
}
