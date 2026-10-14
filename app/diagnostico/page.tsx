'use client'

import { reveal } from "@/components/ui/motion-kit"
import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY não configurada; o formulário do Diagnóstico não carregará o reCAPTCHA',
  )
}

interface Question {
  id: string
  label: string
  placeholder: string
}

const questionCopy: Record<"pt" | "en", Question[]> = {
  "pt": [
    {
      "id": "q1",
      "label": "O que a empresa mais quer melhorar com IA?",
      "placeholder": "Ex.: vender mais, gastar menos, atender melhor, ganhar tempo."
    },
    {
      "id": "q2",
      "label": "O que hoje está abaixo do esperado e precisa melhorar logo?",
      "placeholder": "Conte o que mais preocupa no momento."
    },
    {
      "id": "q3",
      "label": "Quais tarefas se repetem mais e tomam mais tempo?",
      "placeholder": "Costumam ser as primeiras a ficar mais simples."
    },
    {
      "id": "q4",
      "label": "Em quais áreas o trabalho mais trava?",
      "placeholder": "Ex.: comercial, atendimento, financeiro, jurídico, RH, operações, marketing."
    },
    {
      "id": "q5",
      "label": "Quais tarefas dependem de alguém para analisar, responder, classificar ou decidir?",
      "placeholder": "Nesses pontos, a IA costuma ajudar bastante."
    },
    {
      "id": "q6",
      "label": "Onde a empresa perde dinheiro hoje?",
      "placeholder": "Ex.: retrabalho, demora para responder, erros, poucas vendas fechadas, cliente sem retorno."
    },
    {
      "id": "q7",
      "label": "Quais números a empresa quer ver melhorar?",
      "placeholder": "Ex.: faturamento, margem, satisfação dos clientes, tempo de resposta, vendas fechadas."
    },
    {
      "id": "q8",
      "label": "As informações da empresa estão organizadas?",
      "placeholder": "A IA trabalha melhor quando os dados têm alguma ordem."
    },
    {
      "id": "q9",
      "label": "Onde essas informações ficam hoje?",
      "placeholder": "Ex.: CRM, ERP, planilhas, WhatsApp, e-mail, sistema financeiro."
    },
    {
      "id": "q10",
      "label": "Dá para confiar nessas informações?",
      "placeholder": "Dados repetidos, incompletos ou desatualizados atrapalham o resultado."
    },
    {
      "id": "q11",
      "label": "Quais sistemas a empresa já usa?",
      "placeholder": "Ex.: CRM, ERP, plataforma de atendimento, automações, banco de dados."
    },
    {
      "id": "q12",
      "label": "Quais decisões hoje são tomadas mais no instinto do que com informação?",
      "placeholder": "A IA pode ajudar com análises, previsões e sugestões."
    },
    {
      "id": "q13",
      "label": "Quanto volume a empresa recebe por mês?",
      "placeholder": "Ex.: número de contatos, atendimentos, documentos, chamados ou contratos."
    },
    {
      "id": "q14",
      "label": "O que precisa acontecer mais rápido?",
      "placeholder": "Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte."
    },
    {
      "id": "q15",
      "label": "Onde falta padrão no jeito de fazer as coisas?",
      "placeholder": "A IA ajuda a manter o mesmo padrão na comunicação, na análise e na execução."
    },
    {
      "id": "q16",
      "label": "Como a equipe se sente em relação a usar IA no dia a dia?",
      "placeholder": "Familiaridade com tecnologia, resistência e necessidade de treinamento."
    },
    {
      "id": "q17",
      "label": "Quem vai cuidar do projeto dentro da empresa?",
      "placeholder": "Sem um responsável, a implantação perde força."
    },
    {
      "id": "q18",
      "label": "Que cuidados a empresa precisa ter ao usar IA?",
      "placeholder": "Ex.: segurança da informação, privacidade, LGPD, erros, impacto na operação."
    },
    {
      "id": "q19",
      "label": "Quanto a empresa pretende investir e que retorno espera?",
      "placeholder": "Isso ajuda a definir prioridade, tamanho e ritmo do projeto."
    },
    {
      "id": "q20",
      "label": "Se a IA desse certo em 90 dias, o que teria mudado na prática?",
      "placeholder": "Descreva uma meta clara, que dê para medir."
    }
  ],
  "en": [
    {
      "id": "q1",
      "label": "What does your company most want to improve with AI?",
      "placeholder": "e.g. sell more, spend less, serve customers better, save time."
    },
    {
      "id": "q2",
      "label": "What is below expectations today and needs to improve soon?",
      "placeholder": "Tell us what worries you most right now."
    },
    {
      "id": "q3",
      "label": "Which tasks repeat the most and take the most time?",
      "placeholder": "These are usually the first to get simpler."
    },
    {
      "id": "q4",
      "label": "Where does work get stuck the most?",
      "placeholder": "e.g. sales, customer service, finance, legal, HR, operations, marketing."
    },
    {
      "id": "q5",
      "label": "Which tasks need someone to review, answer, sort or decide?",
      "placeholder": "AI tends to help a lot here."
    },
    {
      "id": "q6",
      "label": "Where is your company losing money today?",
      "placeholder": "e.g. rework, slow replies, mistakes, few closed deals, customers left without follow-up."
    },
    {
      "id": "q7",
      "label": "Which numbers do you want to see improve?",
      "placeholder": "e.g. revenue, margin, customer satisfaction, response time, closed deals."
    },
    {
      "id": "q8",
      "label": "Is your company's information organized?",
      "placeholder": "AI works better when the data has some order."
    },
    {
      "id": "q9",
      "label": "Where is that information kept today?",
      "placeholder": "e.g. CRM, ERP, spreadsheets, WhatsApp, email, finance system."
    },
    {
      "id": "q10",
      "label": "Can you trust that information?",
      "placeholder": "Duplicate, incomplete or outdated data gets in the way."
    },
    {
      "id": "q11",
      "label": "Which systems does your company already use?",
      "placeholder": "e.g. CRM, ERP, customer service platform, automations, database."
    },
    {
      "id": "q12",
      "label": "Which decisions are made more on gut feeling than on information?",
      "placeholder": "AI can help with analysis, forecasts and suggestions."
    },
    {
      "id": "q13",
      "label": "How much volume does your company handle per month?",
      "placeholder": "e.g. number of leads, conversations, documents, tickets or contracts."
    },
    {
      "id": "q14",
      "label": "What needs to happen faster?",
      "placeholder": "e.g. customer service, quotes, proposals, screening, billing, support."
    },
    {
      "id": "q15",
      "label": "Where is there no standard way of doing things?",
      "placeholder": "AI helps keep the same standard in communication, analysis and execution."
    },
    {
      "id": "q16",
      "label": "How does your team feel about using AI day to day?",
      "placeholder": "Comfort with technology, resistance and training needs."
    },
    {
      "id": "q17",
      "label": "Who will own the project inside your company?",
      "placeholder": "Without an owner, the rollout tends to lose steam."
    },
    {
      "id": "q18",
      "label": "What does your company need to be careful about when using AI?",
      "placeholder": "e.g. information security, privacy, data protection law (LGPD), errors, impact on operations."
    },
    {
      "id": "q19",
      "label": "How much do you plan to invest, and what return do you expect?",
      "placeholder": "This helps set the priority, size and pace of the project."
    },
    {
      "id": "q20",
      "label": "If AI worked out in 90 days, what would have changed in practice?",
      "placeholder": "Describe a clear goal you could measure."
    }
  ]
}

const QUESTIONS_PER_PAGE = 5
const totalPages = Math.ceil(questionCopy.pt.length / QUESTIONS_PER_PAGE)
// contato + páginas de perguntas + confirmação/captcha
const totalSteps = totalPages + 2

type Step = 'contact' | 'questions' | 'captcha' | 'sending' | 'success' | 'error'

const fieldClass =
  'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40'

const labelClass =
  'mb-2 block text-sm font-medium text-foreground'

const copy = {
  "pt": {
    "home": "Voltar ao site",
    "homeAria": "Voltar para a página inicial da SPXia",
    "step": "Etapa",
    "of": "de",
    "progress": "Progresso do diagnóstico",
    "start": "Para",
    "startEm": "começar",
    "intro": "Conte um pouco sobre você e sua empresa.",
    "name": "Seu nome",
    "fullName": "Nome completo",
    "email": "E-mail",
    "emailPlaceholder": "seu@email.com",
    "company": "Nome da empresa",
    "companyPlaceholder": "Empresa LTDA",
    "cnpj": "CNPJ",
    "industry": "Ramo de atuação",
    "industryPlaceholder": "Ex.: imobiliária, incorporadora, varejo, saúde",
    "business": "Conte sobre o seu negócio",
    "businessPlaceholder": "O que sua empresa faz? Quantas pessoas trabalham nela? O que mais toma tempo hoje?",
    "cancel": "Cancelar",
    "next": "Próximo",
    "back": "Voltar",
    "review": "Revisar e enviar",
    "routine": "Como é a",
    "routineEm": "sua rotina",
    "required": "Responda todas as perguntas com detalhes para ajudar na análise.",
    "fieldRequired": "Responda esta pergunta para continuar",
    "missing": "Ainda faltam respostas nesta página.",
    "confirm": "Tudo",
    "confirmEm": "certo?",
    "confirmDesc": "Confira seus dados e faça a verificação para enviar.",
    "details": "Seus dados",
    "answers": "Suas respostas",
    "reviewName": "Nome",
    "reviewCompany": "Empresa",
    "reviewIndustry": "Ramo",
    "answered": "perguntas respondidas",
    "verify": "Faça a verificação para enviar.",
    "unavailable": "A verificação está indisponível; tente novamente mais tarde.",
    "send": "Enviar diagnóstico",
    "sending": "Enviando…",
    "saving": "Estamos salvando suas respostas.",
    "received": "Recebemos",
    "receivedEm": "suas respostas.",
    "success": "Vamos analisar suas respostas e entrar em contato por e-mail e WhatsApp.",
    "collected": "Respostas recebidas",
    "analysis": "Análise com IA",
    "contact": "Conversa com a equipe",
    "error": "Não conseguimos enviar",
    "errorDesc": "Tente novamente em instantes; suas respostas continuam aqui.",
    "retry": "Tentar novamente",
    "privacy": "SPXia · Seus dados são usados apenas para este diagnóstico."
  },
  "en": {
    "home": "Back to the site",
    "homeAria": "Back to the SPXia home page",
    "step": "Step",
    "of": "of",
    "progress": "Diagnosis progress",
    "start": "Let’s",
    "startEm": "get started",
    "intro": "Tell us a little about you and your company.",
    "name": "Your name",
    "fullName": "Full name",
    "email": "Email",
    "emailPlaceholder": "you@email.com",
    "company": "Company name",
    "companyPlaceholder": "Company Ltd.",
    "cnpj": "CNPJ (Brazilian company ID)",
    "industry": "Industry",
    "industryPlaceholder": "e.g. real estate agency, developer, retail, healthcare",
    "business": "Tell us about your business",
    "businessPlaceholder": "What does your company do? How many people work there? What takes up the most time today?",
    "cancel": "Cancel",
    "next": "Next",
    "back": "Back",
    "review": "Review and send",
    "routine": "Your",
    "routineEm": "day-to-day",
    "required": "Answer every question in detail to help with the analysis.",
    "fieldRequired": "Answer this question to continue",
    "missing": "Some questions on this page are still unanswered.",
    "confirm": "All",
    "confirmEm": "set?",
    "confirmDesc": "Check your details and complete the verification to send.",
    "details": "Your details",
    "answers": "Your answers",
    "reviewName": "Name",
    "reviewCompany": "Company",
    "reviewIndustry": "Industry",
    "answered": "questions answered",
    "verify": "Complete the verification to send.",
    "unavailable": "Verification is unavailable; please try again later.",
    "send": "Send diagnosis",
    "sending": "Sending…",
    "saving": "We’re saving your answers.",
    "received": "We got",
    "receivedEm": "your answers.",
    "success": "We’ll review your answers and contact you by email and WhatsApp.",
    "collected": "Answers received",
    "analysis": "AI analysis",
    "contact": "Talk with our team",
    "error": "We couldn’t send it",
    "errorDesc": "Please try again in a moment; your answers are still here.",
    "retry": "Try again",
    "privacy": "SPXia · Your data is used only for this diagnosis."
  }
}

export default function DiagnosticoPage() {
  const { locale } = useI18n()
  const c = copy[locale]
  const questions = questionCopy[locale]
  const reduceMotion = useReducedMotion()
  const stepMotion = {
    initial: reduceMotion ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -16 },
    transition: { duration: reduceMotion ? 0 : 0.35 },
  }
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
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    } else {
      // Última página; vai para a etapa de revisão + captcha
      setStep('captcha')
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }

  function prevPage() {
    setValidationErrors([])
    if (qPage > 0) setQPage(qPage - 1)
    else setStep('contact')
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  async function submitAll() {
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setErrorMsg(c.verify)
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
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
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
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        {/* Topo: logo + voltar + progresso */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label={c.homeAria}>
              <Logo height={30} />
            </Link>
            <div className="flex items-center gap-3"><LanguageSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              {c.home}
            </Link></div>
          </div>

          {showProgress && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {c.step} {currentStep} {c.of} {totalSteps}
                </span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={c.progress}
                className="h-1.5 w-full overflow-hidden rounded-full bg-surface"
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )}
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.aside {...reveal()} initial={reduceMotion ? false : { opacity: 0, y: 16 }} className="motion-reduce:!opacity-100 motion-reduce:!transform-none relative flex h-52 items-center justify-center overflow-hidden rounded-[2rem] bg-surface p-6 lg:sticky lg:top-8 lg:h-[520px]" aria-hidden="true">
          <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} sizes="(min-width: 1024px) 450px, 90vw" className="absolute -right-20 -top-20 w-[115%] max-w-none" />
          <Image src="/images/ilustracoes/diagnostico.png" alt="" width={1200} height={968} sizes="(min-width: 1024px) 400px, 220px" className="relative h-48 w-auto object-contain lg:h-auto lg:w-full" />
        </motion.aside>
        <div className="min-w-0 rounded-[2rem] border border-border bg-background p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {/* ETAPA 1: CONTATO */}
            {step === 'contact' && (
              <motion.div key="contact" {...stepMotion}>
                <StepHeader
                  title={c.start}
                  titleEm={c.startEm}
                  desc={c.intro}
                />

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-nome" className={labelClass}>
                        {c.name} *
                      </label>
                      <input
                        id="diag-nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder={c.fullName}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="diag-email" className={labelClass}>
                        {c.email} *
                      </label>
                      <input
                        id="diag-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={c.emailPlaceholder}
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
                        {c.company} *
                      </label>
                      <input
                        id="diag-empresa"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder={c.companyPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="diag-cnpj" className={labelClass}>
                        {c.cnpj}
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
                        {c.industry} *
                      </label>
                      <input
                        id="diag-ramo"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        placeholder={c.industryPlaceholder}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="diag-negocio" className={labelClass}>
                      {c.business} *
                    </label>
                    <textarea
                      id="diag-negocio"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      required
                      rows={3}
                      placeholder={c.businessPlaceholder}
                      className={cn(fieldClass, 'resize-y')}
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                    <Button variant="outline" size="lg" asChild className="h-11">
                      <Link href="/">{c.cancel}</Link>
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 px-7"
                    >
                      {c.next}
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
                  title={c.routine}
                  titleEm={c.routineEm}
                  desc={c.required}
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
                          <span className="text-primary">{number}.</span>
                          <span>
                            {q.label}
                            <span className="ml-1 text-primary">*</span>
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
                            {c.fieldRequired}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {validationErrors.length > 0 && (
                    <Banner>{c.missing}</Banner>
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
                      {c.back}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      onClick={nextPage}
                      className="h-11 px-7"
                    >
                      {qPage < totalPages - 1 ? c.next : c.review}
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
                  title={c.confirm}
                  titleEm={c.confirmEm}
                  desc={c.confirmDesc}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <h3 className="mb-3 text-xs text-primary">
                      {c.details}
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <ReviewRow label={c.reviewName} value={name} />
                      <ReviewRow label={c.email} value={email} />
                      <ReviewRow label="WhatsApp" value={whatsapp} />
                      <ReviewRow label={c.reviewCompany} value={companyName} />
                      <ReviewRow label={c.reviewIndustry} value={industry} />
                    </dl>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <h3 className="mb-3 text-xs text-primary">
                      {c.answers}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-3xl text-foreground">
                        {answeredCount}
                      </span>{' '}
                      {c.of} {questions.length} {c.answered}
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
                      theme="light"
                    />
                  ) : (
                    <Banner>
                      {c.unavailable}
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
                    {c.back}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={submitAll}
                    disabled={Boolean(RECAPTCHA_SITE_KEY) && !captchaToken}
                    className="h-11 px-7"
                  >
                    {c.send}
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
                  className="h-9 w-9 animate-spin motion-reduce:animate-none text-primary"
                />
                <h2 className="mt-6 text-3xl text-foreground">
                  {c.sending}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.saving}
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
                <h1 className="mt-6 text-balance text-4xl leading-tight text-foreground">
                  {c.received}{' '}
                  <strong className="font-bold">{c.receivedEm}</strong>
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {c.success}
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <SuccessStep n={1} state="done" label={c.collected} />
                  <SuccessStep n={2} state="active" label={c.analysis} />
                  <SuccessStep n={3} state="idle" label={c.contact} />
                </div>

                <Button variant="outline" size="lg" asChild className="mt-8 h-11">
                  <Link href="/">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    {c.home}
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
                <h2 className="mt-6 text-3xl text-foreground">
                  {c.error}
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  {c.errorDesc}
                </p>
                <Button
                  size="lg"
                  className="mt-6 h-11 px-7"
                  onClick={() => {
                    setStep('captcha')
                    setCaptchaToken(null)
                    setErrorMsg('')
                    captchaRef.current?.reset()
                  }}
                >
                  {c.retry}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {c.privacy}
        </p>
      </div>
    </div>
  )
}

function StepHeader({
  title,
  titleEm,
  desc,
}: {
  title: string
  titleEm: string
  desc: string
}) {
  return (
    <div className="mb-8">
      <h1 className="mt-2 text-balance text-3xl font-normal tracking-tight leading-tight text-foreground sm:text-4xl">
        {title}{' '}
        <strong className="font-bold">{titleEm}</strong>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  const { locale } = useI18n()
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="min-w-0 truncate text-foreground">{value || (locale === 'pt' ? 'Não informado' : 'Not provided')}</dd>
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
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
          state === 'idle'
            ? 'bg-surface text-muted-foreground'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {state === 'done' ? <Check aria-hidden="true" className="h-4 w-4" /> : n}
      </span>
      {label}
    </div>
  )
}
