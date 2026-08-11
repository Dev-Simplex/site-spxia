"use client"

import dynamic from "next/dynamic"

import { TextReveal } from "@/components/ui/text-reveal"
import { useI18n } from "@/lib/i18n/context"

// Dois canvas decorativos (aria-hidden) numa seção no fim da página: ficam
// fora do bundle inicial e do HTML do servidor.
const ShootingStars = dynamic(
  () => import("@/components/ui/shooting-stars").then((m) => m.ShootingStars),
  { ssr: false },
)
const StarsBackground = dynamic(
  () => import("@/components/ui/stars-background").then((m) => m.StarsBackground),
  { ssr: false },
)

// Textos copiados de legacy/src/i18n/{pt,en}.js (seção quote).
const copy = {
  pt: {
    text: "IA não é sobre tecnologia. É sobre",
    textEm: "resultado de negócio.",
    text2: "Se não gera receita, reduz custo ou libera tempo, não vale o investimento.",
    author: "Paulo Seze, SPXIA",
  },
  en: {
    text: "AI isn't about technology. It's about",
    textEm: "business results.",
    text2: "If it doesn't generate revenue, reduce cost or free up time, it's not worth the investment.",
    author: "Paulo Seze, SPXIA",
  },
} as const

export function Quote() {
  const { locale } = useI18n()
  const t = copy[locale]

  return (
    // Sem overflow-hidden aqui: o TextReveal depende de position:sticky e um
    // ancestral com overflow recortado quebraria o efeito.
    <section className="relative isolate bg-card">
      {/* Céu da seção: o container acompanha os 200vh do TextReveal, mas o canvas
          fica preso ao viewport (sticky) e a máscara abre um vazio no centro para
          o texto não competir com as estrelas. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="sticky top-0 h-screen w-full mask-[radial-gradient(ellipse_58%_46%_at_center,transparent_25%,black_78%)]">
          <StarsBackground starDensity={0.00011} />
          <ShootingStars starColor="#f90108" trailRgb="254, 254, 254" />
        </div>
      </div>

      <TextReveal
        className="z-10"
        textClassName="font-serif"
        footer={
          <p className="mt-6 pl-5 font-mono text-sm text-muted-foreground md:pl-8 lg:pl-10">
            {t.author}
          </p>
        }
      >
        {[
          { text: t.text },
          { text: t.textEm, className: "text-primary" },
          { text: t.text2 },
        ]}
      </TextReveal>
    </section>
  )
}
