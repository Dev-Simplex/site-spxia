"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface UseInViewportOptions {
  /** Depois de entrar uma vez, nunca mais volta para false (lazy mount). */
  once?: boolean
  /** Margem do observer — antecipa a montagem/retomada antes de aparecer. */
  rootMargin?: string
  threshold?: number
  /**
   * Valor antes do primeiro relatório do observer. O default segue o uso:
   * lazy mount (`once`) começa fora, pausa por viewport começa dentro — assim
   * o HTML do servidor nunca sai com os efeitos congelados caso a hidratação
   * demore ou falhe.
   */
  initialInView?: boolean
}

/**
 * Sinaliza se o elemento está (ou já esteve, com `once`) na viewport.
 *
 * Base de todas as pausas de efeito do site: loops de rAF, engines de
 * partícula e animações CSS contínuas só rodam com a seção na tela.
 * Usa IntersectionObserver nativo em vez de `useInView` do motion para
 * poder ser usado também em componentes que não dependem do motion.
 */
export function useInViewport<T extends Element>(
  options: UseInViewportOptions = {},
): [RefObject<T | null>, boolean] {
  const { once = false, rootMargin = "0px", threshold = 0, initialInView = !once } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(initialInView)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Sem suporte (ou em ambiente de teste): assume visível para não sumir com o efeito.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
          return
        }
        setInView(entry.isIntersecting)
      },
      { rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView]
}
