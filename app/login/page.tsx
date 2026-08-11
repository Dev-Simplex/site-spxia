"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { traduzErroAuth } from "@/lib/auth-errors"

type Mode = "login" | "signup" | "forgot"

const titles: Record<Mode, string> = {
  login: "Entrar",
  signup: "Criar Conta",
  forgot: "Recuperar Senha",
}

const subtitles: Record<Mode, string> = {
  login: "Área de membros SPXIA",
  signup: "Acesse a área de membros SPXIA",
  forgot: "Informe seu e-mail para redefinir a senha",
}

export default function LoginPage() {
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
      if (error) setError(traduzErroAuth(error.message))
      else setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.")
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, fullName)
      if (error) setError(traduzErroAuth(error.message))
      else setSuccess("Conta criada! Verifique seu e-mail para confirmar.")
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(traduzErroAuth(error.message))
      else router.push("/admin")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-[420px] rounded-lg border border-border bg-card p-10 sm:p-12">
        <div className="mb-8">
          <Logo />
        </div>

        <h1 className="font-serif text-2xl text-foreground">{titles[mode]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitles[mode]}</p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-sm border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-[0.8125rem] text-primary-text"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mt-6 rounded-sm border border-green-400/30 bg-green-400/10 px-3.5 py-2.5 text-[0.8125rem] text-green-400"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-[0.8125rem] font-medium text-foreground">
                Nome completo
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[0.8125rem] font-medium text-foreground">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="seu@email.com"
            />
          </div>

          {mode !== "forgot" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[0.8125rem] font-medium text-foreground">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="-mt-2 text-right">
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:text-primary-text"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
            {loading ? "Aguarde..." : mode === "forgot" ? "Enviar E-mail" : titles[mode]}
          </Button>
        </form>

        <div className="mt-5 text-center text-[0.8125rem] text-muted-foreground">
          {mode === "forgot" ? (
            <>
              Lembrou a senha?
              <button
                onClick={() => switchMode("login")}
                className="ml-1 px-1 py-2 font-semibold text-primary-text hover:underline"
              >
                Fazer login
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Já tem conta?
              <button
                onClick={() => switchMode("login")}
                className="ml-1 px-1 py-2 font-semibold text-primary-text hover:underline"
              >
                Fazer login
              </button>
            </>
          ) : (
            <>
              Não tem conta?
              <button
                onClick={() => switchMode("signup")}
                className="ml-1 px-1 py-2 font-semibold text-primary-text hover:underline"
              >
                Criar conta
              </button>
            </>
          )}
        </div>

        <Link
          href="/"
          className="mt-2 block py-2 text-center text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  )
}
