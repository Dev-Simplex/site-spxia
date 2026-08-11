import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/sections/footer'

export interface TocEntry {
  /** Deve casar com o `id` passado à LegalSection correspondente. */
  id: string
  number: string
  title: string
}

interface LegalShellProps {
  title: string
  /** Linha curta abaixo do título, resumindo o documento. */
  intro: string
  updatedAt: string
  /** Índice exibido no topo; cada entrada aponta para uma LegalSection. */
  toc?: TocEntry[]
  children: ReactNode
}

/** Casca comum das páginas legais: navbar, cabeçalho, índice, coluna de leitura e rodapé. */
export function LegalShell({ title, intro, updatedAt, toc, children }: LegalShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto w-full max-w-3xl px-4 py-28 sm:px-6 sm:py-32">
        <header className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
          <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
            Última atualização: {updatedAt}
          </p>
        </header>

        {toc && toc.length > 0 && (
          <nav
            aria-label="Índice do documento"
            className="mb-14 rounded-lg border border-border bg-card p-6 sm:p-7"
          >
            <h2 className="flex items-center gap-2.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
              <span aria-hidden="true" className="h-3 w-px bg-primary" />
              Índice
            </h2>
            <ol className="mt-5 space-y-2.5">
              {toc.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="group flex gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="font-mono text-xs leading-6 text-primary-text">{entry.number}</span>
                    <span className="underline-offset-4 group-hover:underline">{entry.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="space-y-12 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  )
}

interface LegalSectionProps {
  /** Numeração exibida em vermelho ao lado do título. */
  number: string
  title: string
  /** Alvo da âncora vinda do índice. */
  id?: string
  children: ReactNode
}

export function LegalSection({ number, title, id, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border pt-8">
      <span className="font-mono text-xs tracking-[0.1em] text-primary-text">{number}</span>
      <h2 className="mt-2 font-serif text-2xl text-foreground md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2.5">
      {children}
    </ul>
  )
}

export function LegalItem({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.6875em] before:h-1 before:w-1 before:rounded-full before:bg-primary/70">
      {children}
    </li>
  )
}

/** Destaque para termos definidos no corpo do texto (nomes de operadores, direitos, etc.). */
export function LegalTerm({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>
}
