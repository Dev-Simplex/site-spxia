"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { motion, useReducedMotion, useInView } from "motion/react"

import { cn } from "@/lib/utils"

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

interface Square {
  id: number
  pos: [number, number]
  iteration: number
}

/**
 * MagicUI — animated-grid-pattern (https://magicui.design/r/animated-grid-pattern.json).
 * Ajustes locais: cor herdada do tema via fill/stroke utilitários no consumidor
 * e bypass total da animação em prefers-reduced-motion (só a malha estática fica).
 *
 * Performance: cada quadrado dispara `onAnimationComplete` → `setSquares`, ou
 * seja um re-render do componente inteiro por quadrado que termina o ciclo.
 * Fora da viewport esse loop é interrompido; ao voltar, os quadrados são
 * reposicionados de uma vez e reentram em cascata — a mesma cascata que o
 * efeito já faz na primeira aparição da seção.
 */
export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 40,
  className,
  maxOpacity = 0.4,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(containerRef, { margin: "200px" })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState<Square[]>([])

  const getPos = useCallback((): [number, number] => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ]
  }, [dimensions.height, dimensions.width, height, width])

  const generateSquares = useCallback(
    (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
        iteration: 0,
      })),
    [getPos],
  )

  const updateSquarePosition = useCallback(
    (squareId: number) => {
      setSquares((currentSquares) => {
        const current = currentSquares[squareId]
        if (!current || current.id !== squareId) return currentSquares

        const nextSquares = currentSquares.slice()
        nextSquares[squareId] = {
          ...current,
          pos: getPos(),
          iteration: current.iteration + 1,
        }
        return nextSquares
      })
    },
    [getPos],
  )

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      if (shouldReduceMotion) setSquares([])
      return
    }
    if (dimensions.width && dimensions.height) {
      // Regenera ao (re)entrar na viewport: os quadrados que pararam no fim do
      // ciclo voltam a acender em cascata.
      setSquares(generateSquares(numSquares))
    }
  }, [
    dimensions.width,
    dimensions.height,
    generateSquares,
    numSquares,
    shouldReduceMotion,
    isInView,
  ])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions((current) => {
          const nextWidth = entry.contentRect.width
          const nextHeight = entry.contentRect.height
          if (current.width === nextWidth && current.height === nextHeight) {
            return current
          }
          return { width: nextWidth, height: nextHeight }
        })
      }
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-white/[0.03] stroke-white/[0.06]",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id: squareId, iteration }, index) => (
          <motion.rect
            key={`${squareId}-${iteration}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay,
            }}
            onAnimationComplete={() => {
              if (isInView) updateSquarePosition(squareId)
            }}
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1}
            y={squareY * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  )
}
