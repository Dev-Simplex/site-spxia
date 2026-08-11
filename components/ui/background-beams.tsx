"use client"

import { memo, useId } from "react"
import { motion, useReducedMotion } from "motion/react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

/**
 * Aceternity UI — background-beams (https://ui.aceternity.com/registry/background-beams.json).
 *
 * Ajustes locais:
 * - Paths gerados por fórmula (o original traz os 50 `d` literais) para poder
 *   controlar densidade sem inflar o bundle.
 * - Paleta trocada para o vermelho da marca (#F90108).
 * - Duração/atraso derivados do índice, não de Math.random(), para não gerar
 *   divergência de hidratação entre servidor e cliente.
 * - prefers-reduced-motion mantém só a malha estática, sem feixes correndo.
 * - Cada feixe é um `motion.linearGradient` animando quatro atributos SVG por
 *   frame — trabalho de main thread que o navegador não consegue acelerar.
 *   Fora da viewport os feixes são desmontados (o trilho estático permanece,
 *   então a malha nunca pisca) e a densidade padrão caiu de 24 para 14: os
 *   feixes se sobrepõem sob máscara, e a diferença não é perceptível.
 */

const BASE_X = -380
const BASE_Y = -189
const STEP_X = 7
const STEP_Y = -8
const TOTAL = 50

function beamPath(i: number) {
  const dx = i * STEP_X
  const dy = i * STEP_Y
  const x = (n: number) => n + dx
  const y = (n: number) => n + dy
  return (
    `M${x(BASE_X)} ${y(BASE_Y)}C${x(BASE_X)} ${y(BASE_Y)} ${x(-312)} ${y(216)} ${x(152)} ${y(343)}` +
    `C${x(616)} ${y(470)} ${x(684)} ${y(875)} ${x(684)} ${y(875)}`
  )
}

/** Malha completa em um único path — serve de "trilho" de baixo contraste. */
const RAIL_PATH = Array.from({ length: TOTAL }, (_, i) => beamPath(i)).join("")

/** Ruído determinístico em [0,1) a partir do índice. */
function seeded(i: number, salt: number) {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return v - Math.floor(v)
}

interface BackgroundBeamsProps {
  className?: string
  /** Quantos feixes animados renderizar (de 50 possíveis). */
  count?: number
  color?: string
  highlight?: string
}

export const BackgroundBeams = memo(function BackgroundBeams({
  className,
  count = 14,
  color = "#f90108",
  highlight = "#ff8a8d",
}: BackgroundBeamsProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const shouldReduceMotion = useReducedMotion()
  const [containerRef, inView] = useInViewport<HTMLDivElement>({ rootMargin: "200px" })

  const animated = inView && !shouldReduceMotion
  const stride = Math.max(1, Math.floor(TOTAL / count))
  const beams = Array.from({ length: count }, (_, n) => n * stride).filter((i) => i < TOTAL)

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center [contain:layout_paint_style]",
        className,
      )}
    >
      <svg
        className="pointer-events-none absolute h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d={RAIL_PATH}
          stroke={`url(#${uid}-rail)`}
          strokeOpacity="0.16"
          strokeWidth="0.5"
        />

        {animated &&
          beams.map((i) => (
            <path
              key={`beam-${i}`}
              d={beamPath(i)}
              stroke={`url(#${uid}-beam-${i})`}
              strokeOpacity="0.55"
              strokeWidth="0.6"
            />
          ))}

        <defs>
          {animated &&
            beams.map((i) => (
              <motion.linearGradient
                key={`grad-${i}`}
                id={`${uid}-beam-${i}`}
                initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + seeded(i, 1) * 8}%`],
                }}
                transition={{
                  duration: 11 + seeded(i, 2) * 9,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: seeded(i, 3) * 10,
                }}
              >
                <stop stopColor={color} stopOpacity="0" />
                <stop stopColor={color} />
                <stop offset="32.5%" stopColor={highlight} />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </motion.linearGradient>
            ))}

          <radialGradient
            id={`${uid}-rail`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
          >
            <stop offset="0.0666667" stopColor="#888888" />
            <stop offset="0.243243" stopColor="#888888" />
            <stop offset="0.43594" stopColor="#fefefe" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
})
