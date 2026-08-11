"use client"

import type { CSSProperties } from "react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

import "./animation-pause.css"

/*
 * O original animava `offsetDistance` pelo motion: um valor por frame escrito
 * em JS, sem pausa, para cada card em tela. `offset-distance` é animável em
 * CSS, então o percurso vira um keyframe nativo — mais barato e, principalmente,
 * pausável por `animation-play-state` quando o card sai da viewport (retoma no
 * mesmo ponto do trajeto, sem re-play).
 */
const BEAM_CSS = `
@keyframes spx-border-beam {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
[data-spx-border-beam] {
  animation-name: spx-border-beam;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-spx-border-beam] { animation: none; opacity: 0; }
}
`

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * The class name of the border beam.
   */
  className?: string
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number
  /**
   * The border width of the beam.
   */
  borderWidth?: number
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) => {
  const [ref, inView] = useInViewport<HTMLDivElement>({ rootMargin: "120px" })

  // O deslocamento inicial vira delay negativo: o keyframe já começa adiantado
  // na fração equivalente do percurso, como fazia o `initial` do motion.
  const offsetDelay = -((initialOffset / 100) * duration + delay)

  return (
    <div
      ref={ref}
      data-spx-paused={inView ? undefined : "true"}
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as CSSProperties
      }
    >
      {/* href + precedence: o React 19 iça e deduplica o bloco no <head>. */}
      <style href="spx-border-beam" precedence="default">
        {BEAM_CSS}
      </style>
      <div
        data-spx-border-beam
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            animationDuration: `${duration}s`,
            animationDelay: `${offsetDelay}s`,
            animationDirection: reverse ? "reverse" : "normal",
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as CSSProperties
        }
      />
    </div>
  )
}
