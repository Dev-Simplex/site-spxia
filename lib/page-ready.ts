// Registro global de bloqueios de prontidão da página.
//
// A cortina de entrada (SitePreloader) só sai quando a página está pronta:
// o evento `load` do window JÁ disparou E nenhum bloqueio está pendente.
//
// HOJE NENHUM COMPONENTE REGISTRA BLOQUEIO. A cena Spline do hero já segurou
// a cortina por aqui e isso foi removido de propósito: com cena lenta o site
// ficava trancado por 10s+ — agora o poster em components/ui/spline-scene.tsx
// cobre o carregamento dela e a cortina sai no `load`. NÃO re-registre a cena.
//
// O registry fica como ponto de extensão: se algum componente acima da dobra
// realmente precisar segurar a cortina no futuro, registre um bloqueio
// enquanto carrega e libere em TODOS os caminhos de saída (sucesso, erro,
// timeout, desmontagem) — e pese o custo: cada bloqueio atrasa o site inteiro.
//
// IMPORTANTE: quem registra precisa fazê-lo DURANTE O RENDER (ex.:
// `useState(() => blockPageReady(id))`), nunca em um useEffect. O SitePreloader
// vive no layout, antes do conteúdo da página, então os efeitos dele rodam
// antes dos efeitos das seções — um bloqueio registrado em efeito tardio
// perderia a corrida e a cortina abriria com o conteúdo ainda vazio. Renders
// acontecem todos antes de qualquer efeito, então o registro no render é
// garantido.

type Listener = () => void

const blocks = new Set<string>()
const listeners = new Set<Listener>()

let windowLoaded =
  typeof document !== "undefined" && document.readyState === "complete"

if (typeof window !== "undefined" && !windowLoaded) {
  window.addEventListener(
    "load",
    () => {
      windowLoaded = true
      notify()
    },
    { once: true },
  )
}

function notify() {
  for (const listener of listeners) listener()
}

/** `true` quando o `load` já disparou e nenhum bloqueio está pendente. */
export function isPageReady(): boolean {
  return windowLoaded && blocks.size === 0
}

/** Quantos bloqueios ainda seguram a cortina (0 em páginas sem cena 3D). */
export function pendingBlocks(): number {
  return blocks.size
}

/** Registra um bloqueio. Idempotente por id; no servidor é no-op. */
export function blockPageReady(id: string): void {
  if (typeof window === "undefined") return
  if (!blocks.has(id)) {
    blocks.add(id)
    notify()
  }
}

/** Libera um bloqueio. Idempotente — liberar duas vezes é inofensivo. */
export function releasePageReady(id: string): void {
  if (blocks.delete(id)) notify()
}

/** Observa mudanças de prontidão (load, block, release). Retorna o unsubscribe. */
export function subscribePageReady(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
