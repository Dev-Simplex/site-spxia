"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { animate } from "motion/react"

import { cn } from "@/lib/utils"

interface GlowingEffectProps {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  variant?: "default" | "white"
  glow?: boolean
  className?: string
  disabled?: boolean
  movementDuration?: number
  borderWidth?: number
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lastPosition = useRef({ x: 0, y: 0 })
    const animationFrameRef = useRef<number>(0)
    // O efeito segue o cursor: em telas de toque não há cursor para seguir e os
    // listeners globais só custariam bateria.
    const [pointerFine, setPointerFine] = useState(false)
    // Cada card monta um GlowingEffect; sem isto, seis instâncias escutariam
    // pointermove no document.body e fariam seis getBoundingClientRect por evento.
    const [inView, setInView] = useState(false)

    useEffect(() => {
      const query = window.matchMedia("(pointer: fine)")
      const sync = () => setPointerFine(query.matches)
      sync()
      query.addEventListener("change", sync)
      return () => query.removeEventListener("change", sync)
    }, [])

    useEffect(() => {
      const element = containerRef.current
      if (!element) return
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { rootMargin: "120px" },
      )
      observer.observe(element)
      return () => observer.disconnect()
    }, [])

    const handleMove = useCallback(
      (event?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current
          if (!element) return

          const { left, top, width, height } = element.getBoundingClientRect()
          const mouseX = event?.x ?? lastPosition.current.x
          const mouseY = event?.y ?? lastPosition.current.y

          if (event) lastPosition.current = { x: mouseX, y: mouseY }

          const center = [left + width * 0.5, top + height * 0.5]
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          )
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0")
            return
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity

          element.style.setProperty("--active", isActive ? "1" : "0")
          if (!isActive) return

          const currentAngle =
            Number.parseFloat(element.style.getPropertyValue("--start")) || 0
          const targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180

          animate(currentAngle, currentAngle + angleDiff, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value))
            },
          })
        })
      },
      [inactiveZone, proximity, movementDuration]
    )

    useEffect(() => {
      if (disabled || !inView || !pointerFine) return

      const handleScroll = () => handleMove()
      const handlePointerMove = (event: PointerEvent) => handleMove(event)

      window.addEventListener("scroll", handleScroll, { passive: true })
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      })

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        window.removeEventListener("scroll", handleScroll)
        document.body.removeEventListener("pointermove", handlePointerMove)
        // Sai da tela com o halo aceso? Apaga, senão volta preso no último ângulo.
        containerRef.current?.style.setProperty("--active", "0")
      }
    }, [handleMove, disabled, inView, pointerFine])

    return (
      <>
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border border-primary/30 opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          aria-hidden="true"
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--gradient":
                variant === "white"
                  ? "repeating-conic-gradient(from 236.84deg at 50% 50%, #fefefe, #fefefe 5%)"
                  : `radial-gradient(circle, #f90108 10%, #f9010800 24%),
                    radial-gradient(circle at 40% 40%, #ff686c 5%, #ff686c00 18%),
                    radial-gradient(circle at 60% 60%, #8a171b 10%, #8a171b00 24%),
                    repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      #f90108 0%,
                      #ff686c 8%,
                      #8a171b 16%,
                      #f90108 24%
                    )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow rounded-[inherit]",
              'after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:rounded-[inherit] after:content-[""]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#0000_0deg,#fff,#0000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    )
  }
)

GlowingEffect.displayName = "GlowingEffect"

export { GlowingEffect }
