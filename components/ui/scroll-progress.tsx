"use client"

import type * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Barra fina de progresso de leitura fixa no topo da página.
 * Base: MagicUI `scroll-progress`, com a paleta SPXIA (#F90108) e
 * suavização por spring — desativada em `prefers-reduced-motion`.
 */
export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left",
        "bg-gradient-to-r from-[#7A1B1E] via-[#F90108] to-[#FF7377]",
        "shadow-[0_0_12px_rgba(249,1,8,0.55)]",
        className,
      )}
      style={{ scaleX: shouldReduceMotion ? scrollYProgress : smoothProgress }}
      {...props}
    />
  )
}
