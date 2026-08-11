"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// ShootingStars (Aceternity) reescrito em canvas para o SPX: o original re-renderiza
// o React a cada frame, deixa um setTimeout recursivo sem cleanup e usa um id de
// gradiente global. Aqui tudo vive num único rAF, pausado fora da viewport e
// desligado em prefers-reduced-motion.
interface ShootingStarsProps {
  /** Intervalo entre disparos, em ms. */
  minDelay?: number
  maxDelay?: number
  minSpeed?: number
  maxSpeed?: number
  /** Cor da cabeça da estrela. */
  starColor?: string
  /** Cor do rastro em "r, g, b". */
  trailRgb?: string
  trailLength?: number
  className?: string
}

interface Star {
  x: number
  y: number
  angle: number
  speed: number
  distance: number
}

export function ShootingStars({
  minDelay = 1600,
  maxDelay = 4600,
  minSpeed = 8,
  maxSpeed = 20,
  starColor = "#f90108",
  trailRgb = "254, 254, 254",
  trailLength = 120,
  className,
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let width = 0
    let height = 0
    let dpr = 1
    let stars: Star[] = []
    let frame: number | null = null
    let visible = false
    let nextSpawn = 0
    let elapsed = 0
    let last = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      // Entra sempre pelo topo ou pela lateral, cruzando a tela na diagonal.
      const fromTop = Math.random() > 0.4
      const angle = fromTop ? 30 + Math.random() * 30 : 15 + Math.random() * 25
      stars.push({
        x: fromTop ? Math.random() * width : -40,
        y: fromTop ? -40 : Math.random() * height * 0.6,
        angle,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        distance: 0,
      })
      nextSpawn = elapsed + minDelay + Math.random() * (maxDelay - minDelay)
    }

    const animate = (time: number) => {
      if (!visible) {
        frame = null
        return
      }
      const delta = last === 0 ? 16 : time - last
      last = time
      elapsed += delta

      if (elapsed >= nextSpawn) spawn()

      ctx.clearRect(0, 0, width, height)

      const step = delta / 16
      stars = stars.filter((star) => {
        const rad = (star.angle * Math.PI) / 180
        star.x += Math.cos(rad) * star.speed * step
        star.y += Math.sin(rad) * star.speed * step
        star.distance += star.speed * step

        const tail = Math.min(star.distance, trailLength)
        const tailX = star.x - Math.cos(rad) * tail
        const tailY = star.y - Math.sin(rad) * tail

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y)
        gradient.addColorStop(0, `rgba(${trailRgb}, 0)`)
        gradient.addColorStop(1, starColor)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.4
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(star.x, star.y)
        ctx.stroke()

        return star.x < width + 80 && star.y < height + 80
      })

      frame = requestAnimationFrame(animate)
    }

    const start = () => {
      if (frame !== null) return
      last = 0
      frame = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }

    resize()
    nextSpawn = minDelay

    const resizeObserver = new ResizeObserver(resize)
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
  }, [minDelay, maxDelay, minSpeed, maxSpeed, starColor, trailRgb, trailLength])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  )
}
