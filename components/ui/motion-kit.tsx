"use client"

import {
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/** Revelação ao entrar na tela: fade + 16px, uma vez só. Também usado em components/legal. */
export const reveal = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }) as const

/**
 * `reveal` com prefers-reduced-motion: o deslocamento fica instantâneo e sobra
 * só o fade. O estado inicial é o mesmo no servidor e no cliente (só a transição
 * muda), então não há aviso de hidratação. Usado pelas seções do meio da home.
 */
export function useReveal() {
  const reduce = useReducedMotion()
  return (delay = 0) => {
    const base = reveal(delay)
    return reduce ? { ...base, transition: { ...base.transition, y: { duration: 0 } } } : base
  }
}

/**
 * Parallax leve (P2 do REFERENCIAS): a forma anda ±32 px e a arte ±12 px enquanto
 * o alvo cruza a tela. Só de `md` para cima e sem prefers-reduced-motion. A media
 * query começa falsa e só liga depois da hidratação, então o HTML do servidor bate.
 */
export function useParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = useMediaQuery("(min-width: 768px) and (prefers-reduced-motion: no-preference)")
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const shapeY = useTransform(scrollYProgress, [0, 1], [32, -32])
  const artY = useTransform(scrollYProgress, [0, 1], [12, -12])
  return { ref, shape: enabled ? { y: shapeY } : undefined, art: enabled ? { y: artY } : undefined }
}

/** Contrato dos ícones de components/icons/animated (todos expõem esse handle). */
export interface AnimatedIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimatedIconHandle>
>

/**
 * Toca o ícone animado uma vez quando o item entra na tela (o celular não tem
 * hover) e de novo no hover do item. Espalhe o resto no `motion.*` do item e passe
 * `icon` como ref do ícone. Com prefers-reduced-motion o ícone fica parado.
 */
export function useIconPlay(delay = 0) {
  const icon = useRef<AnimatedIconHandle>(null)
  const reduce = useReducedMotion()
  const start = () => {
    if (!reduce) icon.current?.startAnimation()
  }
  return {
    icon,
    onViewportEnter: () => setTimeout(start, delay * 1000),
    onMouseEnter: start,
    onMouseLeave: () => icon.current?.stopAnimation(),
  }
}

interface ShapePanelProps {
  children: ReactNode
  className?: string
  /** Resultado de `useParallax()`; sem ele o painel fica parado. */
  parallax?: ReturnType<typeof useParallax>
}

/**
 * Padrão visual do site (decisão 10 do PLANO): painel claro arredondado com o
 * símbolo verde grande, cortado pela borda, e a ilustração por cima.
 */
export function ShapePanel({ children, className, parallax }: ShapePanelProps) {
  return (
    <div
      ref={parallax?.ref}
      className={cn(
        "relative isolate grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-surface",
        className,
      )}
    >
      <motion.div
        style={parallax?.shape}
        className="pointer-events-none absolute -right-[22%] -top-[18%] -z-10 w-[78%]"
      >
        <Image src="/images/formas/simbolo-verde.svg" alt="" width={734} height={691} className="h-auto w-full" />
      </motion.div>
      <motion.div style={parallax?.art} className="col-start-1 row-start-1 grid size-full place-items-center">
        {children}
      </motion.div>
    </div>
  )
}

interface IconItemProps {
  icon: AnimatedIcon
  delay: number
  children: ReactNode
}

/** Item de lista com ícone animado num quadrado azul-claro, que fica azul no hover. Usado no Problema e no Sobre. */
export function IconItem({ icon: Icon, delay, children }: IconItemProps) {
  const reveal = useReveal()
  const { icon, ...play } = useIconPlay(delay)

  return (
    <motion.li {...reveal(delay)} {...play} className="group flex items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-accent text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon ref={icon} size={22} aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-[-0.01em] text-foreground">{children}</span>
    </motion.li>
  )
}
