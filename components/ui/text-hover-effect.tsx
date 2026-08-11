"use client"

import { useCallback, useId, useRef, useState, type PointerEvent } from "react"
import { motion } from "motion/react"

interface TextHoverEffectProps {
  text: string
  duration?: number
  className?: string
}

/**
 * Aceternity UI — text-hover-effect.
 *
 * Performance: o original guardava a posição do cursor em estado e, num efeito
 * encadeado, chamava `getBoundingClientRect()` a cada movimento — dois renders
 * e um reflow forçado por evento de mouse. O rect passou a ser medido uma vez
 * no `pointerenter` (é o lettering do rodapé: não muda de tamanho durante o
 * hover) e o estado guarda direto a posição da máscara.
 */
export function TextHoverEffect({
  text,
  duration = 0.12,
  className,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" })
  const id = useId().replaceAll(":", "")
  const gradientId = `${id}-text-gradient`
  const revealId = `${id}-reveal-mask`
  const maskId = `${id}-text-mask`

  const handlePointerEnter = useCallback(() => {
    rectRef.current = svgRef.current?.getBoundingClientRect() ?? null
    setHovered(true)
  }, [])

  const handlePointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
    const rect = rectRef.current
    if (!rect) return
    setMaskPosition({
      cx: `${((event.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((event.clientY - rect.top) / rect.height) * 100}%`,
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={text}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a1b1e" />
          <stop offset="35%" stopColor="#f90108" />
          <stop offset="65%" stopColor="#ff7377" />
          <stop offset="100%" stopColor="#b02428" />
        </linearGradient>

        <motion.radialGradient
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${revealId})`} />
        </mask>
      </defs>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.45"
        className="fill-transparent stroke-[#3d3d3d] font-sans text-7xl font-black tracking-tight"
        // whileInView: o traço de 4s desenhava no mount, muito antes de o
        // rodapé aparecer — animando atributos SVG enquanto o usuário lê o hero.
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        whileInView={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.55"
        mask={`url(#${maskId})`}
        className="fill-transparent font-sans text-7xl font-black tracking-tight transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {text}
      </text>
    </svg>
  )
}
