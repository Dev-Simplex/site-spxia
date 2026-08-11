import { cn } from "@/lib/utils"

import "./section-effects.css"

/**
 * Mockup de painel em CSS/SVG puro — sem imagem, sem texto, sem dado inventado.
 * Existe só para dar matéria visual a uma coluna que hoje é 100% tipografia.
 * É decorativo: `aria-hidden`, fora da ordem de leitura.
 */

const SPARK_LINE = "M0 46 L26 38 L52 41 L78 24 L104 30 L130 14 L156 18 L182 6"
const SPARK_AREA = `${SPARK_LINE} L182 56 L0 56 Z`

export function PanelMock({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      {/* halo por trás do painel */}
      <div className="pointer-events-none absolute -inset-x-6 -bottom-8 top-6 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_60%,rgba(249,1,8,0.18),transparent_70%)] blur-2xl spx-breathe" />

      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-secondary to-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
        {/* barra de título */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="size-2 rounded-full bg-primary/70" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/25" />
          <span className="ml-3 h-2 w-28 rounded-full bg-muted-foreground/20" />
          <span className="ml-auto h-2 w-10 rounded-full bg-muted-foreground/15" />
        </div>

        <div className="flex">
          {/* navegação lateral */}
          <div className="hidden w-24 shrink-0 flex-col gap-3 border-r border-white/[0.06] p-4 sm:flex">
            <span className="h-2 w-full rounded-full bg-primary/50" />
            <span className="h-2 w-4/5 rounded-full bg-muted-foreground/20" />
            <span className="h-2 w-3/5 rounded-full bg-muted-foreground/20" />
            <span className="h-2 w-4/6 rounded-full bg-muted-foreground/20" />
            <span className="h-2 w-2/5 rounded-full bg-muted-foreground/15" />
          </div>

          <div className="min-w-0 flex-1 p-4">
            {/* indicadores */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/[0.06] bg-background/40 p-3"
                >
                  <span className="block h-1.5 w-8 rounded-full bg-muted-foreground/25" />
                  <span
                    className={cn(
                      "mt-2.5 block h-3 rounded-full",
                      i === 0 ? "w-12 bg-primary/70" : "w-10 bg-foreground/25",
                    )}
                  />
                </div>
              ))}
            </div>

            {/* série temporal */}
            <div className="mt-3 rounded-lg border border-white/[0.06] bg-background/40 p-3">
              <svg
                viewBox="0 0 182 56"
                fill="none"
                preserveAspectRatio="none"
                className="h-16 w-full"
              >
                <path
                  d="M0 14H182M0 32H182M0 50H182"
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                  className="text-foreground"
                />
                <path d={SPARK_AREA} fill="url(#spx-panel-spark)" />
                <path
                  d={SPARK_LINE}
                  stroke="#f90108"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="182" cy="6" r="3" fill="#f90108" className="spx-blink" />
                <defs>
                  <linearGradient id="spx-panel-spark" x1="0" y1="0" x2="0" y2="56">
                    <stop stopColor="#f90108" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#f90108" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* execuções monitoradas */}
            <div className="mt-3 space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-background/40 px-3 py-2.5"
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      i === 1 ? "bg-primary spx-blink" : "bg-[#4ade80]",
                    )}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  <span
                    className={cn(
                      "h-2 rounded-full bg-muted-foreground/20",
                      i === 0 ? "w-32" : i === 1 ? "w-24" : "w-28",
                    )}
                  />
                  <span className="ml-auto h-2 w-8 shrink-0 rounded-full bg-muted-foreground/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
