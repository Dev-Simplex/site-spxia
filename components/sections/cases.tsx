"use client"

import { Check, ExternalLink, Zap } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { GlowHoverCard } from "@/components/ui/glow-hover-card"
import { SparklesText } from "@/components/ui/sparkles-text"
import { WobbleCard } from "@/components/ui/wobble-card"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n, type Locale } from "@/lib/i18n/context"

interface CaseItem {
  sector: string
  title: string
  desc: string
  metrics: string[]
  link: string | null
}

interface SectionCopy {
  number: string
  label: string
  title: string
  titleEm: string
  desc: string
  aiBadge: string
  items: CaseItem[]
}

const copy: Record<Locale, SectionCopy> = {
  pt: {
    number: "04",
    label: "CASES",
    title: "Projetos",
    titleEm: "em produção.",
    desc: "Não são protótipos. São sistemas rodando com dados reais e clientes pagando. Todos construídos através de desenvolvimento via IA.",
    aiBadge: "DESENVOLVIDO COM IA",
    items: [
      {
        sector: "AUTOMAÇÃO E AGENTES IA",
        title: "CopilotAB",
        desc: "Plataforma completa de automação com agentes de IA e WhatsApp. Atendimento inteligente, qualificação de leads e gestão de conversas. Tudo automatizado e monitorado em tempo real.",
        metrics: [
          "Agentes de IA autônomos",
          "Integração WhatsApp nativa",
          "Gestão de conversas em tempo real",
          "Qualificação automática de leads",
        ],
        link: null,
      },
      {
        sector: "ASSISTENTE VIRTUAL",
        title: "ChatSPX",
        desc: "Assistente virtual inteligente com IA conversacional avançada. Interface moderna, respostas contextuais e integração com bases de conhecimento customizadas para cada cliente.",
        metrics: [
          "IA conversacional avançada",
          "Base de conhecimento customizada",
          "Interface moderna e responsiva",
          "Respostas contextuais em tempo real",
        ],
        link: "https://www.chatspx.com.br/",
      },
      {
        sector: "ENERGIA SOLAR",
        title: "Gestão de Financiamento e Fomento",
        desc: "Sistema de gestão completo para financiamento e fomento de projetos de energia solar. Controle de propostas, simulações financeiras, acompanhamento de aprovações e relatórios gerenciais.",
        metrics: [
          "Simulação financeira automatizada",
          "Controle de propostas e aprovações",
          "Relatórios gerenciais completos",
          "Pipeline de financiamento integrado",
        ],
        link: null,
      },
      {
        sector: "ASSISTÊNCIA TÉCNICA",
        title: "Sistema de Ordens de Serviço",
        desc: "Sistema completo de gestão de OS com controle financeiro, estoque, clientes e relatórios. Redução de 60% no tempo de atendimento.",
        metrics: [
          "Gestão de OS completa",
          "Controle financeiro integrado",
          "Gestão de estoque e clientes",
          "-60% tempo de atendimento",
        ],
        link: null,
      },
      {
        sector: "PROSPECÇÃO B2B",
        title: "Captador Inteligente",
        desc: "Plataforma de prospecção com IA que identifica, qualifica e organiza leads automaticamente. Integração com WhatsApp e CRM.",
        metrics: [
          "Captação automática de leads",
          "Qualificação por IA",
          "Integração WhatsApp e CRM",
          "Pipeline de vendas integrado",
        ],
        link: null,
      },
      {
        sector: "ATENDIMENTO",
        title: "Agentes de IA no WhatsApp",
        desc: "Chatbots inteligentes que atendem, qualificam e encaminham clientes 24/7. Redução de 80% no tempo de resposta.",
        metrics: [
          "Atendimento 24/7",
          "Qualificação automática",
          "Encaminhamento inteligente",
          "-80% tempo de resposta",
        ],
        link: null,
      },
    ],
  },
  en: {
    number: "04",
    label: "CASES",
    title: "Projects",
    titleEm: "in production.",
    desc: "These aren't prototypes. These are systems running with real data and paying clients. All built through AI-powered development.",
    aiBadge: "BUILT WITH AI",
    items: [
      {
        sector: "AUTOMATION & AI AGENTS",
        title: "CopilotAB",
        desc: "Complete automation platform with AI agents and WhatsApp. Intelligent customer service, lead qualification and conversation management, all automated and monitored in real time.",
        metrics: [
          "Autonomous AI agents",
          "Native WhatsApp integration",
          "Real-time conversation management",
          "Automatic lead qualification",
        ],
        link: null,
      },
      {
        sector: "VIRTUAL ASSISTANT",
        title: "ChatSPX",
        desc: "Intelligent virtual assistant with advanced conversational AI. Modern interface, contextual responses and integration with custom knowledge bases for each client.",
        metrics: [
          "Advanced conversational AI",
          "Custom knowledge base",
          "Modern responsive interface",
          "Real-time contextual responses",
        ],
        link: "https://www.chatspx.com.br/",
      },
      {
        sector: "SOLAR ENERGY",
        title: "Financing & Funding Management",
        desc: "Complete management system for financing and funding of solar energy projects. Proposal control, financial simulations, approval tracking and management reports.",
        metrics: [
          "Automated financial simulation",
          "Proposal and approval control",
          "Complete management reports",
          "Integrated financing pipeline",
        ],
        link: null,
      },
      {
        sector: "TECHNICAL SUPPORT",
        title: "Service Order System",
        desc: "Complete service order management with financial control, inventory, clients and reports. 60% reduction in service time.",
        metrics: [
          "Full OS management",
          "Integrated financial control",
          "Inventory and client management",
          "-60% service time",
        ],
        link: null,
      },
      {
        sector: "B2B PROSPECTING",
        title: "Smart Lead Capture",
        desc: "AI-powered prospecting platform that identifies, qualifies and organizes leads automatically. WhatsApp and CRM integration.",
        metrics: [
          "Automatic lead capture",
          "AI-powered qualification",
          "WhatsApp and CRM integration",
          "Integrated sales pipeline",
        ],
        link: null,
      },
      {
        sector: "CUSTOMER SERVICE",
        title: "AI Agents on WhatsApp",
        desc: "Intelligent chatbots that serve, qualify and route customers 24/7. 80% reduction in response time.",
        metrics: [
          "24/7 support",
          "Automatic qualification",
          "Smart routing",
          "-80% response time",
        ],
        link: null,
      },
    ],
  },
}

// "https://www.chatspx.com.br/" -> "chatspx.com.br"
const displayUrl = (link: string) => link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

export function Cases() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reduceMotion = useReducedMotion()
  const scope = useAnimationScope<HTMLElement>()

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 28,
      filter: reduceMotion ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: "easeOut" },
      // Remove o filter no fim: blur(0px) residual rasteriza o texto do card.
      transitionEnd: { filter: "none" },
    },
  }

  return (
    <section {...scope} id="cases" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-serif text-4xl leading-none text-primary">{c.number}</span>
          <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {c.label}
          </span>
        </div>
        <h2 className="max-w-4xl font-serif text-3xl leading-tight text-foreground md:text-4xl">
          {c.title}{" "}
          <em className="text-primary">
            <SparklesText sparklesCount={7}>{c.titleEm}</SparklesText>
          </em>
        </h2>
        <p className="mt-4 max-w-[560px] text-muted-foreground">{c.desc}</p>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {c.items.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <GlowHoverCard>
                <WobbleCard
                  containerClassName="h-full border border-border transition-colors duration-300 group-hover/glow:border-primary/45"
                  className="flex h-full flex-col px-6 py-7 sm:px-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-300 group-hover/glow:text-foreground/70">
                      {item.sector}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-sm border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-primary-text transition-all duration-300 group-hover/glow:border-primary/50 group-hover/glow:bg-primary/20 group-hover/glow:shadow-[0_0_18px_-4px_rgba(249,1,8,0.65)]">
                      <Zap className="h-3 w-3" aria-hidden />
                      {c.aiBadge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-xl text-foreground md:text-2xl">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>

                  <ul className="mt-5 flex flex-col gap-2">
                    {item.metrics.map((metric) => (
                      <li key={metric} className="flex items-center gap-2 text-[0.8125rem] text-foreground/90">
                        <Check className="h-3.5 w-3.5 shrink-0 text-green-400" aria-hidden />
                        {metric}
                      </li>
                    ))}
                  </ul>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-5 inline-flex items-center gap-1.5 py-1 font-mono text-xs text-primary-text transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover/link:bg-[length:100%_1px]">
                        {displayUrl(item.link)}
                      </span>
                    </a>
                  )}
                </WobbleCard>
              </GlowHoverCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
