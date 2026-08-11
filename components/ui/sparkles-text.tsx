"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

// SparklesText (MagicUI) adaptado ao SPX: renderiza inline (o original força <div> +
// <strong>, o que quebraria o <em> serif dos títulos), usa as cores da marca e
// não gera partícula alguma quando prefers-reduced-motion está ativo.
// O ciclo de reciclagem (setInterval + re-render) e as animações infinitas só
// rodam com o título na tela.
interface Sparkle {
  id: string
  x: string
  y: string
  color: string
  delay: number
  scale: number
}

interface SparklesTextProps {
  children: React.ReactNode
  className?: string
  sparklesCount?: number
  colors?: { first: string; second: string }
}

export function SparklesText({
  children,
  className,
  sparklesCount = 8,
  colors = { first: "#f90108", second: "#fefefe" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [ref, inView] = useInViewport<HTMLSpanElement>({
    rootMargin: "120px",
    // As partículas são geradas no cliente de qualquer forma: não vale montar
    // um ciclo inteiro para logo em seguida descobrir que a seção está fora.
    initialInView: false,
  })

  useEffect(() => {
    // Fora da tela nenhuma partícula fica montada: as animações do motion são
    // `repeat: Infinity` e continuariam custando frames invisíveis.
    if (!inView) {
      setSparkles([])
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let counter = 0
    const generate = (): Sparkle => {
      counter += 1
      return {
        id: `sparkle-${counter}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.55 ? colors.first : colors.second,
        delay: Math.random() * 1.4,
        scale: Math.random() * 0.7 + 0.35,
      }
    }

    setSparkles(Array.from({ length: sparklesCount }, generate))

    // Recicla uma partícula por vez: mantém o brilho vivo sem repintar o bloco todo.
    const interval = setInterval(() => {
      setSparkles((current) => {
        if (current.length === 0) return current
        const index = Math.floor(Math.random() * current.length)
        return current.map((sparkle, i) => (i === index ? generate() : sparkle))
      })
    }, 900)

    return () => clearInterval(interval)
  }, [colors.first, colors.second, sparklesCount, inView])

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="absolute"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, sparkle.scale, 0], rotate: [75, 150] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: sparkle.delay, ease: "easeInOut" }}
            width="16"
            height="16"
            viewBox="0 0 21 21"
          >
            <path
              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </span>
      <span className="relative">{children}</span>
    </span>
  )
}
