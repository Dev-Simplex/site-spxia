"use client"

import { useMemo, type CSSProperties } from "react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

import "./animation-pause.css"

// Meteors (Aceternity) adaptado ao SPX:
// - posição/delay/duração determinísticos (o original usa Math.random() no render e
//   quebra a hidratação no App Router);
// - keyframes locais (o projeto não usa tailwind.config, então nada de `animate-meteor-effect`);
// - cor da marca e respeito a prefers-reduced-motion;
// - a seção tem uma instância por card: fora da viewport todos os rastros são
//   congelados em vez de seguirem animando transform/opacity no compositor.
const METEOR_CSS = `
@keyframes spx-meteor {
  0% { transform: rotate(215deg) translateX(0); opacity: 0; }
  8% { opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-520px); opacity: 0; }
}
[data-spx-meteor] {
  animation-name: spx-meteor;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-spx-meteor] { animation: none; opacity: 0; }
}
`

interface MeteorsProps {
  /** Quantidade de meteoros. */
  number?: number
  /** Cor do rastro — aceita qualquer notação CSS. */
  color?: string
  className?: string
}

// Ruído estável por índice: mesmo resultado no servidor e no cliente.
const noise = (i: number, seed: number) => {
  const value = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return value - Math.floor(value)
}

export function Meteors({ number = 10, color = "#f90108", className }: MeteorsProps) {
  const [ref, inView] = useInViewport<HTMLDivElement>({ rootMargin: "150px" })

  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        left: `${(i / number) * 140 - 20}%`,
        delay: `${(noise(i, 1) * 6).toFixed(2)}s`,
        duration: `${(5 + noise(i, 2) * 5).toFixed(2)}s`,
      })),
    [number],
  )

  return (
    <div
      ref={ref}
      aria-hidden
      data-spx-paused={inView ? undefined : "true"}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [contain:layout_paint_style]",
        className,
      )}
      style={{ "--meteor-color": color } as CSSProperties}
    >
      {/* href + precedence: o React 19 iça e deduplica o bloco no <head>. */}
      <style href="spx-meteors" precedence="default">
        {METEOR_CSS}
      </style>
      {meteors.map((meteor, i) => (
        <span
          key={i}
          data-spx-meteor
          className="absolute size-0.5 rounded-full bg-[var(--meteor-color)] shadow-[0_0_6px_0_var(--meteor-color)] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-[linear-gradient(to_right,var(--meteor-color),transparent)] before:content-['']"
          style={{
            top: "-10%",
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  )
}
