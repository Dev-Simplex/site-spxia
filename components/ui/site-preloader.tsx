import { Logo } from "@/components/logo"

/*
 * Revelação de entrada: o símbolo azul aparece sobre branco e a tela abre em
 * 0,9 s. É CSS puro e vem pronto no HTML do servidor, então roda antes da
 * hidratação e não espera rede nem JS. Some depois por conta própria
 * (visibility:hidden no fim da animação) e nunca bloqueia cliques.
 *
 * Aparece só na primeira visita da sessão: o script inline, que roda antes da
 * camada ser pintada, injeta um <style> que a esconde quando o sessionStorage
 * já marcou a visita. Com prefers-reduced-motion ela não aparece.
 */
const INTRO_CSS = `
@keyframes spx-intro-out{0%,60%{opacity:1}100%{opacity:0;visibility:hidden}}
@keyframes spx-intro-mark{0%{opacity:0;transform:scale(.9);clip-path:inset(0 100% 0 0)}45%{opacity:1;transform:scale(1);clip-path:inset(0 0 0 0)}100%{opacity:1;transform:scale(1.04);clip-path:inset(0 0 0 0)}}
[data-site-preloader]{animation:spx-intro-out .9s ease-out forwards}
[data-site-preloader] svg{animation:spx-intro-mark .9s cubic-bezier(.22,1,.36,1) both}
@media (prefers-reduced-motion:reduce){[data-site-preloader]{display:none}}
`

const SEEN_SCRIPT = `try{if(sessionStorage.getItem("spx-intro")){var s=document.createElement("style");s.textContent="[data-site-preloader]{display:none}";document.head.appendChild(s)}else sessionStorage.setItem("spx-intro","1")}catch(e){}`

export function SitePreloader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTRO_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }} />
      <div
        data-site-preloader
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-background"
      >
        <Logo variant="symbol" height={72} />
      </div>
    </>
  )
}
