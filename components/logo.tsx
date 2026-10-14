import {
  BRAND_RATIO,
  BRAND_VIEWBOX,
  SYMBOL_STANDALONE,
  WORDMARK,
} from '@/components/brand-paths'

interface LogoProps {
  /** Ignorado: a largura vem da altura pela proporção real da marca. */
  width?: number
  height?: number
  /** `full` = símbolo + "SPXia"; `symbol` = só o símbolo. */
  variant?: 'full' | 'symbol'
  /**
   * `color` = versão colorida do kit (símbolo Azul Pulso, lettering preto),
   * para fundo claro. `white` = versão branca, para fundo azul ou escuro.
   */
  tone?: 'color' | 'white'
  className?: string
}

// As cores do logo são as do kit oficial, não tokens do tema: a marca não muda
// de cor se a paleta do site mudar.
const FILL = {
  color: { symbol: '#001FDA', wordmark: '#000000' },
  white: { symbol: '#FFFFFF', wordmark: '#FFFFFF' },
} as const

/** Marca SPXia. Os contornos vêm de components/brand-paths.ts (SVG oficial). */
export function Logo({ height = 40, variant = 'full', tone = 'color', className }: LogoProps) {
  const symbolOnly = variant === 'symbol'
  const ratio = symbolOnly ? BRAND_RATIO.symbol : BRAND_RATIO.horizontal
  const fill = FILL[tone]

  return (
    <svg
      width={Math.round(height * ratio)}
      height={height}
      viewBox={symbolOnly ? BRAND_VIEWBOX.symbol : BRAND_VIEWBOX.horizontal}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SPXia"
      className={className}
    >
      <path d={SYMBOL_STANDALONE} fill={fill.symbol} />
      {!symbolOnly && <path d={WORDMARK} fill={fill.wordmark} />}
    </svg>
  )
}

export default Logo
