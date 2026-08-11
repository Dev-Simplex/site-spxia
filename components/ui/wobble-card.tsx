"use client"

import React, { useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * WobbleCard (Aceternity) adaptado ao SPX.
 *
 * Performance: o original guardava a posição do mouse em estado — cada
 * `mousemove` sobre o card re-renderizava o card inteiro (incluindo todos os
 * filhos) só para reescrever um `transform`. Aqui a posição vai direto para o
 * DOM via refs; o resultado visual e a transição de 0.1s são os mesmos.
 */
export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
}) => {
  const outerRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)

  const apply = useCallback((x: number, y: number) => {
    if (outerRef.current) {
      outerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(1, 1, 1)`
    }
    if (innerRef.current) {
      const scale = hoveringRef.current ? 1.03 : 1
      innerRef.current.style.transform = `translate3d(${-x}px, ${-y}px, 0) scale3d(${scale}, ${scale}, 1)`
    }
  }, [])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { clientX, clientY } = event
      const rect = event.currentTarget.getBoundingClientRect()
      apply(
        (clientX - (rect.left + rect.width / 2)) / 20,
        (clientY - (rect.top + rect.height / 2)) / 20,
      )
    },
    [apply],
  )

  return (
    <section
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        hoveringRef.current = true
      }}
      onMouseLeave={() => {
        hoveringRef.current = false
        apply(0, 0)
      }}
      style={{
        transform: "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn("relative mx-auto w-full overflow-hidden rounded-2xl bg-card", containerClassName)}
    >
      <div
        className="relative h-full overflow-hidden [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl"
        style={{
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <div
          ref={innerRef}
          style={{
            transform: "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-4 py-20 sm:px-10", className)}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
