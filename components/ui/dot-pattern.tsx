"use client"

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type SVGProps,
} from "react"
import { motion } from "motion/react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  glow?: boolean
}

/**
 * MagicUI — dot-pattern.
 *
 * Ajuste de performance: o original monta um `<motion.circle>` por ponto
 * sempre — num rodapé de tela cheia com grade de 24px isso passa de 2.000
 * nós React/SVG só para desenhar uma textura estática. Sem `glow` a malha
 * agora sai de um `<pattern>` nativo (2 nós, pintura pelo próprio SVG) com
 * o mesmo resultado visual. Com `glow`, os círculos animados voltam — mas
 * pausados fora da viewport.
 */
export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()
  const staticRef = useRef<SVGSVGElement>(null)
  const [glowRef, inView] = useInViewport<SVGSVGElement>({ rootMargin: "120px" })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const containerRef = glow ? glowRef : staticRef

  useEffect(() => {
    // Sem glow a malha é um pattern: não precisa medir o container.
    if (!glow) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect()
      setDimensions({ width: containerWidth, height: containerHeight })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [glow, containerRef])

  const dots = useMemo(() => {
    if (!glow) return []
    const columns = Math.ceil(dimensions.width / width)
    const rows = Math.ceil(dimensions.height / height)
    return Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)

      return {
        x: column * width + cx + x,
        y: row * height + cy + y,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }
    })
  }, [glow, dimensions.width, dimensions.height, width, height, cx, cy, x, y])

  const className_ = cn(
    "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
    className,
  )

  if (!glow) {
    return (
      <svg ref={staticRef} aria-hidden="true" className={className_} {...props}>
        <defs>
          <pattern
            id={`${id}-dots`}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
      </svg>
    )
  }

  return (
    <svg ref={glowRef} aria-hidden="true" className={className_} {...props}>
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={`url(#${id}-gradient)`}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={inView ? { opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] } : { opacity: 0.4, scale: 1 }}
          transition={
            inView
              ? {
                  duration: dot.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: dot.delay,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  )
}
