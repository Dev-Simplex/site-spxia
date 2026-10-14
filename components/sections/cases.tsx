"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { motion } from "motion/react"

import { useReveal } from "@/components/ui/motion-kit"
import { useI18n, type Locale } from "@/lib/i18n/context"

interface CaseItem {
  sector: string
  title: string
  desc: string
  benefits: string[]
}

interface SectionCopy {
  title: string
  titleEm: string
  desc: string
  chip: string
  items: CaseItem[]
}

// Decisões 8, 9 e P6 do PLANO: sem percentuais e sem o card ChatSPX.
const copy: Record<Locale, SectionCopy> = {
  pt: {
    title: "Soluções em uso",
    titleEm: "todos os dias.",
    desc: "Sistemas que empresas usam na rotina, com dados reais. Feitos pela nossa equipe com apoio de IA.",
    chip: "Cliente respondido na hora",
    items: [
      {
        sector: "Sistema personalizado premium",
        title: "Copilot",
        desc: "Um sistema exclusivo, feito sob medida para a operação do cliente.",
        benefits: ["Projeto exclusivo", "Feito para a rotina da equipe", "Acabamento premium"],
      },
      {
        sector: "Energia solar",
        title: "Gestão de Financiamento e Fomento",
        desc: "Propostas, simulações e aprovações de projetos solares num só lugar.",
        benefits: ["Simulações automáticas", "Relatórios para a gestão"],
      },
      {
        sector: "Assistência técnica",
        title: "Sistema de Ordens de Serviço",
        desc: "Ordens de serviço, financeiro, estoque e clientes num só sistema.",
        benefits: ["Financeiro integrado", "Atendimento mais rápido"],
      },
      {
        sector: "Prospecção de clientes",
        title: "Captador Inteligente",
        desc: "Encontra, qualifica e organiza novos contatos com IA.",
        benefits: ["Qualificação com IA", "WhatsApp e CRM juntos"],
      },
      {
        sector: "Atendimento",
        title: "Agentes de IA no WhatsApp",
        desc: "Atendem, qualificam e encaminham clientes a qualquer hora.",
        benefits: ["Resposta a qualquer hora", "Pessoa certa no atendimento"],
      },
    ],
  },
  en: {
    title: "Solutions in use",
    titleEm: "every day.",
    desc: "Systems companies use every day, with real data. Built by our team with the help of AI.",
    chip: "Customer answered right away",
    items: [
      {
        sector: "Premium custom system",
        title: "Copilot",
        desc: "An exclusive system, tailor-made for the client's operation.",
        benefits: ["Exclusive project", "Built around the team's routine", "Premium finish"],
      },
      {
        sector: "Solar energy",
        title: "Financing & Funding Management",
        desc: "Proposals, simulations and approvals for solar projects in one place.",
        benefits: ["Automatic simulations", "Management reports"],
      },
      {
        sector: "Technical support",
        title: "Service Order System",
        desc: "Service orders, finances, inventory and customers in one system.",
        benefits: ["Integrated finances", "Faster service"],
      },
      {
        sector: "Lead prospecting",
        title: "Smart Lead Capture",
        desc: "Finds, qualifies and organizes new contacts with AI.",
        benefits: ["AI qualification", "WhatsApp and CRM together"],
      },
      {
        sector: "Customer service",
        title: "AI agents on WhatsApp",
        desc: "Serve, qualify and route customers at any hour.",
        benefits: ["Answers at any hour", "The right person on each case"],
      },
    ],
  },
}

export function Cases() {
  const { locale } = useI18n()
  const c = copy[locale]
  const reveal = useReveal()

  return (
    <section id="cases" className="scroll-mt-24 bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-x-14 gap-y-10 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:px-10">
        <motion.header
          className="lg:col-span-7"
          {...reveal()}
        >
          <h2 className="text-balance text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {c.title} <strong className="font-bold">{c.titleEm}</strong>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{c.desc}</p>
        </motion.header>

        {/* Visual dominante: foto sobre a forma do símbolo, presa ao rolar no desktop. */}
        <motion.div
          className="relative aspect-[4/3] self-start overflow-hidden rounded-[28px] bg-surface sm:aspect-[16/10] lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:aspect-[4/5]"
          {...reveal(0.1)}
        >
          <Image
            src="/images/formas/simbolo-azul.svg"
            alt=""
            width={734}
            height={691}
            className="pointer-events-none absolute -bottom-[18%] -right-[30%] w-[110%] max-w-none lg:-bottom-[8%] lg:-right-[38%] lg:w-[135%]"
          />
          <Image
            src="/images/fotos/atendimento-celular.png"
            alt=""
            width={853}
            height={1280}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="absolute bottom-0 left-1/2 h-[94%] w-auto max-w-none -translate-x-1/2"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lg shadow-primary/10 sm:bottom-8 sm:left-8"
          >
            <span className="grid size-7 place-items-center rounded-full bg-brand-green text-white">
              <Check className="size-4" strokeWidth={3.5} />
            </span>
            {c.chip}
          </div>
        </motion.div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {c.items.map((item, index) => (
            <motion.li
              key={item.title}
              className="flex flex-col rounded-[20px] border border-border bg-card p-5 transition-[border-color,box-shadow] duration-300 sm:p-6 first:sm:col-span-2 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              {...reveal((index % 2) * 0.08)}
            >
              <span className="self-start rounded-full bg-primary/8 px-2.5 py-1 text-[0.8125rem] font-semibold text-primary">
                {item.sector}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">{item.desc}</p>
              <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-4">
                {item.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-1.5 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-brand-green" strokeWidth={2.5} aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
