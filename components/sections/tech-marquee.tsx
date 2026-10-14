"use client"

import type { ComponentType } from "react"
import { Database, Globe, Instagram, Mail, Phone } from "lucide-react"
import { motion } from "motion/react"

import { WhatsAppIcon } from "@/components/icons/brand"
import { useReveal } from "@/components/ui/motion-kit"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

// Faixa de canais (P5 do COPY): no lugar dos logos de tecnologia, os canais
// onde a SPXia atende. Mesma ordem nos dois idiomas, ícones abaixo.
const copy = {
  pt: {
    label: "Funciona com o que sua empresa já usa",
    channels: ["WhatsApp", "Instagram", "Site", "E-mail", "Seu CRM", "Telefone"],
  },
  en: {
    label: "Works with what your business already uses",
    channels: ["WhatsApp", "Instagram", "Website", "Email", "Your CRM", "Phone"],
  },
} as const

type ChannelIcon = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>

// WhatsApp com o glifo oficial; todos os canais em Azul Pulso.
const channelIcons: readonly { Icon: ChannelIcon; tone: string }[] = [
  { Icon: WhatsAppIcon, tone: "text-primary" },
  { Icon: Instagram, tone: "text-primary" },
  { Icon: Globe, tone: "text-primary" },
  { Icon: Mail, tone: "text-primary" },
  { Icon: Database, tone: "text-primary" },
  { Icon: Phone, tone: "text-primary" },
]

export function TechMarquee() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reveal = useReveal()

  return (
    <div className="border-y border-border bg-surface py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-10">
        <p className="text-[0.9375rem] font-semibold text-foreground">{t.label}</p>
        <motion.ul {...reveal()} className="flex flex-wrap gap-2.5">
          {t.channels.map((channel, i) => {
            const { Icon, tone } = channelIcons[i]
            return (
              <li
                key={channel}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground"
              >
                <Icon aria-hidden className={cn("size-[18px]", tone)} strokeWidth={1.8} />
                {channel}
              </li>
            )
          })}
        </motion.ul>
      </div>
    </div>
  )
}
