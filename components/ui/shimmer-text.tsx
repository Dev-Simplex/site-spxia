import type { CSSProperties, ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

import "./section-effects.css"

interface ShimmerTextProps {
  children: ReactNode
  className?: string
  /** Cor de repouso do texto. Default: muted-foreground da marca. */
  baseColor?: string
  /** Cor do pico da varredura. */
  highlightColor?: string
  /** Duração do ciclo (CSS time). */
  duration?: string
  as?: ElementType
}

/**
 * Varredura de brilho sobre texto — usada nos kickers das seções.
 * CSS puro (background-clip: text), sem JS nem dependência nova; a animação
 * é desligada em prefers-reduced-motion (ver section-effects.css).
 */
export function ShimmerText({
  children,
  className,
  baseColor = "#888888",
  highlightColor = "#fefefe",
  duration = "6s",
  as: Component = "span",
}: ShimmerTextProps) {
  const style = {
    "--spx-shimmer-base": baseColor,
    "--spx-shimmer-highlight": highlightColor,
    "--spx-shimmer-duration": duration,
  } as CSSProperties

  return (
    <Component className={cn("spx-shimmer", className)} style={style}>
      {children}
    </Component>
  )
}
