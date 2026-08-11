"use client"

import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react"

import { blockPageReady, releasePageReady } from "@/lib/page-ready"
import { PRELOADER_DONE_EVENT } from "@/components/ui/site-preloader"
import { cn } from "@/lib/utils"

/* ————— FLAGS DE REVERSIBILIDADE (uma linha reverte cada comportamento) ————— */
/**
 * true → a cena 3D volta a SEGURAR a cortina de entrada (SitePreloader), via
 * lib/page-ready. O teto continua sendo o failsafe da cortina (MAX_MS=5s):
 * cena mais lenta que isso não tranca o site. Hoje é false de propósito —
 * o poster cobre o carregamento e a cortina sai no `load`.
 */
const WAIT_FOR_SCENE = false
/**
 * false → desliga o poster estático do hero (comportamento antigo: o espaço
 * da cena fica vazio até o runtime carregar e fazer fade-in).
 */
const USE_POSTER = true
/**
 * true → em telas <768px o runtime 3D nem monta (fica só o poster): o robô
 * fica atrás de um overlay preto 70% e não compensa os ~MB de download.
 * false → monta a cena 3D também no mobile.
 */
const DISABLE_3D_ON_MOBILE = true

const Spline = lazy(() => import("@splinetool/react-spline"))

/** Id do bloqueio de prontidão registrado quando WAIT_FOR_SCENE está ligada. */
const READY_BLOCK_ID = "hero-spline"

/* Frame real da cena (1014x888), capturado sem texto/header. O avif/webp são
 * minúsculos (~6/10 KB); o png fica só de fallback para browsers antigos. */
const POSTER = {
  avif: "/hero-poster.avif",
  webp: "/hero-poster.webp",
  png: "/hero-poster.png",
} as const

interface SplineSceneProps {
  scene: string
  /** Classe aplicada ao canvas do Spline. */
  className?: string
  /** Classe do wrapper da cena. */
  containerClassName?: string
  /** Sem uso próprio: o poster cobre o carregamento. Mantido pela API dos chamadores. */
  loadingLabel?: string
  /** Sem onLoad até aqui, desiste da cena (desmonta o runtime) e fica no poster. */
  timeoutMs?: number
}

/* Se o chunk do runtime falhar (rede, CDN), não há cena — o poster permanece
 * e o usuário nunca vê buraco no hero. onError avisa o pai (libera a cortina
 * quando WAIT_FOR_SCENE está ligada). */
class SceneErrorBoundary extends Component<
  { children: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

/*
 * Cena 3D do hero com poster estático na frente.
 *
 * O poster (frame real da cena) aparece imediatamente; o runtime Spline monta
 * por trás e, no onLoad, o canvas faz fade-in POR CIMA do poster. Como os dois
 * mostram a mesma imagem, a troca é imperceptível — e fazer fade só no canvas
 * (em vez de crossfade dos dois) evita o vale de brilho no meio da transição.
 * O poster desmonta depois que o canvas cobre tudo, para não ocultar o fundo
 * animado (grade/partículas) que vaza pelas áreas transparentes do canvas.
 *
 * A cena NÃO segura mais a cortina global por padrão (ver lib/page-ready.ts):
 * se demorar, falhar ou estourar o timeout, o poster simplesmente permanece.
 * A flag WAIT_FOR_SCENE acima reverte isso; o bloqueio é registrado DURANTE O
 * RENDER (exigência documentada em lib/page-ready.ts — efeitos tardios
 * perderiam a corrida contra a cortina) e liberado em TODOS os caminhos de
 * saída: load, erro, timeout, cena desabilitada e desmontagem.
 */
export function SplineScene({
  scene,
  className,
  containerClassName,
  timeoutMs = 10000,
}: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)
  /** Decidido no cliente (matchMedia) — o servidor sempre renderiza só o poster. */
  const [sceneEnabled, setSceneEnabled] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  /** Poster sai do DOM só depois do fade do canvas terminar. */
  const [posterGone, setPosterGone] = useState(false)

  // Registro no render, não em efeito (ver comentário acima). No servidor é
  // no-op; release é idempotente, então liberar em vários caminhos é seguro.
  useState(() => {
    if (WAIT_FOR_SCENE) blockPageReady(READY_BLOCK_ID)
  })

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const wants = (!small || !DISABLE_3D_ON_MOBILE) && !reduce

    if (!wants) {
      // Runtime não vai montar → nada de segurar a cortina esperando um
      // onLoad que nunca vem.
      releasePageReady(READY_BLOCK_ID)
      return
    }

    // Com WAIT_FOR_SCENE a cortina espera a cena — adiar o runtime até a
    // cortina sair seria deadlock. Monta imediatamente.
    // Sem a flag, ADIA a montagem até a cortina desmontar: o parse/compile do
    // runtime Spline trava o main thread e congela a coreografia do preloader
    // no meio (visto em captura frame a frame). O poster cobre o hero até lá.
    if (WAIT_FOR_SCENE || !document.querySelector("[data-site-preloader]")) {
      setSceneEnabled(true)
      return () => releasePageReady(READY_BLOCK_ID)
    }

    const enable = () => setSceneEnabled(true)
    window.addEventListener(PRELOADER_DONE_EVENT, enable, { once: true })
    // Fallback: se o evento se perder (ex.: cortina removida pelo failsafe
    // CSS às 8,5s, sem JS), o runtime ainda monta.
    const fallback = window.setTimeout(enable, 10000)
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, enable)
      window.clearTimeout(fallback)
      // Desmontagem libera qualquer bloqueio remanescente.
      releasePageReady(READY_BLOCK_ID)
    }
  }, [])

  useEffect(() => {
    if (!sceneEnabled || loaded) return
    const timer = window.setTimeout(() => {
      setGaveUp(true)
      releasePageReady(READY_BLOCK_ID)
    }, timeoutMs)
    return () => window.clearTimeout(timer)
  }, [sceneEnabled, loaded, timeoutMs])

  useEffect(() => {
    if (!loaded) return
    // 600ms de fade + folga para o compositor antes de remover o poster.
    const timer = window.setTimeout(() => setPosterGone(true), 800)
    return () => window.clearTimeout(timer)
  }, [loaded])

  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      {USE_POSTER && !posterGone && (
        <picture>
          <source srcSet={POSTER.avif} type="image/avif" />
          <source srcSet={POSTER.webp} type="image/webp" />
          {/* object-cover espelha o enquadramento do canvas: a altura do robô
              acompanha a altura do container e as sobras laterais são cortadas. */}
          <img
            src={POSTER.png}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

      {sceneEnabled && !gaveUp && (
        <div
          className={cn(
            "relative h-full w-full transition-opacity duration-[600ms] ease-out",
            loaded ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <SceneErrorBoundary onError={() => releasePageReady(READY_BLOCK_ID)}>
            <Suspense fallback={null}>
              <Spline
                scene={scene}
                className={className}
                onLoad={() => {
                  setLoaded(true)
                  releasePageReady(READY_BLOCK_ID)
                }}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  )
}
