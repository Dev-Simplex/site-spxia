"use client"

import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo width={150} height={50} />
      <p className="font-mono text-sm text-primary-text tracking-widest">ERRO</p>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        Ocorreu um erro inesperado. Tente novamente. Se persistir, fale com a gente em{' '}
        <a href="mailto:contato@simplexsolucoes.com.br" className="text-primary-text hover:underline">
          contato@simplexsolucoes.com.br
        </a>
        .
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-primary-btn text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
