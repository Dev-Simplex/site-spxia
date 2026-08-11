import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo width={150} height={50} />
      <p className="font-mono text-sm text-primary-text tracking-widest">404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-2 px-6 py-3 rounded-full bg-primary-btn text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
