"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

// Tons de preto da marca SPX — o fundo transita entre eles a cada etapa
const BACKGROUND_COLORS = ["#1a1a1a", "#212121", "#2d2d2d"]

export interface StickyScrollItem {
  title: string
  description: React.ReactNode
  content?: React.ReactNode
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  })
  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint)
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index
        }
        return acc
      },
      0,
    )
    setActiveCard(closestBreakpointIndex)
  })

  return (
    <motion.div
      animate={{
        backgroundColor: BACKGROUND_COLORS[activeCard % BACKGROUND_COLORS.length],
      }}
      transition={{ duration: 0.4 }}
      ref={ref}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-xl border border-border p-6 md:p-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative flex items-start px-2 md:px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-16 md:my-20">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="flex items-center gap-3 text-xl font-bold text-foreground md:text-2xl"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-6 w-1 shrink-0 rounded-full transition-colors duration-300",
                    activeCard === index ? "bg-primary" : "bg-border",
                  )}
                />
                {item.title}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-8 max-w-sm text-muted-foreground"
              >
                {item.description}
              </motion.div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-xl border border-border bg-card lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  )
}
