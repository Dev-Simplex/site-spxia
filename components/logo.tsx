import { cn } from '@/lib/utils'
import {
  BRAND_VIEWBOX,
  SYMBOL_IN_LOCKUP,
  SYMBOL_STANDALONE,
  WORDMARK,
} from '@/components/brand-paths'

/**
 * Proporção real do lockup traçado (1101x310). Os consumidores passam altura e a
 * largura é derivada daqui, para a marca nunca esticar nem sobrar caixa vazia.
 */
const RATIO = 1101 / 310

interface LogoProps {
  /** Ignorado no lockup: a largura vem da altura pela proporção real da marca. */
  width?: number
  height?: number
  /** `full` = símbolo + wordmark; `symbol` = só o losango. */
  variant?: 'full' | 'symbol'
  className?: string
  /**
   * Cor do wordmark. Por padrão herda `currentColor`, então a marca se adapta
   * ao contexto (branca no header escuro, preta em documento claro) sem precisar
   * de um arquivo por fundo. O símbolo permanece sempre no vermelho da marca.
   */
  wordmarkClassName?: string
}

/**
 * Marca SPXIA. Os contornos vêm de components/brand-paths.ts, traçados a partir
 * do kit oficial — o desenho é o mesmo dos arquivos entregues, não uma
 * aproximação tipográfica.
 */
export function Logo({
  height = 40,
  variant = 'full',
  className,
  wordmarkClassName,
}: LogoProps) {
  const symbolOnly = variant === 'symbol'
  const width = symbolOnly ? height : Math.round(height * RATIO)

  return (
    <svg
      width={width}
      height={height}
      viewBox={symbolOnly ? BRAND_VIEWBOX.symbol : BRAND_VIEWBOX.horizontal}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SPXIA"
      className={className}
    >
      {/* evenodd é obrigatório: o Potrace desenha os vazados (o "S" do losango, os
          contornos internos das letras) como subcaminhos do mesmo path. Com o
          `nonzero` padrão do SVG eles seriam preenchidos e o símbolo viraria um
          losango sólido. */}
      <path
        d={symbolOnly ? SYMBOL_STANDALONE : SYMBOL_IN_LOCKUP}
        fill="#F90108"
        fillRule="evenodd"
      />
      {!symbolOnly && (
        <path
          d={WORDMARK}
          fill="currentColor"
          fillRule="evenodd"
          className={wordmarkClassName}
        />
      )}
    </svg>
  )
}

export default Logo
