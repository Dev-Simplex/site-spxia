"use client"

import { useInViewport } from "@/hooks/use-in-viewport"

import "@/components/ui/animation-pause.css"

/**
 * Congela as animações CSS contínuas de uma seção enquanto ela está fora da tela.
 *
 * A landing tem dezenas de keyframes infinitos espalhados (`spx-breathe`,
 * `spx-blink`, `spx-sweep`, `spx-shimmer`, `animate-ping`, marquee…). Cada um
 * segue custando compositor mesmo a três telas de distância. Em vez de
 * instrumentar cada elemento, a seção inteira vira um escopo:
 *
 *     const scope = useAnimationScope<HTMLElement>()
 *     <section {...scope}>…</section>
 *
 * O keyframe congela no ponto atual e retoma exatamente dali — sem re-play.
 */
export function useAnimationScope<T extends Element>(rootMargin = "200px") {
  const [ref, inView] = useInViewport<T>({ rootMargin })

  return {
    ref,
    "data-spx-paused": inView ? undefined : ("true" as const),
  }
}
