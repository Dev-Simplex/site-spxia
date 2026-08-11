"use client"

import dynamic from "next/dynamic"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { NumberTicker } from "@/components/ui/number-ticker"
import { useAnimationScope } from "@/hooks/use-animation-scope"
import { useI18n } from "@/lib/i18n/context"

// Grade de canvas puramente decorativa (aria-hidden): fora do bundle inicial.
const FlickeringGrid = dynamic(
  () => import("@/components/ui/flickering-grid").then((m) => m.FlickeringGrid),
  { ssr: false },
)

const copy = {
  pt: {
    number: "05",
    label: "RESULTADOS",
    title: "Números que",
    titleEm: "importam.",
    desc: "Métricas reais de projetos entregues para nossos clientes.",
    items: [
      {
        value: 50,
        suffix: "+",
        label: "PROJETOS ENTREGUES",
        desc: "Sistemas, automações e integrações em produção",
      },
      {
        value: 40,
        suffix: "+",
        label: "AUTOMAÇÕES ATIVAS",
        desc: "Workflows rodando 24/7 com monitoramento",
      },
      {
        value: 3,
        suffix: "x",
        label: "ROI MÉDIO",
        desc: "Retorno sobre investimento nos primeiros 6 meses",
      },
      {
        value: 80,
        suffix: "%",
        label: "REDUÇÃO DE TEMPO",
        desc: "Em processos manuais substituídos por automação",
      },
    ],
  },
  en: {
    number: "05",
    label: "RESULTS",
    title: "Numbers that",
    titleEm: "matter.",
    desc: "Real metrics from projects delivered to our clients.",
    items: [
      {
        value: 50,
        suffix: "+",
        label: "PROJECTS DELIVERED",
        desc: "Systems, automations and integrations in production",
      },
      {
        value: 40,
        suffix: "+",
        label: "ACTIVE AUTOMATIONS",
        desc: "Workflows running 24/7 with monitoring",
      },
      {
        value: 3,
        suffix: "x",
        label: "AVERAGE ROI",
        desc: "Return on investment in the first 6 months",
      },
      {
        value: 80,
        suffix: "%",
        label: "TIME REDUCTION",
        desc: "In manual processes replaced by automation",
      },
    ],
  },
} as const

export function Resultados() {
  const { locale } = useI18n()
  const t = copy[locale]
  const reduceMotion = useReducedMotion()
  const scope = useAnimationScope<HTMLElement>()

  const metricVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
      filter: reduceMotion ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
      // Sem isso o filter fica preso em blur(0px) e rasteriza o número gigante.
      transitionEnd: { filter: "none" },
    },
  }

  return (
    <section
      {...scope}
      id="resultados"
      className="relative isolate overflow-hidden bg-card py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-primary-text">
            <span>{t.number}</span>
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            <span>{t.label}</span>
          </div>

          <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            {t.title}{" "}
            <em className="italic text-primary">{t.titleEm}</em>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.desc}
          </p>
        </header>

        <div className="relative mt-14">
          {/* Grade cintilante atrás dos números — única camada de fundo forte da seção. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 mask-[radial-gradient(ellipse_70%_60%_at_center,black,transparent)]"
          >
            <FlickeringGrid
              squareSize={3}
              gridGap={7}
              flickerChance={0.22}
              color="#f90108"
              maxOpacity={0.2}
            />
          </div>

          <motion.div
            className="grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {t.items.map((metric, index) => {
              const dividerClasses = [
                index > 0 ? "border-t border-border" : "",
                index === 1 ? "sm:border-l sm:border-t-0" : "",
                index === 2 ? "lg:border-l lg:border-t-0" : "",
                index === 3 ? "sm:border-l lg:border-t-0" : "",
              ]
                .filter(Boolean)
                .join(" ")

              return (
                <motion.article
                  key={metric.label}
                  variants={metricVariants}
                  className={`group relative flex min-h-72 flex-col justify-center py-8 sm:min-h-80 sm:px-8 lg:px-9 ${dividerClasses}`}
                >
                  {/* Halo que acende sob o número no hover. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                  />

                  <div
                    className="font-serif text-7xl leading-none tracking-tight text-primary transition-[filter] duration-500 group-hover:[filter:drop-shadow(0_0_28px_rgba(249,1,8,0.45))] motion-reduce:transition-none sm:text-8xl lg:text-[6.5rem] xl:text-[7.5rem]"
                    aria-label={`${metric.value}${metric.suffix}`}
                  >
                    <NumberTicker
                      aria-hidden="true"
                      value={metric.value}
                      className="tracking-normal text-primary"
                    />
                    <span aria-hidden="true">{metric.suffix}</span>
                  </div>

                  <h3 className="mt-7 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                    {metric.label}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                    {metric.desc}
                  </p>

                  {/* Régua vermelha que cresce no hover, ancorando o bloco. */}
                  <span
                    aria-hidden
                    className="mt-6 h-px w-0 bg-primary/70 transition-all duration-500 ease-out group-hover:w-16 motion-reduce:transition-none"
                  />
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
