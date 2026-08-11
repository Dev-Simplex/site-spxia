"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { traduzErroAuth } from "@/lib/auth-errors"

export default function RedefinirSenhaPage() {
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
      setError(traduzErroAuth(params.get("error_description") ?? params.get("error")))
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)
    if (error) {
      setError(traduzErroAuth(error.message))
    } else {
      setSuccess("Senha redefinida com sucesso!")
      setTimeout(() => router.push("/admin"), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-[420px] rounded-lg border border-border bg-card p-10 sm:p-12">
        <div className="mb-8">
          <Logo />
        </div>

        <h1 className="font-serif text-2xl text-foreground">Nova Senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">Defina sua nova senha de acesso</p>

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

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[0.8125rem] font-medium text-foreground">
                Nova senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[0.8125rem] font-medium text-foreground">
                Confirmar senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Repita a senha"
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              {loading ? "Aguarde..." : "Redefinir Senha"}
            </Button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-4 block text-center text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Voltar ao login
        </Link>
      </div>
    </div>
  )
}
