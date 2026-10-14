"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion } from "motion/react"

import { BRAND_VIEWBOX, SYMBOL_STANDALONE } from "@/components/brand-paths"
import { CheckIcon } from "@/components/icons/animated/check"
import { CompassIcon } from "@/components/icons/animated/compass"
import { WorkflowIcon } from "@/components/icons/animated/workflow"
import { useIconPlay, useReveal, type AnimatedIcon } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

// Bento do mockup aprovado: Chat SPX (caixa de entrada) e VoxIA (ligação) com a
// interface do produto; Automações e Consultoria menores. O resto vira uma linha.
const copy = {
  pt: {
    title: "Tecnologia que ajuda.",
    titleEm: "Tempo para o que importa.",
    desc: "Produtos prontos para o atendimento e projetos sob medida para o resto da operação.",
    chat: {
      name: "Chat SPX",
      title: "Atendimento com IA,",
      titleEm: "a qualquer hora.",
      desc: "Responde em todos os canais e entrega a conversa para a pessoa certa.",
      inbox: "Caixa de entrada",
      live: "IA ativa",
      channels: ["WhatsApp", "Instagram", "Site", "E-mail"],
      who: "Carla Oliveira · 23:04",
      messages: [
        { fromAi: false, text: "Oi! Ainda tem unidade de 3 quartos?" },
        { fromAi: true, text: "Oi, Carla! Temos, sim. Você pensa em financiamento ou à vista?" },
        { fromAi: false, text: "Financiamento. Queria visitar no sábado." },
        { fromAi: true, text: "Perfeito! Vou passar você para a Juliana, que agenda a visita." },
      ],
      tags: ["3 quartos", "Financiamento", "Visita no sábado"],
      handoff: "Encaminhado para Juliana Martins",
      handoffRole: "Corretora · com todo o histórico",
    },
    vox: {
      name: "VoxIA",
      title: "A IA que",
      titleEm: "liga e atende.",
      desc: "Retorna o contato na hora, conversa por voz e agenda a visita.",
      status: "Em chamada",
      checks: ["Atende a qualquer hora", "Interesse: 3 quartos", "Visita agendada: sábado, 10h"],
    },
    small: [
      { title: "Automações sob medida", desc: "Cadastros, retornos e relatórios que rodam sozinhos." },
      { title: "Consultoria em IA", desc: "Mostramos onde a IA faz diferença antes de você investir." },
    ],
    also: "Também fazemos:",
    alsoItems: "sistemas sob medida · treinamento de equipes · assessoria contínua",
  },
  en: {
    title: "Technology that helps.",
    titleEm: "Time for what matters.",
    desc: "Ready-made products for customer service and custom projects for the rest of your operation.",
    chat: {
      name: "Chat SPX",
      title: "AI customer service,",
      titleEm: "at any hour.",
      desc: "Replies on every channel and hands the conversation to the right person.",
      inbox: "Inbox",
      live: "AI on",
      channels: ["WhatsApp", "Instagram", "Website", "Email"],
      who: "Carla Oliveira · 11:04 pm",
      messages: [
        { fromAi: false, text: "Hi! Do you still have a 3-bedroom unit?" },
        { fromAi: true, text: "Hi, Carla! We do. Are you thinking of financing or paying upfront?" },
        { fromAi: false, text: "Financing. I'd like to visit on Saturday." },
        { fromAi: true, text: "Perfect! I'll pass you to Juliana, who will book the visit." },
      ],
      tags: ["3 bedrooms", "Financing", "Saturday visit"],
      handoff: "Handed to Juliana Martins",
      handoffRole: "Realtor · with the full history",
    },
    vox: {
      name: "VoxIA",
      title: "The AI that",
      titleEm: "makes and takes calls.",
      desc: "Calls new contacts right back, talks by voice and books the visit.",
      status: "On call",
      checks: ["Answers at any hour", "Looking for: 3 bedrooms", "Visit booked: Saturday, 10 am"],
    },
    small: [
      { title: "Custom automations", desc: "Sign-ups, follow-ups and reports that run on their own." },
      { title: "AI consulting", desc: "We show where AI makes a difference before you invest." },
    ],
    also: "We also do:",
    alsoItems: "custom systems · team training · ongoing advisory",
  },
} as const

interface SmallCardArt {
  icon: AnimatedIcon
  src: string
  width: number
  height: number
}

const smallCards: readonly SmallCardArt[] = [
  { icon: WorkflowIcon, src: "/images/ilustracoes/automacoes.png", width: 1200, height: 626 },
  { icon: CompassIcon, src: "/images/ilustracoes/consultoria.png", width: 1200, height: 967 },
]

// Alturas da onda sonora (%), as mesmas do mockup.
const wave = [30, 55, 80, 45, 95, 60, 35, 70, 88, 50, 25, 65, 90, 40, 72, 30, 58, 84, 46, 22]

// Hover discreto: o card sobe 4 px, a borda puxa para o azul e a ilustração se inclina.
const cardClass =
  "group rounded-3xl border border-border bg-card transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-brand-deep/5"
const cardTitleClass = "mt-4 text-[1.625rem] leading-[1.15] tracking-[-0.03em] text-foreground sm:text-[1.75rem]"
const artHoverClass = "transition-[rotate,scale] duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105"

function ProductBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-accent py-1.5 pl-2 pr-3 text-sm font-semibold text-primary">
      <svg aria-hidden viewBox={BRAND_VIEWBOX.symbol} fill="currentColor" className="size-[18px]">
        <path d={SYMBOL_STANDALONE} />
      </svg>
      {children}
    </span>
  )
}

/** Linha do checklist da VoxIA: entra com `reveal` e o ✓ se desenha junto. */
function CheckItem({ delay, children }: { delay: number; children: ReactNode }) {
  const reveal = useReveal()
  const { icon, ...play } = useIconPlay(delay)

  return (
    <motion.li {...reveal(delay)} {...play} className="flex items-center gap-2.5 text-[0.9rem] font-medium text-foreground">
      <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-brand-green text-white [&_svg]:[stroke-width:3.5]">
        <CheckIcon ref={icon} size={12} />
      </span>
      {children}
    </motion.li>
  )
}

/** Card menor (Automações, Consultoria): ícone animado ao lado do título e a ilustração embaixo. */
function SmallCard({ art, title, desc, delay }: { art: SmallCardArt; title: string; desc: string; delay: number }) {
  const reveal = useReveal()
  const { icon, ...play } = useIconPlay(delay)
  const { icon: Icon, ...img } = art

  return (
    <motion.article {...reveal(delay)} {...play} className={cn(cardClass, "flex flex-col p-6 sm:p-7")}>
      <div className="flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-accent text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon ref={icon} size={22} aria-hidden />
        </span>
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.015em] text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-[0.9375rem] text-muted-foreground">{desc}</p>
      <Image
        {...img}
        alt=""
        sizes="(min-width: 1024px) 200px, (min-width: 640px) 40vw, 70vw"
        className={cn("mx-auto mt-auto h-auto w-full max-w-[13rem] pt-5", artHoverClass)}
      />
    </motion.article>
  )
}

type ChatCopy = (typeof copy)[keyof typeof copy]["chat"]

/** Interface da caixa de entrada: a conversa aparece em sequência ao entrar na tela. */
function Inbox({ c }: { c: ChatCopy }) {
  const reveal = useReveal()
  return (
    <div aria-hidden className="mt-6 flex flex-1 flex-col overflow-hidden rounded-[18px] border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5 text-sm font-semibold text-foreground sm:px-5">
        {c.inbox}
        <span className="rounded-full bg-brand-green px-2.5 py-1 text-xs font-bold text-brand-deep">{c.live}</span>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 sm:px-5">
        {c.channels.map((channel, i) => (
          <span
            key={channel}
            className={cn(
              "rounded-full px-2.5 py-1 text-[0.8125rem] font-medium",
              i === 0 ? "bg-accent text-primary" : "bg-surface text-muted-foreground",
            )}
          >
            {channel}
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-end px-4 pb-5 pt-2 sm:px-5">
        <p className="mt-3 text-xs font-medium text-muted-foreground">{c.who}</p>
        {c.messages.map((m, i) => (
          <motion.p
            key={m.text}
            {...reveal(0.2 + i * 0.3)}
            className={cn(
              "mt-2.5 max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-snug sm:max-w-[78%]",
              m.fromAi
                ? "self-end rounded-br-md bg-primary text-primary-foreground"
                : "self-start rounded-bl-md bg-surface text-foreground",
            )}
          >
            {m.text}
          </motion.p>
        ))}
        <motion.div {...reveal(1.4)} className="mt-4 flex flex-wrap gap-2">
          {c.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-[0.8125rem] font-semibold text-foreground">
              {tag}
            </span>
          ))}
        </motion.div>
        <motion.div {...reveal(1.7)} className="mt-5 flex items-center gap-3 rounded-[14px] bg-surface px-4 py-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-deep text-[0.8125rem] font-semibold text-primary-foreground">
            JM
          </span>
          <span className="min-w-0">
            <b className="block text-sm font-semibold text-foreground">{c.handoff}</b>
            <span className="text-[0.8125rem] text-muted-foreground">{c.handoffRole}</span>
          </span>
        </motion.div>
      </div>
    </div>
  )
}

type VoxCopy = (typeof copy)[keyof typeof copy]["vox"]

/** Interface da ligação: contato, onda sonora e o que a VoxIA já resolveu. */
function Call({ c }: { c: VoxCopy }) {
  return (
    <div aria-hidden className="mt-6 rounded-[18px] border border-border px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-[0.8125rem] font-semibold text-primary-foreground">
          CO
        </span>
        <span>
          <b className="block text-[0.9375rem] font-semibold text-foreground">Carla Oliveira</b>
          <span className="text-[0.8125rem] text-muted-foreground">{c.status}</span>
        </span>
        <span className="ml-auto text-sm font-semibold tabular-nums text-foreground">00:06</span>
      </div>
      <div className="mt-3.5 flex h-11 items-center justify-between">
        {wave.map((h, i) => (
          <i
            key={i}
            style={{ height: `${h}%` }}
            className={cn("w-1.5 rounded-full sm:w-[7px]", i % 3 === 2 ? "bg-brand-green" : "bg-primary")}
          />
        ))}
      </div>
      <ul className="mt-3.5 grid gap-2">
        {c.checks.map((check, i) => (
          <CheckItem key={check} delay={0.3 + i * 0.25}>
            {check}
          </CheckItem>
        ))}
      </ul>
    </div>
  )
}

export function Servicos() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reveal = useReveal()

  return (
    <section id="servicos" className="scroll-mt-24 bg-surface py-20 lg:py-30">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-5 lg:mb-13 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <motion.h2
            {...reveal()}
            className="text-balance text-[2.125rem] leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.875rem]"
          >
            {t.title} <strong className="block font-bold">{t.titleEm}</strong>
          </motion.h2>
          <motion.p {...reveal(0.08)} className="max-w-[26rem] text-lg text-muted-foreground">
            {t.desc}
          </motion.p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <motion.article {...reveal(0.1)} className={cn(cardClass, "flex flex-col p-6 sm:p-8 lg:row-span-2")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <ProductBadge>{t.chat.name}</ProductBadge>
                <h3 className={cardTitleClass}>
                  {t.chat.title} <strong className="font-bold">{t.chat.titleEm}</strong>
                </h3>
              </div>
              <Image
                src="/images/ilustracoes/chat-spx.png"
                alt=""
                width={1200}
                height={1086}
                sizes="(min-width: 640px) 160px, 96px"
                className={cn("-mr-2 -mt-2 h-auto w-24 shrink-0 sm:w-40", artHoverClass)}
              />
            </div>
            <p className="mt-2.5 text-muted-foreground">{t.chat.desc}</p>
            <Inbox c={t.chat} />
          </motion.article>

          <motion.article {...reveal(0.18)} className={cn(cardClass, "p-6 sm:p-8")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <ProductBadge>{t.vox.name}</ProductBadge>
                <h3 className={cardTitleClass}>
                  {t.vox.title} <strong className="font-bold">{t.vox.titleEm}</strong>
                </h3>
              </div>
              <Image
                src="/images/ilustracoes/voxia.png"
                alt=""
                width={948}
                height={1200}
                sizes="(min-width: 640px) 104px, 76px"
                className={cn("-mt-2 h-auto w-[4.75rem] shrink-0 sm:w-26", artHoverClass)}
              />
            </div>
            <p className="mt-2.5 text-muted-foreground">{t.vox.desc}</p>
            <Call c={t.vox} />
          </motion.article>

          <div className="grid gap-5 sm:grid-cols-2">
            {t.small.map((card, i) => (
              <SmallCard key={card.title} art={smallCards[i]} title={card.title} desc={card.desc} delay={0.26 + i * 0.08} />
            ))}
          </div>
        </div>

        <motion.p {...reveal(0.1)} className="mt-7 text-[0.9375rem] text-muted-foreground">
          <b className="font-semibold text-foreground">{t.also}</b> {t.alsoItems}
        </motion.p>
      </div>
    </section>
  )
}
