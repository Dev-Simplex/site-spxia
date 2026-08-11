"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// StarsBackground (Aceternity) adaptado ao SPX: canvas com DPR limitado, pausa fora
// da viewport, cor configurável e frame único quando prefers-reduced-motion.
interface StarsBackgroundProps {
  /** Estrelas por pixel de área. */
  starDensity?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
  /** Cor das estrelas em "r, g, b". */
  rgb?: string
  className?: string
}

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number
  phase: number
}

export function StarsBackground({
  starDensity = 0.00012,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  rgb = "254, 254, 254",
  className,
}: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let stars: Star[] = []
    let dpr = 1
    let frame: number | null = null
    let visible = false
    let elapsed = 0
    let last = 0

    const build = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (width === 0 || height === 0) return

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)

      const count = Math.floor(width * height * starDensity)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width * dpr,
        y: Math.random() * height * dpr,
        radius: (Math.random() * 0.6 + 0.4) * dpr,
        opacity: Math.random() * 0.5 + 0.4,
        twinkleSpeed: minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed),
        phase: Math.random() * Math.PI * 2,
      }))
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const star of stars) {
        const twinkle = reduceMotion
          ? star.opacity
          : 0.45 + Math.abs(Math.sin(elapsed / star.twinkleSpeed + star.phase)) * 0.5
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${twinkle * star.opacity + 0.15})`
        ctx.fill()
      }
    }

    const animate = (time: number) => {
      if (!visible) {
        frame = null
        return
      }
      elapsed += last === 0 ? 0 : (time - last) / 1000
      last = time
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

    build()

    const resizeObserver = new ResizeObserver(() => {
      stop()
      build()
      if (visible) start()
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(canvas)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [starDensity, minTwinkleSpeed, maxTwinkleSpeed, rgb])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  )
}
