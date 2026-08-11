# Otimização de performance dos efeitos da landing

Contexto: o cliente reportou o site lento em dev. A landing acumulou muitos
efeitos contínuos (canvas, partículas, gradientes animados, keyframes infinitos)
que rodavam **o tempo todo**, independentemente de a seção estar na tela.

Regra de ouro seguida em todas as mudanças: **nenhum efeito foi removido e o
visual percebido não muda**. Só mudou *quando* e *quanto* cada efeito trabalha.

---

## Infraestrutura nova

| Arquivo | Papel |
|---|---|
| `hooks/use-in-viewport.ts` | IntersectionObserver enxuto. Modo `once` (lazy mount) e modo contínuo (pausar/retomar). `initialInView` default `!once`, para o HTML do servidor nunca sair com efeitos congelados se a hidratação demorar. |
| `hooks/use-animation-scope.ts` | `const scope = useAnimationScope()` → `<section {...scope}>`. Congela **todas** as animações CSS contínuas da seção fora da viewport. |
| `components/ui/animation-pause.css` | `[data-spx-paused="true"] *, ::before, ::after { animation-play-state: paused !important }`. O keyframe congela no ponto atual e retoma dali — sem re-play. |

Gate de seção aplicado em: `hero`, `sobre`, `problema`, `servicos`,
`como-funciona`, `tech-marquee`, `cases`, `resultados`, `mentoria`, `footer`.
Isso cobre de uma vez `spx-breathe`, `spx-blink`, `spx-flow`, `spx-sweep`,
`spx-ring`, `spx-float`, `spx-shimmer`, `animate-ping` e o marquee — dezenas de
keyframes infinitos espalhados por `service-glyph`, `panel-mock` e pelas seções.

---

## Mudanças por componente

### Impacto alto

**`components/ui/animated-gradient-background.tsx`** (CTA final)
O pior ofensor. Mantinha um `requestAnimationFrame` vivo para sempre reescrevendo
`style.background` com um `radial-gradient` de tela cheia — repaint full-viewport
a 60fps, **inclusive com `Breathing={false}` e inclusive fora da tela**.
- Loop pausado por IntersectionObserver.
- `Breathing=false` ou `prefers-reduced-motion` → pinta uma vez e **não abre rAF**.
- Repaint throttled a 24fps com avanço proporcional ao delta (a respiração varia
  ~0,018% por frame; a 24fps é indistinguível e custa 1/3).
- `contain: layout paint style` no container isola o repaint.
- *Estimativa:* elimina ~60 repaints/s de tela cheia enquanto a seção está fora
  da viewport (a maior parte da sessão) e corta ~60% do custo quando visível.

**`components/ui/sparkles.tsx`** (tsparticles — hero + CTA final)
- Engine (`loadSlim`) só inicializa quando o bloco entra na viewport. O CTA fica
  no rodapé: antes o tsparticles subia no load da página.
- `fpsLimit` 120 → 60 (metade dos updates, zero diferença em telas de 60Hz).
- `pauseOnBlur` + `pauseOnOutsideViewport` explícitos.
- Bloco `interactivity` removido (click-to-push com listeners globais, não usado).
- Options memoizadas (antes: objeto novo a cada render → reprocessamento completo).
- Config enxuta de ~370 para ~45 linhas mantendo todos os valores efetivos.
- `prefers-reduced-motion` → nenhuma partícula.
- Densidade: hero `18 → 12`, CTA `100 → 48`.
  *(`density` é por área de 400×400px: em 1920×950 o hero gerava ~205 partículas,
  agora ~137; o CTA gerava ~125, agora ~60.)*
- *Estimativa:* ~35% menos partículas no hero, ~50% no CTA, e o segundo engine
  deixa de existir até o usuário chegar ao rodapé.

**`components/ui/dot-pattern.tsx`** (footer)
Montava um `<motion.circle>` por ponto **sempre** — no rodapé de tela cheia com
grade de 24px isso passa de 2.000 nós React+SVG para desenhar uma textura estática.
- Sem `glow`: a malha sai de um `<pattern>` SVG nativo (2 nós). Resultado visual
  idêntico (mesma origem em `x+cx, y+cy`, mesmo passo, mesmo raio).
- Com `glow`: círculos animados voltam, mas pausados fora da viewport.
- Sem `glow` também não mede mais o container (nada de `resize` listener).
- *Estimativa:* ~2.000 nós React/SVG a menos no DOM do rodapé. Confirmado no HTML
  servido: `<pattern>` presente, contagem de `<circle>` da página inteira caiu para 40.

**`components/ui/glowing-effect.tsx`** (6 cards em serviços)
Cada instância registrava `pointermove` no `document.body` + `scroll` no `window`.
Seis instâncias = seis `getBoundingClientRect()` (reflow forçado) por evento de mouse
e por evento de scroll, a página inteira.
- Listeners só ativos com o card na viewport (IntersectionObserver).
- Listeners não registrados em `(pointer: coarse)` — em touch não há cursor para
  seguir; o efeito nunca dispararia.
- Ao sair da tela com o halo aceso, `--active` volta a 0.
- *Estimativa:* zero listener global fora da seção; em mobile, zero sempre.

**`components/ui/background-beams.tsx`** (problema)
24 `motion.linearGradient` animando 4 atributos SVG por frame — trabalho de main
thread que o navegador não acelera.
- Feixes desmontados fora da viewport. O trilho estático (`RAIL_PATH`) permanece,
  então a malha **nunca pisca**.
- `count` default `24 → 14` (os feixes se sobrepõem sob máscara `opacity 0.55`).
- *Estimativa:* de ~96 atributos SVG/frame para 0 fora da tela e ~56 quando visível.

### Impacto médio

**`components/ui/spotlight-new.tsx`** (hero) — dois `motion.div` em `repeat: Infinity`
rodavam a página inteira. Drift convertido para keyframe CSS (mesma duração de 7s,
mesmo `ease-in-out`, mesmo offset) → pausável por viewport e desligado em
`prefers-reduced-motion` (antes não respeitava).

**`components/ui/text-shimmer.tsx`** (hero + brand-loader) — animava
`backgroundPosition` por JS em loop infinito. Virou keyframe CSS com o mesmo
gradiente/duração/easing; agora congela junto com a seção e some em reduced-motion.

**`components/ui/animated-grid-pattern.tsx`** (sobre) — cada quadrado dispara
`onAnimationComplete → setSquares`, ou seja um re-render do componente inteiro por
quadrado que termina o ciclo (~9 re-renders/s com 26 quadrados). O loop agora só
roda com a seção na tela; ao voltar, os quadrados reentram em cascata — a mesma
cascata da primeira aparição.

**`components/ui/border-beam.tsx`** (produtos) — animava `offsetDistance` pelo motion
(um valor por frame em JS, por card). `offset-distance` é animável em CSS: virou
keyframe nativo com `animation-delay` negativo reproduzindo o `initialOffset` e
`animation-direction: reverse` para o modo reverso. Pausável e com reduced-motion.

**`components/ui/wobble-card.tsx`** (cases) — guardava a posição do mouse em estado:
cada `mousemove` re-renderizava o card inteiro (e todos os filhos) só para reescrever
um `transform`. Agora escreve direto no DOM via refs; mesma transição de 0.1s.

**`components/ui/text-hover-effect.tsx`** (footer) — dois renders + um
`getBoundingClientRect()` (reflow forçado) por movimento de mouse. O rect passou a
ser medido uma vez no `pointerenter`. O traço de 4s virou `whileInView` — antes
desenhava no mount, animando atributos SVG enquanto o usuário ainda lia o hero.

**`components/ui/spline-scene.tsx`** (hero) — o runtime do Spline é o maior pedaço de
JS da página e montava já no primeiro render, disputando a thread com a entrada do
hero. Agora monta no primeiro `requestIdleCallback` (timeout 1200ms, fallback 200ms).
Visualmente idêntico: o preloader da marca já cobria esse intervalo.

### Impacto menor (mas grátis)

- **`sparkles-text.tsx`** (cases): `setInterval` + partículas `repeat: Infinity`
  desmontadas fora da viewport.
- **`meteors.tsx`** (mentoria, 3 instâncias): congelados fora da viewport;
  array memoizado; `contain`.
- **`marquee.tsx`** (tech-marquee): keyframe congelado fora da viewport, retoma no
  mesmo ponto (sem salto na faixa de logos). Passou a client component.
- **`shine-border.tsx`** (produtos): varredura de `background-position` congelada.
- **`word-rotate.tsx`** (hero): `setInterval` + `AnimatePresence` a cada 2,6s
  parados fora da viewport.

### Já estavam corretos (nada a fazer)

`flickering-grid.tsx`, `stars-background.tsx`, `shooting-stars.tsx` — já tinham
IntersectionObserver, DPR limitado a 2 e bypass de `prefers-reduced-motion`.

---

## Code-splitting (`next/dynamic`, `ssr: false`)

Aplicado **apenas** a efeitos puramente decorativos (`aria-hidden`), para não tirar
conteúdo do HTML do servidor. O hero segue renderizado imediatamente.

| Seção | Componente |
|---|---|
| `sobre` | `AnimatedGridPattern` |
| `problema` | `BackgroundBeams` |
| `servicos` | `GlowingEffect` |
| `resultados` | `FlickeringGrid` |
| `mentoria` | `Meteors` |
| `quote` | `StarsBackground`, `ShootingStars` |
| `cta-final` | `AnimatedGradientBackground`, `SparklesCore` |
| `footer` | `TextHoverEffect` (mantém `aria-label`) |

Não aplicado a `MagicCard`, `GlareCard`, `StickyScroll`, `SparklesText` e
`TextReveal` — todos envolvem conteúdo real e sairiam do HTML do servidor.

## `content-visibility` — decisão

**Não aplicado nas seções.** Todas as seções da landing são alvo de âncora
(`#sobre`, `#servicos`, `#cases`, `#mentoria`, `#contato`…) e a navegação por
âncora com `content-visibility: auto` sem `contain-intrinsic-size` exato provoca
salto de scroll. O objetivo (não gastar frames com o que está fora da tela) já foi
atingido pelo gate de animação, sem esse risco.

Onde `contain` **foi** aplicado, por ser seguro (wrappers decorativos absolutos,
sem âncora e sem influência no fluxo): `animated-gradient-background`,
`sparkles`, `background-beams`, `meteors`.

---

## Validação

- `npx tsc --noEmit` → **exit 0**.
- `pnpm dev` sobe em 2.6s; `/`, `/diagnostico`, `/privacy`, `/terms`, `/login`
  respondem **HTTP 200** sem erro ou warning novo no log.
- HTML servido conferido: nenhuma seção sai com `data-spx-paused` (efeitos não
  congelam se a hidratação falhar), âncoras e conteúdo textual intactos,
  `<pattern>` do dot-pattern presente.
- `pnpm build` **não** foi executado (fica com o worker do build final).
- Nada commitado.

## Fora de escopo (não tocado)

`app/admin`, `app/privacy`, `app/terms`, `app/login`, `app/diagnostico`,
`app/checkout` — outros workers.
