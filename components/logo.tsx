import { cn } from '@/lib/utils'
import {
  BRAND_RATIO,
  BRAND_VIEWBOX,
  SYMBOL_IN_LOCKUP,
  SYMBOL_STANDALONE,
  WORDMARK,
} from '@/components/brand-paths'

interface LogoProps {
  /** Ignorado: a largura vem da altura pela proporção real da marca. */
  width?: number
  height?: number
  /** `full` = spx + bloco ⟩IA⟨; `symbol` = só o bloco. */
  variant?: 'full' | 'symbol'
  className?: string
  /**
   * Cor do "spx". Por padrão herda `currentColor`, então a marca se adapta ao
   * contexto (branca no header escuro, preta em documento claro) sem precisar
   * de um arquivo por fundo. O bloco ⟩IA⟨ permanece sempre no vermelho.
   */
  wordmarkClassName?: string
}

/**
 * Marca SPX IA. Os contornos vêm de components/brand-paths.ts, extraídos do
 * arquivo oficial do kit — o desenho é o mesmo, não uma aproximação.
 *
 * A assinatura "Intelligence and Automation" fica fora de propósito: nos
 * tamanhos em que o site usa a marca (28 a 50px) ela teria menos de 5px de
 * altura de letra. Está exportada como TAGLINE e sai nos SVGs de
 * public/brand/svg para materiais impressos e peças grandes.
 */
export function Logo({
  height = 40,
  variant = 'full',
  className,
  wordmarkClassName,
}: LogoProps) {
  const symbolOnly = variant === 'symbol'
  const ratio = symbolOnly ? BRAND_RATIO.symbol : BRAND_RATIO.horizontal

  return (
    <svg
      width={Math.round(height * ratio)}
      height={height}
      viewBox={symbolOnly ? BRAND_VIEWBOX.symbol : BRAND_VIEWBOX.horizontal}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SPX IA"
      className={className}
    >
      {/* A ordem importa: o "x" e o colchete esquerdo do bloco se sobrepõem por
          desenho, e é o bloco que fica por cima. Invertendo, o "x" come o
          colchete e a marca vira "spx IA⟨". Ver brand-paths.ts. */}
      {!symbolOnly && (
        <path
          d={WORDMARK}
          fill="currentColor"
          fillRule="evenodd"
          className={cn(wordmarkClassName)}
        />
      )}
      <path
        d={symbolOnly ? SYMBOL_STANDALONE : SYMBOL_IN_LOCKUP}
        fill="#F90108"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default Logo
