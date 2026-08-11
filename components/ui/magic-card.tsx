"use client"

import React, { useCallback, useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react"

import { cn } from "@/lib/utils"

interface MagicCardBaseProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientFrom?: string
  gradientTo?: string
}

interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient"
  gradientColor?: string
  gradientOpacity?: number
  glowFrom?: never
  glowTo?: never
  glowAngle?: never
  glowSize?: never
  glowBlur?: never
  glowOpacity?: never
}

interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb"
  glowFrom?: string
  glowTo?: string
  glowAngle?: number
  glowSize?: number
  glowBlur?: number
  glowOpacity?: number
  gradientColor?: never
  gradientOpacity?: never
}

type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps
type ResetReason = "enter" | "leave" | "global" | "init"

function isOrbMode(props: MagicCardProps): props is MagicCardOrbProps {
  return props.mode === "orb"
}

export function MagicCard(props: MagicCardProps) {
  const {
    children,
    className,
    gradientSize = 240,
    gradientColor = "#f90108",
    gradientOpacity = 0.12,
    gradientFrom = "#f90108",
    gradientTo = "#7a1b1e",
    mode = "gradient",
  } = props

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#f90108") : "#f90108"
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#7a1b1e") : "#7a1b1e"
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9

  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 })
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 })
  const orbVisible = useSpring(0, { stiffness: 300, damping: 35 })

  const modeRef = useRef(mode)
  const glowOpacityRef = useRef(glowOpacity)
  const gradientSizeRef = useRef(gradientSize)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    glowOpacityRef.current = glowOpacity
  }, [glowOpacity])

  useEffect(() => {
    gradientSizeRef.current = gradientSize
  }, [gradientSize])

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      if (modeRef.current === "orb") {
        orbVisible.set(reason === "enter" ? glowOpacityRef.current : 0)
        return
      }

      const offset = -gradientSizeRef.current
      mouseX.set(offset)
      mouseY.set(offset)
    },
    [mouseX, mouseY, orbVisible]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      mouseX.set(event.clientX - rect.left)
      mouseY.set(event.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset("init")
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) reset("global")
    }
    const handleBlur = () => reset("global")
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset("global")
    }

    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  const borderBackground = useMotionTemplate`
    linear-gradient(#212121 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      #3d3d3d 100%
    ) border-box
  `
  const spotlightBackground = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 100%
    )
  `

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{ background: borderBackground }}
    >
      <div className="absolute inset-px z-20 rounded-[inherit] bg-[#212121]" />

      {mode === "gradient" && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: spotlightBackground,
            opacity: gradientOpacity,
          }}
        />
      )}

      {mode === "orb" && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            width: glowSize,
            height: glowSize,
            x: orbX,
            y: orbY,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            opacity: orbVisible,
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
        />
      )}

      <div className="relative z-40 h-full">{children}</div>
    </motion.div>
  )
}
