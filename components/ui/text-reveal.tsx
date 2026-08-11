"use client"

import {
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

// TextReveal (MagicUI) adaptado ao tema SPX: cores via tokens (o original usava
// text-black/dark:text-white e o site é dark-only), children aceita segmentos
// com className próprio (para destacar trechos, ex. text-primary) e `footer`
// renderiza conteúdo fixo abaixo do texto dentro do container sticky.
export interface TextRevealSegment {
  text: string
  className?: string
}

export interface TextRevealProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: string | TextRevealSegment[]
  textClassName?: string
  footer?: ReactNode
}

export const TextReveal: FC<TextRevealProps> = ({
  children,
  className,
  textClassName,
  footer,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
  })

  const segments: TextRevealSegment[] =
    typeof children === "string" ? [{ text: children }] : children

  const words = segments.flatMap((segment) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, className: segment.className }))
  )

  return (
    // No mobile a seção encolhe para 140vh: com 200vh o usuário atravessava
    // ~2 telas quase vazias antes de o texto revelar (1334px medidos @375).
    // O bloco sticky ocupa 1 viewport (h-svh); em md, h-[50%] de 200vh equivale
    // ao mesmo viewport e mantém o ritmo original do reveal.
    <div ref={sectionRef} className={cn("relative z-0 h-[140vh] md:h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-svh md:h-[50%] max-w-4xl flex-col items-start justify-center bg-transparent px-4 py-20">
        <span
          className={cn(
            "flex flex-wrap p-5 text-2xl text-foreground md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl",
            textClassName
          )}
        >
          {words.map(({ word, className: wordClassName }, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                className={wordClassName}
              >
                {word}
              </Word>
            )
          })}
        </span>
        {footer}
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  className?: string
}

const Word: FC<WordProps> = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className={cn("relative mx-1 lg:mx-1.5", className)}>
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity: opacity }}>{children}</motion.span>
    </span>
  )
}
