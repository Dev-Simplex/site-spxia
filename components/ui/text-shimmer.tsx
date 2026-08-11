"use client"

// motion-primitives — text-shimmer (https://motion-primitives.com).
// As variantes `dark:` do original foram removidas: o projeto tem tema único dark,
// então as cores base já vêm do tema da marca (#888888 → #FEFEFE).
//
// Performance: o original animava `backgroundPosition` pelo motion — um valor
// escrito em JS por frame, em `repeat: Infinity`, para um texto que fica no
// hero e nunca para. Virou keyframe CSS: mesmo gradiente, mesma duração, mesmo
// easing linear, e agora congela junto com o resto da seção fora da viewport
// (ver hooks/use-animation-scope) e some em prefers-reduced-motion.
import React, { useMemo, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

import "./animation-pause.css"

const SHIMMER_CSS = `
@keyframes spx-text-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
[data-spx-text-shimmer] {
  animation-name: spx-text-shimmer;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-spx-text-shimmer] {
    animation: none;
    background-image: none;
    -webkit-background-clip: border-box;
    background-clip: border-box;
    color: var(--base-color);
  }
}
`

export type TextShimmerProps = {
  children: string
  as?: React.ElementType
  className?: string
  duration?: number
  spread?: number
}

function TextShimmerComponent({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => children.length * spread, [children, spread])

  return (
    <>
      {/* href + precedence: o React 19 iça e deduplica o bloco no <head>. */}
      <style href="spx-text-shimmer" precedence="default">
        {SHIMMER_CSS}
      </style>
      <Component
        data-spx-text-shimmer
        className={cn(
          "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
          "[--base-color:#888888] [--base-gradient-color:#fefefe]",
          "[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
          className,
        )}
        style={
          {
            "--spread": `${dynamicSpread}px`,
            backgroundImage: "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
            backgroundPosition: "100% center",
            animationDuration: `${duration}s`,
          } as CSSProperties
        }
      >
        {children}
      </Component>
    </>
  )
}

export const TextShimmer = React.memo(TextShimmerComponent)
