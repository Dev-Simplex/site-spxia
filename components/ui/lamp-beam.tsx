"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface LampBeamProps {
  className?: string
  /** Cor da luz. */
  color?: string
  /**
   * Cor sólida do fundo da seção — as máscaras do efeito precisam pintar por
   * cima dos cones para recortá-los, então tem que bater com o `bg-*` do pai.
   */
  backgroundColor?: string
}

/**
 * Aceternity UI — lamp (https://ui.aceternity.com/registry/lamp.json), adaptado.
 *
 * O original é um container de tela cheia que centraliza o próprio conteúdo.
 * Aqui virou uma camada puramente decorativa, absoluta no topo da seção, com
 * altura fixa — o header da seção fica por cima, dentro do cone de luz.
 * Também troca `bg-gradient-conic` (plugin do Tailwind v3) por conic-gradient
 * inline, já que o projeto está em Tailwind v4.
 */
export function LampBeam({
  className,
  color = "#f90108",
  backgroundColor = "var(--card)",
}: LampBeamProps) {
  const shouldReduceMotion = useReducedMotion()

  const grow = (from: string, to: string) =>
    shouldReduceMotion
      ? { initial: { width: to, opacity: 1 }, whileInView: undefined }
      : {
          initial: { width: from, opacity: 0.5 },
          whileInView: { width: to, opacity: 1 },
        }

  const cone = grow("15rem", "30rem")
  const core = grow("8rem", "16rem")
  const bar = grow("15rem", "30rem")

  const transition = { delay: 0.2, duration: 0.8, ease: "easeInOut" as const }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-[22rem] overflow-hidden",
        className,
      )}
    >
      <div className="relative isolate flex h-full w-full scale-y-125 items-center justify-center">
        {/* Cone esquerdo */}
        <motion.div
          initial={cone.initial}
          whileInView={cone.whileInView}
          viewport={{ once: true }}
          transition={transition}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, ${color}, transparent, transparent)`,
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible opacity-60"
        >
          <div
            className="absolute bottom-0 left-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ backgroundColor }}
          />
          <div
            className="absolute bottom-0 left-0 z-20 h-full w-40 [mask-image:linear-gradient(to_right,white,transparent)]"
            style={{ backgroundColor }}
          />
        </motion.div>

        {/* Cone direito */}
        <motion.div
          initial={cone.initial}
          whileInView={cone.whileInView}
          viewport={{ once: true }}
          transition={transition}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${color})`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] opacity-60"
        >
          <div
            className="absolute bottom-0 right-0 z-20 h-full w-40 [mask-image:linear-gradient(to_left,white,transparent)]"
            style={{ backgroundColor }}
          />
          <div
            className="absolute bottom-0 right-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ backgroundColor }}
          />
        </motion.div>

        {/* Difusor: apaga a metade de baixo dos cones */}
        <div
          className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl"
          style={{ backgroundColor }}
        />

        {/* Halo largo */}
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: color }}
        />

        {/* Núcleo quente */}
        <motion.div
          initial={core.initial}
          whileInView={core.whileInView}
          viewport={{ once: true }}
          transition={transition}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-24 rounded-full opacity-50 blur-2xl"
          style={{ backgroundColor: color }}
        />

        {/* Filamento */}
        <motion.div
          initial={bar.initial}
          whileInView={bar.whileInView}
          viewport={{ once: true }}
          transition={transition}
          className="absolute inset-auto z-50 h-px w-[30rem] -translate-y-28"
          style={{ backgroundColor: color }}
        />

        {/* Tampa: tudo acima do filamento volta a ser fundo sólido */}
        <div
          className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  )
}
