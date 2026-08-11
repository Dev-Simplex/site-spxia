import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import "./section-effects.css"

/**
 * Mockups em SVG puro (sem imagem, sem dependência) usados como camada
 * decorativa dentro dos cards de Serviços — o site não tem fotografia, então
 * estes desenhos dão volume ao card sem competir com o texto.
 *
 * Todos herdam a cor por `currentColor`; os acentos usam `text-primary` no
 * consumidor. Piscadas usam .spx-blink / .spx-flow (desligados em
 * prefers-reduced-motion, ver section-effects.css).
 */

export type ServiceGlyphVariant =
  | "strategy"
  | "code"
  | "workflow"
  | "chat"
  | "learning"
  | "partnership"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-auto w-full"
    >
      {children}
    </svg>
  )
}

/** Roadmap com ROI projetado — eixo, curva ascendente e marcos. */
function StrategyGlyph() {
  const points: Array<[number, number]> = [
    [14, 66],
    [42, 54],
    [68, 58],
    [94, 34],
    [124, 20],
  ]
  const line = points.map(([x, y]) => `${x} ${y}`).join(" L ")

  return (
    <Frame>
      <path d="M14 12V76H128" strokeOpacity="0.45" />
      <path
        d={`M ${line} L 124 76 L 14 76 Z`}
        fill="currentColor"
        fillOpacity="0.07"
        stroke="none"
      />
      <path d={`M ${line}`} className="text-primary" />
      {points.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="2.75"
          fill="currentColor"
          stroke="none"
          className="spx-blink text-primary"
          style={delay(i * 0.35)}
        />
      ))}
      <path d="M14 40H128" strokeOpacity="0.15" strokeDasharray="2 5" />
    </Frame>
  )
}

/** Janela de editor — barra de título, linhas de código e cursor. */
function CodeGlyph() {
  const lines: Array<[number, number, number]> = [
    [24, 38, 42],
    [74, 38, 26],
    [32, 48, 34],
    [72, 48, 38],
    [32, 58, 50],
    [24, 68, 30],
  ]

  return (
    <Frame>
      <rect x="10" y="12" width="120" height="66" rx="6" strokeOpacity="0.45" />
      <path d="M10 28H130" strokeOpacity="0.45" />
      {[20, 29, 38].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={20}
          r="2.25"
          fill="currentColor"
          fillOpacity={i === 0 ? "1" : "0.35"}
          stroke="none"
          className={i === 0 ? "text-primary" : undefined}
        />
      ))}
      {lines.map(([x, y, w], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height="3.5"
          rx="1.75"
          fill="currentColor"
          fillOpacity={i % 3 === 0 ? "0.4" : "0.2"}
          stroke="none"
        />
      ))}
      <rect
        x="58"
        y="67"
        width="3"
        height="5.5"
        rx="1"
        fill="currentColor"
        stroke="none"
        className="spx-blink text-primary"
      />
    </Frame>
  )
}

/** Grafo de automação — nós conectados com pulso percorrendo as arestas. */
function WorkflowGlyph() {
  const edges = [
    "M36 45C46 45 48 23 58 23",
    "M36 45C46 45 48 67 58 67",
    "M84 23C94 23 96 45 104 45",
    "M84 67C94 67 96 45 104 45",
  ]

  return (
    <Frame>
      {edges.map((d) => (
        <path key={d} d={d} strokeOpacity="0.35" />
      ))}
      {edges.map((d, i) => (
        <path
          key={`flow-${d}`}
          d={d}
          className="spx-flow text-primary"
          style={delay(i * 0.4)}
        />
      ))}
      <rect x="10" y="36" width="26" height="18" rx="5" strokeOpacity="0.6" />
      <rect x="58" y="14" width="26" height="18" rx="5" strokeOpacity="0.6" />
      <rect x="58" y="58" width="26" height="18" rx="5" strokeOpacity="0.6" />
      <rect
        x="104"
        y="36"
        width="26"
        height="18"
        rx="5"
        className="text-primary"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {[
        [23, 45],
        [71, 23],
        [71, 67],
        [117, 45],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.25"
          fill="currentColor"
          stroke="none"
          className={cn("spx-blink", i === 3 && "text-primary")}
          style={delay(i * 0.5)}
        />
      ))}
    </Frame>
  )
}

/** Conversa com agente — balão recebido e balão respondendo. */
function ChatGlyph() {
  return (
    <Frame>
      {/* Mensagem recebida */}
      <rect x="12" y="10" width="84" height="30" rx="8" strokeOpacity="0.45" />
      <path d="M22 40V48L32 40" strokeOpacity="0.45" />
      <rect x="26" y="19" width="46" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.3" stroke="none" />
      <rect x="26" y="28" width="30" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.18" stroke="none" />

      {/* Agente respondendo */}
      <rect
        x="44"
        y="52"
        width="84"
        height="28"
        rx="8"
        className="text-primary"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M118 80V88L108 80" className="text-primary" />
      {[72, 86, 100].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={66}
          r="3"
          fill="currentColor"
          stroke="none"
          className="spx-blink text-primary"
          style={delay(i * 0.22)}
        />
      ))}
    </Frame>
  )
}

/** Tela de treinamento — slide com tópicos e barra de progresso. */
function LearningGlyph() {
  return (
    <Frame>
      <rect x="14" y="10" width="112" height="54" rx="6" strokeOpacity="0.45" />
      <path d="M70 64V72M52 72H88" strokeOpacity="0.45" />
      <rect
        x="26"
        y="20"
        width="40"
        height="4"
        rx="2"
        fill="currentColor"
        stroke="none"
        className="text-primary"
      />
      {[32, 42, 52].map((y, i) => (
        <g key={y}>
          <circle
            cx="28"
            cy={y + 1.5}
            r="2"
            fill="currentColor"
            stroke="none"
            fillOpacity="0.45"
          />
          <rect
            x="36"
            y={y}
            width={i === 1 ? 62 : 48}
            height="3"
            rx="1.5"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="none"
          />
        </g>
      ))}
      <rect x="88" y="50" width="26" height="4" rx="2" fill="currentColor" fillOpacity="0.15" stroke="none" />
      <rect
        x="88"
        y="50"
        width="16"
        height="4"
        rx="2"
        fill="currentColor"
        stroke="none"
        className="spx-blink text-primary"
      />
    </Frame>
  )
}

/** Acompanhamento mensal — calendário com marcos recorrentes. */
function PartnershipGlyph() {
  const cells = Array.from({ length: 15 }, (_, i) => ({
    cx: 32 + (i % 5) * 20,
    cy: 44 + Math.floor(i / 5) * 14,
    i,
  }))
  const marked = new Set([2, 7, 11])

  return (
    <Frame>
      <rect x="16" y="16" width="108" height="60" rx="6" strokeOpacity="0.45" />
      <path d="M16 32H124" strokeOpacity="0.45" />
      <path d="M44 10V20M96 10V20" strokeOpacity="0.6" />
      {cells.map(({ cx, cy, i }) =>
        marked.has(i) ? (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="currentColor"
            stroke="none"
            className="spx-blink text-primary"
            style={delay((i % 5) * 0.4)}
          />
        ) : (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="none"
          />
        ),
      )}
    </Frame>
  )
}

const glyphs: Record<ServiceGlyphVariant, () => ReactNode> = {
  strategy: StrategyGlyph,
  code: CodeGlyph,
  workflow: WorkflowGlyph,
  chat: ChatGlyph,
  learning: LearningGlyph,
  partnership: PartnershipGlyph,
}

export function ServiceGlyph({
  variant,
  className,
}: {
  variant: ServiceGlyphVariant
  className?: string
}) {
  const Glyph = glyphs[variant]
  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <Glyph />
    </div>
  )
}
