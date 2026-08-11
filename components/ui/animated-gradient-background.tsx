"use client"

import { motion } from "motion/react"
import type React from "react"
import { useEffect, useRef } from "react"

interface AnimatedGradientBackgroundProps {
  /**
   * Initial size of the radial gradient, defining the starting width.
   * @default 110
   */
  startingGap?: number

  /**
   * Enables or disables the breathing animation effect.
   * @default false
   */
  Breathing?: boolean

  /**
   * Array of colors to use in the radial gradient.
   * Each color corresponds to a stop percentage in `gradientStops`.
   * @default ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
   */
  gradientColors?: string[]

  /**
   * Array of percentage stops corresponding to each color in `gradientColors`.
   * The values should range between 0 and 100.
   * @default [35, 50, 60, 70, 80, 90, 100]
   */
  gradientStops?: number[]

  /**
   * Speed of the breathing animation.
   * Lower values result in slower animation.
   * @default 0.02
   */
  animationSpeed?: number

  /**
   * Maximum range for the breathing animation in percentage points.
   * Determines how much the gradient "breathes" by expanding and contracting.
   * @default 5
   */
  breathingRange?: number

  /**
   * Additional inline styles for the gradient container.
   * @default {}
   */
  containerStyle?: React.CSSProperties

  /**
   * Additional class names for the gradient container.
   * @default ""
   */
  containerClassName?: string

  /**
   * Additional top offset for the gradient container form the top to have a more flexible control over the gradient.
   * @default 0
   */
  topOffset?: number
}

/**
 * AnimatedGradientBackground
 *
 * This component renders a customizable animated radial gradient background with a subtle breathing effect.
 * It uses `motion` for an entrance animation and raw CSS gradients for the dynamic background.
 *
 *
 * @param {AnimatedGradientBackgroundProps} props - Props for configuring the gradient animation.
 * @returns JSX.Element
 */
const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  startingGap = 125,
  Breathing = false,
  gradientColors = ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"],
  gradientStops = [35, 50, 60, 70, 80, 90, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  containerStyle = {},
  topOffset = 0,
  containerClassName = "",
}) => {
  // Validation: Ensure gradientStops and gradientColors lengths match
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length.
     Received gradientColors length: ${gradientColors.length},
     gradientStops length: ${gradientStops.length}`,
    )
  }

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const stopsString = gradientStops
      .map((stop, index) => `${gradientColors[index]} ${stop}%`)
      .join(", ")

    const paint = (value: number) => {
      element.style.background = `radial-gradient(${value}% ${value + topOffset}% at 50% 20%, ${stopsString})`
    }

    let width = startingGap
    paint(width)

    // Gradiente estático não precisa de loop: o original mantinha um rAF vivo
    // para sempre reescrevendo a mesma string (repaint de tela cheia a 60fps).
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!Breathing || reduceMotion) return

    let directionWidth = 1
    let frame: number | null = null
    let visible = false
    let lastPaint = 0

    // A respiração varia ~0.018% por frame: repintar a 60fps é indistinguível
    // de repintar a ~24fps, e um radial-gradient de tela cheia é repaint puro.
    const FRAME_BUDGET = 1000 / 24

    const animate = (time: number) => {
      if (!visible) {
        frame = null
        return
      }

      const delta = lastPaint === 0 ? FRAME_BUDGET : time - lastPaint
      if (delta >= FRAME_BUDGET) {
        // Avanço proporcional ao tempo real: o ritmo da respiração não muda
        // com o throttle nem com quedas de fps.
        const steps = delta / (1000 / 60)
        if (width >= startingGap + breathingRange) directionWidth = -1
        if (width <= startingGap - breathingRange) directionWidth = 1
        width += directionWidth * animationSpeed * steps
        paint(width)
        lastPaint = time
      }

      frame = requestAnimationFrame(animate)
    }

    const start = () => {
      if (frame !== null) return
      lastPaint = 0
      frame = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    observer.observe(element)

    return () => {
      stop()
      observer.disconnect()
    }
  }, [startingGap, Breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset])

  return (
    <motion.div
      key="animated-gradient-background"
      initial={{
        opacity: 0,
        scale: 1.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1], // Cubic bezier easing
        },
      }}
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
    >
      {/* `contain` isola o repaint do gradiente do resto da seção. */}
      <div
        ref={containerRef}
        style={containerStyle}
        className="absolute inset-0 [contain:layout_paint_style]"
      />
    </motion.div>
  )
}

export default AnimatedGradientBackground
