"use client"

import { useEffect, useId, useMemo, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container, ISourceOptions } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import { motion, useAnimation } from "motion/react"

import { useInViewport } from "@/hooks/use-in-viewport"
import { cn } from "@/lib/utils"

/**
 * SparklesCore (Aceternity) — partículas via tsparticles.
 *
 * Ajustes de performance sobre o original:
 * - O engine (`loadSlim`) só é carregado quando o bloco entra na viewport:
 *   nada de inicializar tsparticles para uma seção no rodapé da página.
 * - Fora da tela o container é pausado (`pauseOnOutsideViewport`) em vez de
 *   seguir rodando o próprio rAF; `pauseOnBlur` cobre a aba em background.
 * - `fpsLimit` em 60 (o original pedia 120: o dobro de updates por segundo
 *   sem ganho visual em telas de 60Hz).
 * - Sem bloco `interactivity`: o original registrava click-to-push, que
 *   adiciona listeners globais e não é usado em nenhuma das duas seções.
 * - Options memoizadas — objeto novo a cada render forçava o tsparticles a
 *   reprocessar a configuração inteira.
 * - `prefers-reduced-motion` não renderiza partícula alguma.
 */
type ParticlesProps = {
  id?: string
  className?: string
  background?: string
  particleSize?: number
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props
  const [init, setInit] = useState(false)
  const controls = useAnimation()
  const generatedId = useId()

  // `once`: uma vez montado o engine, deixa o próprio tsparticles pausar por viewport.
  const [wrapperRef, inViewport] = useInViewport<HTMLDivElement>({
    once: true,
    rootMargin: "200px",
  })

  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (!inViewport || reduceMotion || init) return
    let cancelled = false
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      if (!cancelled) setInit(true)
    })
    return () => {
      cancelled = true
    }
  }, [inViewport, reduceMotion, init])

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      })
    }
  }

  const options = useMemo<ISourceOptions>(
    () => ({
      background: { color: { value: background || "#0d47a1" } },
      fullScreen: { enable: false, zIndex: 1 },
      fpsLimit: 60,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      detectRetina: true,
      particles: {
        color: { value: particleColor || "#ffffff" },
        shape: { type: "circle" },
        links: { enable: false },
        collisions: { enable: false },
        move: {
          enable: true,
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "out" },
          speed: { min: 0.1, max: 1 },
        },
        number: {
          density: { enable: true, width: 400, height: 400 },
          value: particleDensity || 120,
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            enable: true,
            speed: speed || 4,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none",
          },
        },
        size: {
          value: { min: minSize || 1, max: maxSize || 3 },
        },
      },
    }),
    [background, particleColor, particleDensity, speed, minSize, maxSize],
  )

  return (
    <motion.div
      ref={wrapperRef}
      animate={controls}
      className={cn("opacity-0 [contain:layout_paint_style]", className)}
    >
      {init && !reduceMotion && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={options}
        />
      )}
    </motion.div>
  )
}
