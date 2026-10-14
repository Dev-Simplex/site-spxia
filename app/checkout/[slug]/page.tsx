"use client"

import { reveal } from "@/components/ui/motion-kit"
import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"
import { useParams } from "next/navigation"
import { AlertCircle, Check, Copy, CreditCard, FileText, Loader2, SearchX, Zap } from "lucide-react"

import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase"

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

/** Retorno da RPC `checkout` (setup-checkout-v2.sql). */
interface CheckoutResult {
  success?: boolean
  error?: boolean
  message?: string
  paymentId?: string | null
  subscriptionId?: string | null
  invoiceUrl?: string | null
  bankSlipUrl?: string | null
  pixData?: {
    encodedImage?: string | null
    payload?: string | null
    expirationDate?: string | null
  } | null
  status?: string
  orderId?: string
  userExists?: boolean
}

type Step = "form" | "processing" | "success" | "error"
type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD"

const cycleLabels: Record<"pt" | "en", Record<string, string>> = {
  pt: { MONTHLY: "/mês", QUARTERLY: "/trimestre", SEMIANNUALLY: "/semestre", YEARLY: "/ano" },
  en: { MONTHLY: "/month", QUARTERLY: "/quarter", SEMIANNUALLY: "/6 months", YEARLY: "/year" },
}

const billingOptions: { value: BillingType; label: string; Icon: typeof Zap }[] = [
  { value: "PIX", label: "Pix", Icon: Zap },
  { value: "BOLETO", label: "Boleto", Icon: FileText },
  { value: "CREDIT_CARD", label: "Cartão", Icon: CreditCard },
]

const fieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"

const copy = {
  "pt": {
    "loading": "Carregando…",
    "notFound": "Produto não encontrado",
    "notFoundDesc": "Este link não leva a nenhum produto disponível.",
    "talk": "Vamos conversar",
    "home": "Voltar ao início",
    "summary": "Resumo do pedido",
    "or": "ou",
    "installments": "x de",
    "details": "Dados para pagamento",
    "detailsDesc": "Preencha seus dados para gerar a cobrança.",
    "name": "Nome completo",
    "namePlaceholder": "Seu nome",
    "email": "E-mail",
    "emailPlaceholder": "seu@email.com",
    "taxId": "CPF ou CNPJ",
    "method": "Forma de pagamento",
    "subscribe": "Assinar",
    "pay": "Pagar",
    "secure": "Pagamento seguro, processado pela Asaas",
    "processing": "Processando pagamento…",
    "processingDesc": "Só um instante, estamos gerando sua cobrança.",
    "created": "Cobrança gerada!",
    "qr": "QR Code do Pix",
    "pix": "Pix copia e cola",
    "copy": "Copiar",
    "copied": "Copiado!",
    "copyHint": "Clique para copiar",
    "bankSlip": "Abrir boleto",
    "invoice": "Ver fatura",
    "access": "Assim que o pagamento for confirmado, seu acesso é liberado automaticamente.",
    "useEmail": "Use o e-mail",
    "signIn": "para entrar na plataforma.",
    "platform": "Acessar plataforma",
    "error": "O pagamento não foi concluído",
    "errorDefault": "Não conseguimos processar o pagamento. Tente de novo.",
    "retry": "Tentar novamente"
  },
  "en": {
    "loading": "Loading…",
    "notFound": "Product not found",
    "notFoundDesc": "This link doesn’t lead to an available product.",
    "talk": "Let’s talk",
    "home": "Back to home",
    "summary": "Order summary",
    "or": "or",
    "installments": "installments of",
    "details": "Payment details",
    "detailsDesc": "Fill in your details to generate the charge.",
    "name": "Full name",
    "namePlaceholder": "Your name",
    "email": "Email",
    "emailPlaceholder": "you@email.com",
    "taxId": "CPF or CNPJ (Brazilian tax ID)",
    "method": "Payment method",
    "subscribe": "Subscribe",
    "pay": "Pay",
    "secure": "Secure payment processed by Asaas",
    "processing": "Processing payment…",
    "processingDesc": "One moment, we’re generating your charge.",
    "created": "Charge created!",
    "qr": "Pix QR code",
    "pix": "Pix copy-and-paste code",
    "copy": "Copy",
    "copied": "Copied!",
    "copyHint": "Click to copy",
    "bankSlip": "Open bank slip",
    "invoice": "View invoice",
    "access": "As soon as payment is confirmed, your access is unlocked automatically.",
    "useEmail": "Use",
    "signIn": "to sign in to the platform.",
    "platform": "Go to platform",
    "error": "Payment not completed",
    "errorDefault": "We couldn’t process the payment. Please try again.",
    "retry": "Try again"
  }
}

export default function CheckoutPage() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reduceMotion = useReducedMotion()
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>("form")
  const [errorMsg, setErrorMsg] = useState("")
  const [paymentData, setPaymentData] = useState<CheckoutResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [phone, setPhone] = useState("")
  const [billingType, setBillingType] = useState<BillingType>("PIX")

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        // Slug inválido ou produto despublicado: mostrar estado de "não
        // encontrado" em vez de redirecionar em silêncio para a home.
        if (error || !data) setProduct(null)
        else setProduct(data as Product)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!product) return

    setStep("processing")
    setErrorMsg("")

    try {
      const { data, error } = await supabase.rpc("checkout", {
        p_product_id: product.id,
        p_customer_name: name,
        p_customer_email: email,
        p_customer_cpf_cnpj: cpfCnpj.replace(/\D/g, ""),
        p_customer_phone: phone.replace(/\D/g, ""),
        p_billing_type: billingType,
      })

      if (error) throw new Error(error.message)
      const result = data as CheckoutResult | null
      if (result?.error) throw new Error(result.message || c.errorDefault)

      setPaymentData(result)
      setStep("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : c.errorDefault)
      setStep("error")
    }
  }

  function copyPixPayload(payload: string) {
    navigator.clipboard.writeText(payload).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      () => setCopied(false)
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-5">
        <Link href="/" aria-label={c.home}><Logo height={30} /></Link>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none text-primary" aria-hidden />
          {c.loading}
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background px-5 py-6">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Link href="/" aria-label={c.home}><Logo height={30} /></Link><LanguageSwitcher /></header>
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center py-10">
        <motion.div {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none w-full max-w-lg rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <SearchX className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl text-foreground">{c.notFound}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {c.notFoundDesc}
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <Button asChild><Link
              href="/diagnostico"
              className="h-12 w-full"
            >
              {c.talk}
            </Link></Button>
            <Button variant="outline" asChild><Link
              href="/"
              className="h-12 w-full"
            >
              {c.home}
            </Link></Button>
          </div>
        </motion.div>
        </div>
      </main>
    )
  }

  const price = Number(product.price)
  const cycleSuffix =
    product.type === "subscription" && product.billing_cycle
      ? cycleLabels[locale][product.billing_cycle] ?? ""
      : ""

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4"><Link href="/" aria-label={c.home}>
          <Logo height={30} />
        </Link><LanguageSwitcher /></header>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-background md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Resumo do produto */}
          <aside className="border-b border-border bg-surface p-6 sm:p-8 md:border-b-0 md:border-r">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
              {product.category || c.summary}
            </span>

            {product.thumbnail_url && (
              <div className="relative mt-4 h-40 overflow-hidden rounded-xl"><Image
                src={product.thumbnail_url}
                alt={product.title}
                fill
                sizes="(min-width: 768px) 420px, 90vw"
                unoptimized
                className="object-cover"
              /></div>
            )}

            <h1 className="mt-4 text-2xl leading-tight text-foreground">
              {product.title}
            </h1>
            {product.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {Array.isArray(product.features) && product.features.length > 0 && (
              <ul className="mt-5 flex flex-col gap-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[0.8125rem] text-foreground/90">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 border-t border-border pt-5">
              {product.original_price && (
                <span className="block text-sm text-muted-foreground line-through">
                  R$ {Number(product.original_price).toFixed(2)}
                </span>
              )}
              <span className="text-3xl leading-tight text-foreground">
                R$ {price.toFixed(2)}
                {cycleSuffix && (
                  <span className="font-sans text-sm text-muted-foreground">{cycleSuffix}</span>
                )}
              </span>
              {product.type === "one_time" && (product.max_installments ?? 0) > 1 && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {c.or} {product.max_installments}x R${" "}
                  {(price / Number(product.max_installments)).toFixed(2)}
                </span>
              )}
            </div>
          </aside>

          {/* Formulário / resultado */}
          <section className="p-6 sm:p-8">
            {step === "form" && (
              <>
                <h2 className="text-2xl text-foreground">{c.details}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.detailsDesc}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      {c.name} *
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder={c.namePlaceholder}
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      {c.email} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder={c.emailPlaceholder}
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cpfCnpj" className="text-xs font-medium text-muted-foreground">
                      {c.taxId} *
                    </label>
                    <input
                      id="cpfCnpj"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      required
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                      WhatsApp
                    </label>
                    <input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      className={fieldClass}
                    />
                  </div>

                  <fieldset className="flex flex-col gap-1.5">
                    <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
                      {c.method} *
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {billingOptions.map(({ value, label, Icon }) => {
                        const selected = billingType === value
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors focus-within:ring-2 focus-within:ring-primary ${
                              selected
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="billingType"
                              value={value}
                              checked={selected}
                              onChange={() => setBillingType(value)}
                              className="sr-only"
                            />
                            <Icon
                              className={`h-4 w-4 ${selected ? "text-primary" : ""}`}
                              aria-hidden
                            />
                            {locale === "en" ? (value === "CREDIT_CARD" ? "Card" : value === "BOLETO" ? "Bank slip" : label) : label}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <Button
                    type="submit"
                    className="mt-2 h-12 w-full"
                  >
                    {product.type === "subscription" ? c.subscribe : c.pay} R$ {price.toFixed(2)}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    {c.secure}
                  </p>
                </form>
              </>
            )}

            {step === "processing" && (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin motion-reduce:animate-none text-primary" aria-hidden />
                <h2 className="mt-5 text-2xl text-foreground">
                  {c.processing}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.processingDesc}
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/15">
                  <Check className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <h2 className="mt-4 text-2xl text-foreground">{c.created}</h2>

                {paymentData?.pixData && (
                  <div className="mt-6 w-full">
                    {paymentData.pixData.encodedImage && (
                      <Image
                        unoptimized
                        width={224}
                        height={224}
                        sizes="224px"
                        src={`data:image/png;base64,${paymentData.pixData.encodedImage}`}
                        alt={c.qr}
                        className="mx-auto h-56 w-56 rounded-xl bg-background p-2"
                      />
                    )}

                    {paymentData.pixData.payload && (
                      <div className="mt-4 flex flex-col gap-1.5 text-left">
                        <label
                          htmlFor="pix-payload"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          {c.pix}
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="pix-payload"
                            readOnly
                            value={paymentData.pixData.payload}
                            onClick={(e) => {
                              e.currentTarget.select()
                              copyPixPayload(paymentData.pixData!.payload!)
                            }}
                            className={`${fieldClass} cursor-pointer text-xs`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => copyPixPayload(paymentData.pixData!.payload!)}
                            className="h-12 shrink-0 px-3 text-xs"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                            ) : (
                              <Copy className="h-3.5 w-3.5" aria-hidden />
                            )}
                            {copied ? c.copied : c.copy}
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">{c.copyHint}</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentData?.bankSlipUrl && (
                  <Button asChild><a
                    href={paymentData.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 h-12 w-full"
                  >
                    {c.bankSlip}
                  </a></Button>
                )}

                {paymentData?.invoiceUrl && (
                  <Button variant="outline" asChild><a
                    href={paymentData.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 h-12 w-full"
                  >
                    {c.invoice}
                  </a></Button>
                )}

                <div className="mt-8 w-full rounded-xl border border-border bg-surface p-5 text-left">
                  <p className="text-sm text-muted-foreground">
                    {c.access}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {c.useEmail} <strong className="break-all text-foreground">{email}</strong> {c.signIn}
                  </p>
                  <Button variant="outline" asChild><Link
                    href="/login"
                    className="mt-4 h-12 w-full"
                  >
                    {c.platform}
                  </Link></Button>
                </div>
              </div>
            )}

            {step === "error" && (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                  <AlertCircle className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <h2 className="mt-4 text-2xl text-foreground">{c.error}</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{errorMsg}</p>
                <Button
                  type="button"
                  onClick={() => setStep("form")}
                  className="mt-6 h-12 px-6"
                >
                  {c.retry}
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
