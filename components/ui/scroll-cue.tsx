"use client"

// Indicador de scroll da base do hero: legenda mono + "mouse" com ponto vermelho descendo.
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollCueProps {
  label?: string
  href?: string
  className?: string
  /** Atraso (s) antes de aparecer — combina com o stagger de entrada do hero. */
  delay?: number
}

export function ScrollCue({ label, href = "#servicos", className, delay = 1.6 }: ScrollCueProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={cn("group flex flex-col items-center gap-2.5", className)}
    >
      {label ? (
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
          {label}
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1 transition-colors duration-200 group-hover:border-[#F90108]/60"
      >
        <motion.span
          className="h-1.5 w-1 rounded-full bg-[#F90108]"
          animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.a>
  )
}
