"use client"

import { useEffect, useRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

// FlickeringGrid (MagicUI) adaptado ao SPX: cor da marca por padrão, DPR limitado a 2,
// pausa via IntersectionObserver e render estático quando prefers-reduced-motion.
interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  maxOpacity?: number
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "#f90108",
  maxOpacity = 0.3,
  className,
  ...props
}: FlickeringGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Resolve qualquer notação de cor (hex, rgb, oklch) para o prefixo "rgba(r, g, b,".
    const resolveColor = () => {
      const probe = document.createElement("canvas")
      probe.width = probe.height = 1
      const probeCtx = probe.getContext("2d")
      if (!probeCtx) return "rgba(249, 1, 8,"
      probeCtx.fillStyle = color
      probeCtx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(probeCtx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }

    const rgba = resolveColor()
    const cell = squareSize + gridGap

    let cols = 0
    let rows = 0
    let dpr = 1
    let squares = new Float32Array(0)
    let frame: number | null = null
    let visible = false
    let last = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `${rgba}${squares[i * rows + j]})`
          ctx.fillRect(i * cell * dpr, j * cell * dpr, squareSize * dpr, squareSize * dpr)
        }
      }
    }

    const setup = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }
      draw()
    }

    const animate = (time: number) => {
      if (!visible) {
        frame = null
        return
      }
      const delta = last === 0 ? 0 : (time - last) / 1000
      last = time
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * delta) {
          squares[i] = Math.random() * maxOpacity
        }
      }
      draw()
      frame = requestAnimationFrame(animate)
    }

    const start = () => {
      if (reduceMotion || frame !== null) return
      last = 0
      frame = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }

    setup()

    const resizeObserver = new ResizeObserver(() => {
      stop()
      setup()
      if (visible) start()
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, color, maxOpacity])

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} aria-hidden {...props}>
      <canvas ref={canvasRef} className="pointer-events-none block" />
    </div>
  )
}
