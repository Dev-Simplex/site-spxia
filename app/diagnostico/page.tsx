'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  X,
} from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
if (!RECAPTCHA_SITE_KEY) {
  console.warn(
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY não configurada — o formulário do Diagnóstico não carregará o reCAPTCHA',
  )
}

interface Question {
  id: string
  label: string
  placeholder: string
}

const questions: Question[] = [
  { id: 'q1', label: 'Qual é o principal objetivo da empresa ao investir em IA?', placeholder: 'Ex.: aumentar vendas, reduzir custos, ganhar produtividade, melhorar atendimento, automatizar processos.' },
  { id: 'q2', label: 'Quais resultados hoje estão abaixo do esperado e precisam melhorar com urgência?', placeholder: 'Descreva as dores mais críticas do negócio.' },
  { id: 'q3', label: 'Quais processos da empresa são mais repetitivos, manuais e demorados?', placeholder: 'Esses são os primeiros candidatos para automação com IA.' },
  { id: 'q4', label: 'Quais áreas da empresa mais sofrem com gargalos?', placeholder: 'Ex.: Comercial, atendimento, financeiro, jurídico, RH, operações, marketing.' },
  { id: 'q5', label: 'Quais tarefas dependem muito de pessoas para analisar, responder, classificar ou decidir?', placeholder: 'Esses pontos costumam ter alto potencial para IA.' },
  { id: 'q6', label: 'Hoje a empresa perde dinheiro onde?', placeholder: 'Ex.: retrabalho, demora no atendimento, erros humanos, baixa conversão, falta de follow-up.' },
  { id: 'q7', label: 'Quais indicadores a empresa quer melhorar com IA?', placeholder: 'Ex.: faturamento, margem, NPS, tempo de resposta, taxa de conversão, produtividade.' },
  { id: 'q8', label: 'A empresa possui dados organizados para apoiar decisões?', placeholder: 'Sem dados minimamente estruturados, projetos de IA ficam limitados.' },
  { id: 'q9', label: 'Onde esses dados estão hoje?', placeholder: 'Ex.: ERP, CRM, planilhas, WhatsApp, e-mail, sistema financeiro, banco de dados.' },
  { id: 'q10', label: 'A qualidade dos dados atuais é confiável?', placeholder: 'Dados duplicados, incompletos ou desatualizados comprometem o resultado.' },
  { id: 'q11', label: 'A empresa já possui sistemas integráveis?', placeholder: 'Ex.: APIs, ERP, CRM, automações, banco de dados, plataformas de atendimento.' },
  { id: 'q12', label: 'Quais decisões hoje são tomadas mais por feeling do que por informação?', placeholder: 'A IA pode apoiar com previsões, análises e recomendações.' },
  { id: 'q13', label: 'Existe volume suficiente de demanda para justificar automação com IA?', placeholder: 'Ex.: grande número de leads, atendimentos, documentos, chamados, contratos.' },
  { id: 'q14', label: 'Quais atividades precisam acontecer com mais velocidade?', placeholder: 'Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte.' },
  { id: 'q15', label: 'Quais áreas precisam de maior padronização?', placeholder: 'IA funciona muito bem para manter padrão em comunicação, análise e execução.' },
  { id: 'q16', label: 'A equipe está preparada para usar IA no dia a dia?', placeholder: 'Maturidade digital, resistência cultural e necessidade de treinamento.' },
  { id: 'q17', label: 'Quem serão os responsáveis internos pelo projeto de IA?', placeholder: 'Sem dono do projeto, a implantação tende a perder força.' },
  { id: 'q18', label: 'Quais riscos a empresa precisa controlar ao usar IA?', placeholder: 'Ex.: segurança da informação, privacidade, erros, LGPD, impacto operacional.' },
  { id: 'q19', label: 'Qual orçamento e expectativa de retorno para a implantação?', placeholder: 'Define prioridade, escopo e velocidade do projeto.' },
  { id: 'q20', label: 'Se a IA desse certo em 90 dias, o que teria mudado na prática?', placeholder: 'Transforme intenção em meta objetiva e mensurável.' },
]

const QUESTIONS_PER_PAGE = 5
const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
// contato + páginas de perguntas + confirmação/captcha
const totalSteps = totalPages + 2

type Step = 'contact' | 'questions' | 'captcha' | 'sending' | 'success' | 'error'

const fieldClass =
  'w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/40'

const labelClass =
  'mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground'

const stepMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
}

export default function DiagnosticoPage() {
  const [step, setStep] = useState<Step>('contact')
  const [qPage, setQPage] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<ReCAPTCHA | null>(null)

  // Contato
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [business, setBusiness] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [industry, setIndustry] = useState('')

  // Respostas
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setValidationErrors((prev) => prev.filter((e) => e !== id))
  }

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStep('questions')
    setQPage(0)
  }

  function validateCurrentPage() {
    const pageQuestions = questions.slice(
      qPage * QUESTIONS_PER_PAGE,
      (qPage + 1) * QUESTIONS_PER_PAGE,
    )
    const missing = pageQuestions
      .filter((q) => !answers[q.id]?.trim())
      .map((q) => q.id)
    setValidationErrors(missing)
    return missing.length === 0
  }

  function nextPage() {
    if (!validateCurrentPage()) return

    if (qPage < totalPages - 1) {
      setQPage(qPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Última página — vai para a etapa de revisão + captcha
      setStep('captcha')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function prevPage() {
    setValidationErrors([])
    if (qPage > 0) setQPage(qPage - 1)
    else setStep('contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submitAll() {
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setErrorMsg('Complete o reCAPTCHA para enviar.')
      return
    }

    setStep('sending')
    setErrorMsg('')

    const { error } = await supabase.from('diagnostics').insert({
      name,
      email,
      whatsapp: whatsapp.replace(/\D/g, ''),
      business_description: business,
      company_name: companyName,
      cnpj: cnpj.replace(/\D/g, ''),
      industry,
      answers,
    })

    if (error) {
      setErrorMsg(error.message)
      setStep('error')
    } else {
      setStep('success')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentQuestions = questions.slice(
    qPage * QUESTIONS_PER_PAGE,
    (qPage + 1) * QUESTIONS_PER_PAGE,
  )
  const currentStep =
    step === 'contact' ? 1 : step === 'questions' ? qPage + 2 : totalSteps
  const progress = Math.round((currentStep / totalSteps) * 100)
  const showProgress = step === 'contact' || step === 'questions' || step === 'captcha'
  const answeredCount = Object.values(answers).filter((a) => a?.trim()).length

  return (
    <div className="relative isolate min-h-screen bg-background">
      {/* Brilho vermelho sutil no topo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(249,1,8,0.14),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Topo: logo + voltar + progresso */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Voltar para a home da SPXIA">
              <Logo width={104} height={34} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              Voltar ao site
            </Link>
          </div>

          {showProgress && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
                <span>
                  Etapa {currentStep} de {totalSteps}
                </span>
                <span className="text-primary-text">{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso do diagnóstico"
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Card central */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {/* ETAPA 1: CONTATO */}
            {step === 'contact' && (
              <motion.div key="contact" {...stepMotion}>
                <StepHeader
                  label={`ETAPA 1 DE ${totalSteps}`}
                  title="Seus"
                  titleEm="dados"
                  desc="Primeiro, nos conte sobre você e sua empresa."
                />

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-nome" className={labelClass}>
                        Seu nome *
                      </label>
                      <input
                        id="diag-nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nome completo"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-email" className={labelClass}>
                        E-mail *
                      </label>
                      <input
                        id="diag-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-whatsapp" className={labelClass}>
                        WhatsApp *
                      </label>
                      <input
                        id="diag-whatsapp"
                        inputMode="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        required
                        placeholder="(00) 00000-0000"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-empresa" className={labelClass}>
                        Nome da empresa *
                      </label>
                      <input
                        id="diag-empresa"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder="Empresa LTDA"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-cnpj" className={labelClass}>
                        CNPJ
                      </label>
                      <input
                        id="diag-cnpj"
                        inputMode="numeric"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-ramo" className={labelClass}>
                        Ramo de atuação *
                      </label>
                      <input
                        id="diag-ramo"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        placeholder="Ex.: Tecnologia, Varejo, Saúde, Indústria"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="diag-negocio" className={labelClass}>
                      Descreva brevemente seu negócio *
                    </label>
                    <textarea
                      id="diag-negocio"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      required
                      rows={3}
                      placeholder="O que sua empresa faz? Quantos funcionários? Quais os principais desafios?"
                      className={cn(fieldClass, 'resize-y')}
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                    <Button variant="outline" size="lg" asChild className="h-11">
                      <Link href="/">Cancelar</Link>
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 bg-primary-btn px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-btn/90"
                    >
                      Próximo
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ETAPA 2+: PERGUNTAS */}
            {step === 'questions' && (
              <motion.div key={`questions-${qPage}`} {...stepMotion}>
                <StepHeader
                  label={`ETAPA ${qPage + 2} DE ${totalSteps}`}
                  title="Diagnóstico"
                  titleEm="estratégico"
                  desc="Todas as perguntas são obrigatórias. Responda com o máximo de detalhes."
                />

                <div className="space-y-6">
                  {currentQuestions.map((q, i) => {
                    const hasError = validationErrors.includes(q.id)
                    const number = qPage * QUESTIONS_PER_PAGE + i + 1
                    return (
                      <div key={q.id}>
                        <label
                          htmlFor={`diag-${q.id}`}
                          className="mb-2 flex gap-2 text-sm leading-relaxed text-foreground"
                        >
                          <span className="font-mono text-primary-text">{number}.</span>
                          <span>
                            {q.label}
                            <span className="ml-1 text-primary-text">*</span>
                          </span>
                        </label>
                        <textarea
                          id={`diag-${q.id}`}
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder={q.placeholder}
                          rows={3}
                          aria-invalid={hasError}
                          className={cn(
                            fieldClass,
                            'resize-y',
                            hasError &&
                              'border-destructive focus:border-destructive focus:ring-destructive/40',
                          )}
                        />
                        {hasError && (
                          <span className="mt-1.5 block text-xs text-destructive">
                            Esta pergunta é obrigatória
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {validationErrors.length > 0 && (
                    <Banner>Preencha todas as perguntas antes de avançar.</Banner>
                  )}

                  <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-11"
                      onClick={prevPage}
                    >
                      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      onClick={nextPage}
                      className="h-11 bg-primary-btn px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-btn/90"
                    >
                      {qPage < totalPages - 1 ? 'Próximo' : 'Revisar e Enviar'}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPA FINAL: REVISÃO + CAPTCHA */}
            {step === 'captcha' && (
              <motion.div key="captcha" {...stepMotion}>
                <StepHeader
                  label="ETAPA FINAL"
                  title="Confirmar"
                  titleEm="envio"
                  desc="Revise seus dados e complete a verificação para enviar o diagnóstico."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <h3 className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-primary-text">
                      Seus dados
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <ReviewRow label="Nome" value={name} />
                      <ReviewRow label="E-mail" value={email} />
                      <ReviewRow label="WhatsApp" value={whatsapp} />
                      <ReviewRow label="Empresa" value={companyName} />
                      <ReviewRow label="Ramo" value={industry} />
                    </dl>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <h3 className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-primary-text">
                      Respostas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-serif text-3xl text-foreground">
                        {answeredCount}
                      </span>{' '}
                      de {questions.length} perguntas respondidas
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  {RECAPTCHA_SITE_KEY ? (
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setCaptchaToken(token)}
                      onExpired={() => setCaptchaToken(null)}
                      theme="dark"
                    />
                  ) : (
                    <Banner>
                      Verificação anti-spam indisponível: defina
                      NEXT_PUBLIC_RECAPTCHA_SITE_KEY para ativar o reCAPTCHA.
                    </Banner>
                  )}
                </div>

                {errorMsg && (
                  <div className="mt-4">
                    <Banner>{errorMsg}</Banner>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-11"
                    onClick={() => {
                      setStep('questions')
                      setQPage(totalPages - 1)
                    }}
                  >
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={submitAll}
                    disabled={Boolean(RECAPTCHA_SITE_KEY) && !captchaToken}
                    className="h-11 bg-primary-btn px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-btn/90"
                  >
                    Enviar diagnóstico
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ENVIANDO */}
            {step === 'sending' && (
              <motion.div
                key="sending"
                {...stepMotion}
                className="flex flex-col items-center py-10 text-center"
              >
                <Loader2
                  aria-hidden="true"
                  className="h-9 w-9 animate-spin text-primary"
                />
                <h2 className="mt-6 font-serif text-3xl text-foreground">
                  Enviando diagnóstico...
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estamos salvando suas respostas.
                </p>
              </motion.div>
            )}

            {/* SUCESSO */}
            {step === 'success' && (
              <motion.div
                key="success"
                {...stepMotion}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                  <Check aria-hidden="true" className="h-8 w-8 text-primary" />
                </div>
                <h1 className="mt-6 text-balance font-serif text-4xl leading-tight text-foreground">
                  Diagnóstico{' '}
                  <em className="italic text-primary">enviado!</em>
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Recebemos suas respostas e vamos analisar com IA antes de entrar
                  em contato. Você receberá uma pré-análise pelo e-mail e WhatsApp
                  em até 24h.
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <SuccessStep n={1} state="done" label="Dados coletados" />
                  <SuccessStep n={2} state="active" label="Análise com IA" />
                  <SuccessStep n={3} state="idle" label="Contato da equipe" />
                </div>

                <Button variant="outline" size="lg" asChild className="mt-8 h-11">
                  <Link href="/">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    Voltar ao site
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* ERRO */}
            {step === 'error' && (
              <motion.div
                key="error"
                {...stepMotion}
                className="flex flex-col items-center py-10 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 ring-1 ring-destructive/40">
                  <X aria-hidden="true" className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="mt-6 font-serif text-3xl text-foreground">
                  Erro ao enviar
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  {errorMsg}
                </p>
                <Button
                  size="lg"
                  className="mt-6 h-11 bg-primary-btn px-7 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-btn/90"
                  onClick={() => {
                    setStep('captcha')
                    setCaptchaToken(null)
                    setErrorMsg('')
                    captchaRef.current?.reset()
                  }}
                >
                  Tentar novamente
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground/70">
          SPX IA · seus dados são usados apenas para a análise do diagnóstico
        </p>
      </div>
    </div>
  )
}

function StepHeader({
  label,
  title,
  titleEm,
  desc,
}: {
  label: string
  title: string
  titleEm: string
  desc: string
}) {
  return (
    <div className="mb-8">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-primary-text">
        {label}
      </span>
      <h1 className="mt-2 text-balance font-serif text-3xl leading-tight text-foreground sm:text-4xl">
        {title}{' '}
        <em className="italic text-primary">{titleEm}</em>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="min-w-0 truncate text-foreground">{value || '—'}</dd>
    </div>
  )
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

function SuccessStep({
  n,
  state,
  label,
}: {
  n: number
  state: 'done' | 'active' | 'idle'
  label: string
}) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm',
        state === 'done' && 'border-primary/40 bg-primary/10 text-foreground',
        state === 'active' && 'border-primary bg-primary/15 text-foreground',
        state === 'idle' && 'border-border bg-background/40 text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs',
          state === 'idle'
            ? 'bg-white/10 text-muted-foreground'
            : 'bg-primary-btn text-primary-foreground',
        )}
      >
        {state === 'done' ? <Check aria-hidden="true" className="h-4 w-4" /> : n}
      </span>
      {label}
    </div>
  )
}
