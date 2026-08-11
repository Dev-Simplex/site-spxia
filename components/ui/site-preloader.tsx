"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { BRAND_VIEWBOX, SYMBOL_STANDALONE } from "@/components/brand-paths"
import { isPageReady, subscribePageReady } from "@/lib/page-ready"
import { useI18n } from "@/lib/i18n/context"

/*
 * FLAGS DE REVERSIBILIDADE relacionadas: em components/ui/spline-scene.tsx
 * vivem WAIT_FOR_SCENE (cena 3D volta a segurar esta cortina), USE_POSTER
 * (poster do hero) e DISABLE_3D_ON_MOBILE (corte do runtime no mobile).
 * Cada uma reverte um comportamento com UMA linha.
 */

/**
 * Duração-piso da cortina. A linha do tempo (entrada 0,4s + traço 1,5s +
 * acendimento 0,45s) completa em ~2,3s; 2,4s dá um beat de respiro antes do
 * corte. Como o `load` normalmente chega antes disso, a cortina tem duração
 * FIXA e previsível (~2,4s + saída) em vez de variar com a rede.
 */
const MIN_MS = 2400
/** Failsafe JS: mesmo com `load` perdido ou registry travado, o site abre. */
const MAX_MS = 5000
/** Debounce da checagem de prontidão — absorve block/release transitórios. */
const SETTLE_MS = 120
/**
 * Failsafe em CSS PURO (sem JS nenhum): se um chunk falhar e o React nunca
 * hidratar, a cortina — que vem pronta no HTML do servidor — se esconde
 * sozinha. Conta: precisa cobrir o pior caminho feliz, MAX_MS + saída em duas
 * fases (5s + 0,38s + 0,72s ≈ 6,1s) e também MIN_MS + saída (~3,5s).
 * 8s > 6,1s com folga — não atropela nenhum caminho legítimo.
 */
const CSS_FAILSAFE_S = 8

/** Saída, fase 1: o conteúdo central recua (scale + blur + fade). */
const EXIT_CONTENT_S = 0.38
/** Saída, fase 2: só então as cortinas abrem, com parallax da malha. */
const EXIT_CURTAIN_S = 0.72

/*
 * Rede de segurança independente de JavaScript, inline no HTML do servidor
 * (nunca num chunk, que é justamente o que pode falhar):
 *
 * - a cortina se esconde sozinha após CSS_FAILSAFE_S (animação vence inline
 *   style; visibility:hidden desliga hit-testing, então cliques atravessam);
 * - o scroll trava por CSS enquanto a cortina existe (body:has) e o próprio
 *   CSS destrava no failsafe — nada depende de cleanup JS. Quando o JS vive,
 *   remover o nó do DOM desfaz o :has e destrava na hora. Em browsers sem
 *   :has (Firefox <121) simplesmente não há trava — degradação inofensiva.
 *
 * A ENTRADA da cena também vive aqui, em CSS puro: ela precisa rodar mesmo
 * antes da hidratação (o overlay vem pronto no HTML do servidor). Cada camada
 * entra em cascata — malha assentando (scale 1.06→1), vinheta fechando de
 * fora para dentro, símbolo subindo, texto por último. Elementos com entrada
 * CSS são divs puras: o Motion nunca anima as mesmas propriedades nelas
 * (animação CSS com fill:both venceria o style inline do Motion).
 */
const FAILSAFE_CSS = `
@keyframes spx-preloader-failsafe{to{opacity:0;visibility:hidden}}
[data-site-preloader]{animation:spx-preloader-failsafe .5s ease ${CSS_FAILSAFE_S}s forwards}
@keyframes spx-preloader-unlock{to{overflow:visible}}
body:has([data-site-preloader]){overflow:hidden;animation:spx-preloader-unlock 0s linear ${CSS_FAILSAFE_S + 0.5}s forwards}
@keyframes spx-enter-settle{from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}}
@keyframes spx-enter-rise{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes spx-enter-close{from{opacity:0;transform:scale(1.25)}to{opacity:1;transform:scale(1)}}
@keyframes spx-enter-grain{from{opacity:0}to{opacity:0.04}}
[data-spx-settle]{animation:spx-enter-settle .9s cubic-bezier(0.22,1,0.36,1) both}
[data-spx-rise]{animation:spx-enter-rise .8s cubic-bezier(0.22,1,0.36,1) .12s both}
[data-spx-rise-late]{animation:spx-enter-rise .7s cubic-bezier(0.22,1,0.36,1) .3s both}
[data-spx-close]{animation:spx-enter-close 1.1s cubic-bezier(0.22,1,0.36,1) both}
[data-spx-grain]{animation:spx-enter-grain .8s ease-out .25s both}
@media (prefers-reduced-motion: reduce){
  [data-spx-settle],[data-spx-rise],[data-spx-rise-late],[data-spx-close],[data-spx-grain]{animation:none}
}
`

/** Grão de filme: SVG estático (feTurbulence) em tile — custo zero de runtime. */
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E"

/**
 * Disparado no window quando a cortina desmonta. spline-scene.tsx usa isso
 * para só montar o runtime 3D DEPOIS da coreografia: o parse/compile do
 * Spline trava o main thread e congelaria a animação no meio.
 */
export const PRELOADER_DONE_EVENT = "spx:preloader-done"

const STEP_ORDER = ["dom", "fonts", "assets"] as const
type StepKey = (typeof STEP_ORDER)[number]

const COPY = {
  pt: {
    loading: "carregando",
    done: "pronto",
    steps: { dom: "estrutura", fonts: "fontes", assets: "recursos" },
  },
  en: {
    loading: "loading",
    done: "ready",
    steps: { dom: "structure", fonts: "fonts", assets: "assets" },
  },
} as const

/*
 * Cortina do primeiro carregamento.
 *
 * Ela precisa existir já no HTML do servidor: a hidratação só acontece depois
 * do evento `load`, então um overlay que só aparecesse após montar no cliente
 * nunca seria visto. Por isso o estado inicial é "visível" e o JS apenas o
 * remove.
 *
 * A saída acontece no `load` + MIN_MS — a cena 3D do hero NÃO segura mais a
 * cortina (o poster em spline-scene.tsx cobre o carregamento dela; a flag
 * WAIT_FOR_SCENE lá reverte isso). O registry lib/page-ready.ts continua
 * consultado como ponto de extensão.
 *
 * O visual é uma linha do tempo com beats, não um spinner:
 *   1. ENTRADA (CSS puro, ~0–0,9s): malha assenta, vinheta fecha, símbolo e
 *      texto sobem em cascata — roda até sem hidratação.
 *   2. DESENHO (~0,35–1,85s): o traço percorre o símbolo (pathLength=1
 *      normaliza o comprimento mesmo com os furos) com um ponto de luz na
 *      ponta (offset-path com o mesmo path, dentro do SVG).
 *   3. ACENDE (~1,85–2,35s): flash bloom + anel de choque + pulso forte do
 *      halo; o preenchimento vermelho acende e o contorno esfria para brasa.
 *   4. RESPIRO (até MIN_MS): halo respirando, facho percorrendo o contorno.
 *   5. SAÍDA em duas fases: o conteúdo recua (scale + blur + fade) e SÓ ENTÃO
 *      as cortinas abrem em expo-in-out, com a malha deslizando mais devagar
 *      que a metade (parallax) e a costura vermelha acendendo e apagando.
 * O progresso mostrado é real: marcos de documento, fontes e recursos.
 */
export function SitePreloader() {
  const { locale } = useI18n()
  const copy = COPY[locale]

  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading")
  const [steps, setSteps] = useState<Record<StepKey, boolean>>({
    dom: false,
    fonts: false,
    assets: false,
  })
  /** Traço do símbolo completou → acendimento (flash, anel, preenchimento). */
  const [drawn, setDrawn] = useState(false)
  /** Pulso forte do halo terminou → respiração em loop. */
  const [settled, setSettled] = useState(false)
  /** Definido via matchMedia em efeito para não divergir do HTML do servidor. */
  const [reduce, setReduce] = useState(false)

  const exiting = phase === "exiting"

  useEffect(() => {
    const start = performance.now()
    let exitTimer: number | undefined
    let settleTimer: number | undefined

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduce(true)
      setDrawn(true)
      setSettled(true)
    }

    const mark = (key: StepKey) =>
      setSteps((s) => (s[key] ? s : { ...s, [key]: true }))

    if (document.readyState !== "loading") mark("dom")
    else document.addEventListener("DOMContentLoaded", () => mark("dom"), { once: true })

    document.fonts.ready.then(() => mark("fonts"))

    if (document.readyState === "complete") mark("assets")
    else window.addEventListener("load", () => mark("assets"), { once: true })

    const beginExit = () => setPhase((p) => (p === "loading" ? "exiting" : p))

    // Debounce: um release seguido de re-registro não pode abrir a cortina
    // por engano caso algum bloqueio volte a ser registrado no futuro.
    const maybeFinish = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        if (!isPageReady()) return
        const wait = Math.max(0, MIN_MS - (performance.now() - start))
        window.clearTimeout(exitTimer)
        exitTimer = window.setTimeout(beginExit, wait)
      }, SETTLE_MS)
    }

    const unsubscribe = subscribePageReady(maybeFinish)
    maybeFinish()

    const failsafe = window.setTimeout(beginExit, MAX_MS)

    return () => {
      unsubscribe()
      window.clearTimeout(settleTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(failsafe)
    }
  }, [])

  // Rede de segurança da saída: se onAnimationComplete não disparar, desmonta.
  useEffect(() => {
    if (phase !== "exiting") return
    const timer = window.setTimeout(() => setPhase("done"), 1600)
    return () => window.clearTimeout(timer)
  }, [phase])

  // Cortina saiu → libera quem adiou trabalho pesado (ex.: runtime Spline).
  useEffect(() => {
    if (phase === "done") window.dispatchEvent(new Event(PRELOADER_DONE_EVENT))
  }, [phase])

  if (phase === "done") return null

  const currentStep = STEP_ORDER.find((key) => !steps[key])
  const stepText = currentStep ? `${copy.loading} · ${copy.steps[currentStep]}` : copy.done

  const mesh =
    "pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:38px_38px]"
  // Cortina abre em expo-in-out, SÓ DEPOIS do conteúdo sair de cena (fase 1).
  const halfTransition = {
    duration: EXIT_CURTAIN_S,
    ease: [0.87, 0, 0.13, 1] as const,
    delay: exiting ? EXIT_CONTENT_S : 0,
  }
  const seam = (side: "left" | "right") => (
    <motion.span
      aria-hidden="true"
      className={`absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-[#F90108] to-transparent shadow-[0_0_14px_rgba(249,1,8,0.8)] ${side === "left" ? "right-0" : "left-0"}`}
      initial={false}
      // Acende junto com o início da abertura e apaga antes do fim dela.
      animate={{ opacity: exiting && !reduce ? [0, 1, 0] : 0 }}
      transition={
        exiting && !reduce
          ? {
              duration: EXIT_CURTAIN_S,
              delay: EXIT_CONTENT_S,
              times: [0, 0.3, 1],
              ease: "easeInOut",
            }
          : { duration: 0.2 }
      }
    />
  )
  // Parallax da saída: a malha desliza mais devagar que a metade (contra-x
  // relativo), criando profundidade. As metades têm overflow-hidden, então o
  // deslocamento fica contido dentro da própria cortina.
  const meshParallax = (dir: 1 | -1) => ({
    initial: false as const,
    animate: { x: exiting && !reduce ? `${dir * 14}%` : "0%" },
    transition: halfTransition,
  })

  return (
    <>
      {/* Failsafe + entrada sem JS: precisam viajar no mesmo HTML da cortina. */}
      <style dangerouslySetInnerHTML={{ __html: FAILSAFE_CSS }} />

      {/* Sem JS a cortina nunca seria removida — então ela simplesmente não existe. */}
      <noscript>
        <style>{`[data-site-preloader]{display:none !important}`}</style>
      </noscript>

      <motion.div
        data-site-preloader
        role="status"
        aria-live="polite"
        aria-label={copy.loading}
        className={`fixed inset-0 z-[100] overflow-hidden ${exiting ? "pointer-events-none" : ""}`}
        initial={false}
        // Com prefers-reduced-motion a saída é um fade curto do overlay inteiro.
        animate={{ opacity: exiting && reduce ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (exiting && reduce) setPhase("done")
        }}
      >
        {/* ————— Cortina: duas metades que deslizam para fora na saída ————— */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-[#050505]"
          initial={false}
          animate={{ x: exiting && !reduce ? "-101%" : "0%" }}
          transition={halfTransition}
          onAnimationComplete={() => {
            if (exiting && !reduce) setPhase("done")
          }}
        >
          {/* Wrapper Motion (parallax) > div pura (entrada CSS) > malha. */}
          <motion.div className="absolute inset-0" {...meshParallax(1)}>
            <div data-spx-settle className="absolute inset-0">
              {/* Metade esquerda da malha, com a metade esquerda da máscara elíptica. */}
              <div
                aria-hidden="true"
                className={`${mesh} [mask-image:radial-gradient(ellipse_120%_50%_at_100%_50%,#000_10%,transparent_75%)]`}
              />
            </div>
          </motion.div>
          {seam("left")}
        </motion.div>

        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-[#050505]"
          initial={false}
          animate={{ x: exiting && !reduce ? "101%" : "0%" }}
          transition={halfTransition}
        >
          <motion.div className="absolute inset-0" {...meshParallax(-1)}>
            <div data-spx-settle className="absolute inset-0">
              {/* background-position compensa a origem da metade direita para a malha continuar sem emenda. */}
              <div
                aria-hidden="true"
                className={`${mesh} [background-position:-50vw_0px] [mask-image:radial-gradient(ellipse_120%_50%_at_0%_50%,#000_10%,transparent_75%)]`}
              />
            </div>
          </motion.div>
          {seam("right")}
        </motion.div>

        {/* ————— Conteúdo central: símbolo desenhado + marcos reais —————
            Saída fase 1: recua com peso (scale + blur + fade) ANTES da cortina. */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting && !reduce ? 0.9 : 1,
            filter: exiting && !reduce ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: EXIT_CONTENT_S, ease: [0.7, 0, 0.84, 0] }}
        >
          <div className="flex flex-col items-center gap-9">
            {/* Entrada CSS na div pura; o Motion anima só os filhos. */}
            <div data-spx-rise className="relative h-36 w-36 sm:h-44 sm:w-44">
              {/* Halo: pulso forte no acendimento, depois respiração em loop. */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-1/4 rounded-full bg-[#F90108]/15 blur-3xl"
                initial={false}
                animate={
                  drawn && !reduce
                    ? settled
                      ? { opacity: [0.5, 0.8, 0.5], scale: [1, 1.06, 1] }
                      : { opacity: [0.3, 0.95, 0.55], scale: [0.92, 1.14, 1] }
                    : { opacity: drawn ? 0.5 : 0.3, scale: 1 }
                }
                transition={
                  drawn && !reduce
                    ? settled
                      ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 1, times: [0, 0.35, 1], ease: "easeOut" }
                    : { duration: 0.6 }
                }
                onAnimationComplete={() => {
                  if (drawn && !settled) setSettled(true)
                }}
              />

              {/* Flash bloom: acende no instante exato do fechamento do traço. */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,238,238,0.85) 0%, rgba(249,1,8,0.4) 32%, transparent 68%)",
                }}
                initial={{ opacity: 0 }}
                animate={
                  drawn && !reduce
                    ? { opacity: [0, 0.9, 0], scale: [0.7, 1.1, 1.3] }
                    : { opacity: 0 }
                }
                transition={{ duration: 0.5, times: [0, 0.3, 1], ease: "easeOut" }}
              />

              {/* Anel de choque: uma onda única expandindo no acendimento. */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-[#F90108]/60"
                initial={{ opacity: 0, scale: 0.55 }}
                animate={
                  drawn && !reduce
                    ? { opacity: [0.7, 0], scale: [0.55, 1.5] }
                    : { opacity: 0, scale: 0.55 }
                }
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              <svg
                viewBox={BRAND_VIEWBOX.symbol}
                className="relative h-full w-full"
                aria-hidden="true"
              >
                {/* Contorno fantasma: estático, já visível no HTML do servidor.
                    Garante presença da marca antes da hidratação e serve de
                    trilho para o traço luminoso desenhar por cima. */}
                <path
                  d={SYMBOL_STANDALONE}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />

                {/* Preenchimento: acende quando o traço completa. */}
                <motion.path
                  d={SYMBOL_STANDALONE}
                  fill="#F90108"
                  fillRule="evenodd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: drawn ? 1 : 0 }}
                  transition={{ duration: reduce ? 0.3 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Traço luminoso que desenha o símbolo. pathLength=1 normaliza o
                    comprimento total, então o dash funciona mesmo com os furos.
                    Ao completar, esfria para brasa (opacity 0.45). */}
                <motion.path
                  d={SYMBOL_STANDALONE}
                  pathLength={1}
                  fill="none"
                  stroke="#F90108"
                  strokeWidth={1.5}
                  strokeDasharray="1"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: "drop-shadow(0 0 6px rgba(249,1,8,0.65))" }}
                  initial={{ strokeDashoffset: 1, opacity: 1 }}
                  animate={{
                    strokeDashoffset: 0,
                    opacity: drawn ? (reduce ? 0 : 0.45) : 1,
                  }}
                  transition={{
                    strokeDashoffset: {
                      delay: reduce ? 0 : 0.35,
                      duration: reduce ? 0 : 1.5,
                      ease: [0.65, 0, 0.35, 1],
                    },
                    opacity: { duration: 0.8 },
                  }}
                  onAnimationComplete={() => setDrawn(true)}
                />

                {/* Ponto de luz na PONTA do traço: segue o MESMO path via
                    offset-path (coordenadas do viewBox), com transição idêntica
                    à do dash — a ponta acompanha a borda do desenho. Em
                    browsers sem offset-path o círculo fica em (0,0), fora do
                    viewBox (min 259,215) — clipado, invisível: degradação limpa. */}
                {!reduce && (
                  <motion.g
                    style={{
                      offsetPath: `path("${SYMBOL_STANDALONE}")`,
                      offsetRotate: "0deg",
                    }}
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{
                      offsetDistance: "100%",
                      opacity: drawn ? 0 : 1,
                    }}
                    transition={{
                      offsetDistance: {
                        delay: 0.35,
                        duration: 1.5,
                        ease: [0.65, 0, 0.35, 1],
                      },
                      opacity: { delay: drawn ? 0 : 0.35, duration: drawn ? 0.3 : 0.2 },
                    }}
                  >
                    <circle r={30} fill="rgba(249,1,8,0.3)" />
                    <circle r={11} fill="#FFE9EA" />
                  </motion.g>
                )}

                {/* Facho que percorre o contorno no fim da espera. Offset -1
                    fecha o ciclo sem emenda visível. */}
                <motion.path
                  d={SYMBOL_STANDALONE}
                  pathLength={1}
                  fill="none"
                  stroke="#FF6A6E"
                  strokeWidth={1.6}
                  strokeDasharray="0.08 0.92"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: "drop-shadow(0 0 7px rgba(249,1,8,0.9))" }}
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{
                    strokeDashoffset: -1,
                    opacity: drawn && !reduce && !exiting ? 0.85 : 0,
                  }}
                  transition={{
                    strokeDashoffset: { duration: 3.2, ease: "linear", repeat: Infinity },
                    opacity: { duration: 0.8 },
                  }}
                />
              </svg>
            </div>

            <div data-spx-rise-late className="flex flex-col items-center gap-4">
              {/* Span estático de propósito: com initial animado ele viajaria
                  invisível no HTML do servidor até a hidratação (lenta em rede
                  ruim). A entrada é do wrapper acima, em CSS puro. */}
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.42em] text-white/45">
                {stepText}
              </span>

              {/* Marcos reais: documento, fontes, recursos. */}
              <div className="flex items-center gap-1.5">
                {STEP_ORDER.map((key) => (
                  <motion.span
                    key={key}
                    aria-hidden="true"
                    className="h-px w-7"
                    initial={false}
                    animate={{
                      backgroundColor: steps[key] ? "rgba(249,1,8,0.9)" : "rgba(255,255,255,0.14)",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ————— Atmosfera: vinheta + grão por cima de tudo —————
            Dão textura de filme ao conjunto; saem junto com o conteúdo na
            fase 1, antes das cortinas abrirem. Divs puras por dentro (entrada
            CSS), wrapper Motion por fora (saída). */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          initial={false}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: EXIT_CONTENT_S, ease: "easeOut" }}
        >
          {/* Vinheta fechando de fora para dentro na entrada. */}
          <div
            data-spx-close
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          {/* Grão estático — 4% de opacidade, só textura, custo zero. O keyframe
              de entrada TERMINA em 0.04 (igual à classe): animação CSS com
              fill:both vence a cascata, então o valor final precisa coincidir. */}
          <div
            data-spx-grain
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("${GRAIN_URI}")` }}
          />
        </motion.div>
      </motion.div>
    </>
  )
}
