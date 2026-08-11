"use client"

// Aceternity UI — spotlight-new (https://ui.aceternity.com/registry/spotlight-new.json).
// Defaults trocados do azul original para o vermelho da marca (#F90108 ≈ hsl(358 84% 56%)).
//
// Performance: o original mantinha dois `motion.div` em `repeat: Infinity`
// rodando enquanto a página inteira era percorrida — o hero fica muito acima da
// dobra depois do primeiro scroll. O vai-e-vem virou keyframe CSS (mesmo
// easing e mesma duração), o que permite congelá-lo com `animation-play-state`
// quando o hero sai da tela e desligá-lo em prefers-reduced-motion.
import type { CSSProperties } from "react"
import { motion } from "motion/react"

import { useInViewport } from "@/hooks/use-in-viewport"

import "./animation-pause.css"

const SPOTLIGHT_CSS = `
@keyframes spx-spotlight-drift {
  0% { transform: translateX(0); }
  50% { transform: translateX(var(--spx-spotlight-x)); }
  100% { transform: translateX(0); }
}
[data-spx-spotlight-drift] {
  animation-name: spx-spotlight-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  [data-spx-spotlight-drift] { animation: none; }
}
`

type SpotlightNewProps = {
  gradientFirst?: string
  gradientSecond?: string
  gradientThird?: string
  translateY?: number
  width?: number
  height?: number
  smallWidth?: number
  duration?: number
  xOffset?: number
  className?: string
}

export const SpotlightNew = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(358, 84%, 66%, .10) 0, hsla(358, 84%, 56%, .03) 50%, hsla(358, 84%, 46%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .06) 0, hsla(358, 84%, 56%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(358, 84%, 66%, .05) 0, hsla(358, 84%, 46%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
  className,
}: SpotlightNewProps = {}) => {
  const [ref, inView] = useInViewport<HTMLDivElement>({ rootMargin: "100px" })

  const drift = {
    animationDuration: `${duration}s`,
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      aria-hidden="true"
      data-spx-paused={inView ? undefined : "true"}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className ?? ""}`}
    >
      {/* href + precedence: o React 19 iça e deduplica o bloco no <head>. */}
      <style href="spx-spotlight" precedence="default">
        {SPOTLIGHT_CSS}
      </style>

      <div
        data-spx-spotlight-drift
        style={{ ...drift, "--spx-spotlight-x": `${xOffset}px` } as CSSProperties}
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute left-0 top-0"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute left-0 top-0 origin-top-left"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute left-0 top-0 origin-top-left"
        />
      </div>

      <div
        data-spx-spotlight-drift
        style={{ ...drift, "--spx-spotlight-x": `${-xOffset}px` } as CSSProperties}
        className="pointer-events-none absolute right-0 top-0 h-full w-full"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute right-0 top-0"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute right-0 top-0 origin-top-right"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute right-0 top-0 origin-top-right"
        />
      </div>
    </motion.div>
  )
}
