"use client"

import { useRef, type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// Aura vermelha que acende atrás do card e acompanha o ponteiro.
// Escreve direto em CSS vars (sem state) para não re-renderizar a cada mousemove;
// fica atrás do conteúdo, então não interfere no hover/click dos filhos.
interface GlowHoverCardProps {
  children: ReactNode
  className?: string
  /** Cor da aura. */
  color?: string
  /** Raio do brilho, em px. */
  radius?: number
}

export function GlowHoverCard({
  children,
  className,
  color = "249, 1, 8",
  radius = 260,
}: GlowHoverCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    element.style.setProperty("--glow-x", `${event.clientX - rect.left}px`)
    element.style.setProperty("--glow-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={cn("group/glow relative h-full", className)}
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-color": color,
          "--glow-radius": `${radius}px`,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-[1.75rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover/glow:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(var(--glow-color), 0.42), transparent 72%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
