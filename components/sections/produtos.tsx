"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n, type Locale } from "@/lib/i18n/context"

// Decisão do cliente: código pronto, seção oculta no front até ativar via env
const SHOW_PRODUCTS = process.env.NEXT_PUBLIC_SHOW_PRODUCTS === "true"

interface Product {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  thumbnail_url: string | null
  features: string[] | null
  price: number
  original_price: number | null
  type: "one_time" | "subscription"
  billing_cycle: "MONTHLY" | "QUARTERLY" | "SEMIANNUALLY" | "YEARLY" | null
  max_installments: number | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
}

const cycleLabels: Record<Locale, Record<string, string>> = {
  pt: { MONTHLY: "/mês", QUARTERLY: "/trimestre", SEMIANNUALLY: "/semestre", YEARLY: "/ano" },
  en: { MONTHLY: "/month", QUARTERLY: "/quarter", SEMIANNUALLY: "/6 months", YEARLY: "/year" },
}

const copy: Record<
  Locale,
  {
    title: string
    titleEm: string
    desc: string
    or: string
    buy: string
    subscribe: string
  }
> = {
  pt: {
    title: "Aprenda",
    titleEm: "no seu ritmo.",
    desc: "Cursos, mentorias e materiais para usar IA na rotina da sua empresa.",
    or: "ou",
    buy: "Comprar",
    subscribe: "Assinar",
  },
  en: {
    title: "Learn",
    titleEm: "at your own pace.",
    desc: "Courses, mentoring and materials to bring AI into your company's routine.",
    or: "or",
    buy: "Buy",
    subscribe: "Subscribe",
  },
}

export function Produtos() {
  const { locale } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!SHOW_PRODUCTS) return
    let cancelled = false
    // Import dinâmico: com a seção oculta, o client Supabase nem entra no bundle
    import("@/lib/supabase")
      .then(({ supabase }) =>
        supabase.from("products").select("*").eq("is_published", true).order("sort_order")
      )
      .then(({ data }) => {
        if (cancelled) return
        setProducts((data as Product[]) ?? [])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!SHOW_PRODUCTS || loading || products.length === 0) return null

  const c = copy[locale]
  const featured = products.filter((p) => p.is_featured)
  const others = products.filter((p) => !p.is_featured)

  return (
    <section id="produtos" className="scroll-mt-24 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-8 md:py-32 lg:px-10">
        <h2 className="max-w-4xl text-balance text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl">
          {c.title} <strong className="font-bold">{c.titleEm}</strong>
        </h2>
        <p className="mt-5 max-w-[560px] text-lg text-muted-foreground">{c.desc}</p>

        {featured.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} featured />
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({
  product: p,
  locale,
  featured,
}: {
  product: Product
  locale: Locale
  featured?: boolean
}) {
  const c = copy[locale]
  const cycles = cycleLabels[locale] ?? cycleLabels.pt

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[20px] border bg-card ${
        featured
          ? "border-primary/40 shadow-lg shadow-primary/10 md:flex-row"
          : "h-full border-border"
      }`}
    >
      {p.thumbnail_url && (
        <img
          src={p.thumbnail_url}
          alt={p.title}
          loading="lazy"
          className={
            featured
              ? "h-44 w-full object-cover md:h-auto md:min-h-[280px] md:w-[300px]"
              : "h-44 w-full object-cover"
          }
        />
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {p.category && (
          <span className="mb-3 self-start rounded-full bg-primary/8 px-2.5 py-1 text-[0.8125rem] font-semibold text-primary">
            {p.category}
          </span>
        )}
        <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{p.title}</h3>
        {p.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        )}

        {Array.isArray(p.features) && p.features.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5">
            {p.features.slice(0, 5).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-brand-green" strokeWidth={2.5} aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-col gap-0.5 pt-5">
          {p.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {Number(p.original_price).toFixed(2)}
            </span>
          )}
          <span className="text-3xl font-bold leading-tight tracking-tight text-foreground">
            R$ {Number(p.price).toFixed(2)}
            {p.type === "subscription" && p.billing_cycle && (
              <span className="text-sm font-normal text-muted-foreground">
                {cycles[p.billing_cycle] ?? ""}
              </span>
            )}
          </span>
          {p.type === "one_time" && (p.max_installments ?? 0) > 1 && (
            <span className="text-xs text-muted-foreground">
              {c.or} {p.max_installments}x R$ {(Number(p.price) / Number(p.max_installments)).toFixed(2)}
            </span>
          )}
        </div>

        <Button asChild size="lg" className="mt-5 w-full">
          <Link href={`/checkout/${p.slug}`}>{p.type === "subscription" ? c.subscribe : c.buy}</Link>
        </Button>
      </div>
    </div>
  )
}
