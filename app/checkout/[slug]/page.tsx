"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
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

const cycleLabels: Record<string, string> = {
  MONTHLY: "/mês",
  QUARTERLY: "/trim",
  SEMIANNUALLY: "/sem",
  YEARLY: "/ano",
}

const billingOptions: { value: BillingType; label: string; Icon: typeof Zap }[] = [
  { value: "PIX", label: "Pix", Icon: Zap },
  { value: "BOLETO", label: "Boleto", Icon: FileText },
  { value: "CREDIT_CARD", label: "Cartão", Icon: CreditCard },
]

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"

export default function CheckoutPage() {
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
      if (result?.error) throw new Error(result.message || "Erro ao processar pagamento")

      setPaymentData(result)
      setStep("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao processar pagamento")
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
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
          Carregando...
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <SearchX className="h-7 w-7 text-primary-text" aria-hidden />
          </div>
          <h1 className="mt-5 font-serif text-2xl text-foreground">Produto não encontrado</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O link que você acessou não corresponde a nenhum produto disponível. Ele pode ter
            saído do ar ou o endereço foi digitado errado.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/diagnostico"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary-btn px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-btn/90"
            >
              Agendar Diagnóstico
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Voltar para a home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const price = Number(product.price)
  const cycleSuffix =
    product.type === "subscription" && product.billing_cycle
      ? cycleLabels[product.billing_cycle] ?? ""
      : ""

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <Link href="/" className="mb-8 inline-flex" aria-label="Voltar para a home">
          <Logo />
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Resumo do produto */}
          <aside className="border-b border-border bg-secondary/40 p-6 sm:p-8 md:border-b-0 md:border-r">
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-primary-text">
              {product.category || "Resumo do pedido"}
            </span>

            {product.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.thumbnail_url}
                alt={product.title}
                loading="lazy"
                className="mt-4 h-40 w-full rounded-xl object-cover"
              />
            )}

            <h1 className="mt-4 font-serif text-2xl leading-tight text-foreground">
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
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" aria-hidden />
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
              <span className="font-serif text-3xl leading-tight text-foreground">
                R$ {price.toFixed(2)}
                {cycleSuffix && (
                  <span className="font-sans text-sm text-muted-foreground">{cycleSuffix}</span>
                )}
              </span>
              {product.type === "one_time" && (product.max_installments ?? 0) > 1 && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  ou {product.max_installments}x R${" "}
                  {(price / Number(product.max_installments)).toFixed(2)}
                </span>
              )}
            </div>
          </aside>

          {/* Formulário / resultado */}
          <section className="p-6 sm:p-8">
            {step === "form" && (
              <>
                <h2 className="font-serif text-2xl text-foreground">Dados para pagamento</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Preencha seus dados para gerar a cobrança.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      Nome completo *
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder="Seu nome"
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cpfCnpj" className="text-xs font-medium text-muted-foreground">
                      CPF ou CNPJ *
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
                      Forma de pagamento *
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {billingOptions.map(({ value, label, Icon }) => {
                        const selected = billingType === value
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-colors ${
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
                            {label}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary-btn px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-btn/90"
                  >
                    {product.type === "subscription" ? "Assinar" : "Pagar"} R$ {price.toFixed(2)}
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    Pagamento processado com segurança via Asaas
                  </p>
                </form>
              </>
            )}

            {step === "processing" && (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
                <h2 className="mt-5 font-serif text-2xl text-foreground">
                  Processando pagamento...
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aguarde, estamos gerando sua cobrança.
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
                  <Check className="h-7 w-7 text-green-400" aria-hidden />
                </div>
                <h2 className="mt-4 font-serif text-2xl text-foreground">Cobrança gerada!</h2>

                {paymentData?.pixData && (
                  <div className="mt-6 w-full">
                    {paymentData.pixData.encodedImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`data:image/png;base64,${paymentData.pixData.encodedImage}`}
                        alt="QR Code do Pix"
                        className="mx-auto h-56 w-56 rounded-xl bg-white p-2"
                      />
                    )}

                    {paymentData.pixData.payload && (
                      <div className="mt-4 flex flex-col gap-1.5 text-left">
                        <label
                          htmlFor="pix-payload"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Pix Copia e Cola
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
                            className={`${fieldClass} cursor-pointer font-mono text-xs`}
                          />
                          <button
                            type="button"
                            onClick={() => copyPixPayload(paymentData.pixData!.payload!)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-3 text-xs font-medium text-foreground transition-colors hover:border-primary/50"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-green-400" aria-hidden />
                            ) : (
                              <Copy className="h-3.5 w-3.5" aria-hidden />
                            )}
                            {copied ? "Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground">Clique para copiar</span>
                      </div>
                    )}
                  </div>
                )}

                {paymentData?.bankSlipUrl && (
                  <a
                    href={paymentData.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary-btn px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-btn/90"
                  >
                    Abrir Boleto
                  </a>
                )}

                {paymentData?.invoiceUrl && (
                  <a
                    href={paymentData.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-5 py-3.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    Ver Fatura
                  </a>
                )}

                <div className="mt-8 w-full rounded-xl border border-border bg-background/60 p-5 text-left">
                  <p className="text-sm text-muted-foreground">
                    Após a confirmação do pagamento, seu acesso será liberado automaticamente.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Use o e-mail <strong className="text-foreground">{email}</strong> para acessar a
                    plataforma.
                  </p>
                  <Link
                    href="/login"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    Acessar Plataforma
                  </Link>
                </div>
              </div>
            )}

            {step === "error" && (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                  <AlertCircle className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <h2 className="mt-4 font-serif text-2xl text-foreground">Erro no pagamento</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-btn px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-btn/90"
                >
                  Tentar novamente
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
