# Pesquisa de Registries — Reestruturação do Site SPX IA

**Data dos testes:** 2026-08-07 (todas as URLs abaixo foram executadas e validadas nesta data)
**Contexto:** reconstrução do site SPX IA sobre o template Next.js 14 + Tailwind 4 + shadcn em
`correcao-de-dependencia (1)/`. Hero, CTA final e header serão **mantidos**; todas as demais seções serão
**substituídas** por componentes novos e animados.
**Marca:** tema dark — preto `#1A1A1A`, vermelho `#ED3237`, branco `#FEFEFE`. Fontes: DM Serif Display
(títulos), Inter (texto), JetBrains Mono (código/números).

---

## 1. Método de validação

Seguindo o protocolo do `COMPONENTES-API.md` (status 200 não prova nada), cada URL passou por três testes:

1. `curl -sL -o corpo.json -w '%{http_code}'` — status HTTP;
2. parse do corpo com `JSON.parse` — **corpo precisa ser JSON real, não HTML** (a armadilha do originui);
3. conferência de tamanho — JSON de componente tem 1–40 KB; centenas de KB é página de erro.

Toda URL listada como "OK" abaixo passou nos três testes. As dependências npm foram extraídas do campo
`dependencies` do próprio JSON do registry.

## 2. Índices dos registries (testados)

| Registry | URL do índice | HTTP | Tamanho | Itens |
|---|---|---|---|---|
| shadcn/ui | `https://ui.shadcn.com/r/index.json` | 200 | 58.072 B | 63 (só primitivos de UI) |
| Magic UI | `https://magicui.design/registry.json` | 200 | 108.443 B | 247 |
| Aceternity | `https://ui.aceternity.com/registry/index.json` | 200 | 95.977 B | 276 |
| cult-ui | `api.github.com/repos/nolly-studio/cult-ui/contents/apps/www/public/r` | 200 | 165.674 B | 159 |
| motion-primitives | `api.github.com/repos/ibelick/motion-primitives/contents/public/c` | 200 | 33.610 B | 34 |
| KokonutUI | `api.github.com/repos/kokonut-labs/kokonutui/contents/public/r` | 200 | 51.579 B | 53 |

**KokonutUI não expõe índice no site** — `kokonutui.com/r/index.json` e `/registry.json` dão 404 com corpo
HTML. O índice sai pela API do GitHub (repo `kokonut-labs/kokonutui`); os downloads individuais em
`kokonutui.com/r/<nome>.json` funcionam normalmente.

## 3. Descoberta crítica — blocos "Pro" do Aceternity dão HTTP 401

Todos os **blocos de seção completos** do Aceternity que aparecem no índice retornam
`401 — {"error":"You are not authorized..."}` (70 bytes). São pagos. Testados e bloqueados:

- Pricing: `simple-pricing-with-three-tiers`, `pricing-with-switch`, `pricing-minimal`, `pricing-with-header-and-icons`
- FAQ: `frequently-asked-questions-accordion`, `faqs-with-grid`, `simple-faqs-with-background`, `faqs-with-dashed-lines`
- Footer: `simple-footer-with-four-grids`, `footer-with-grid`, `footer-with-big-text`
- Stats: `stats-with-number-ticker`, `stats-with-gradient`, `stats-with-grid-background`
- Logos: `logo-cloud-marquee`, `spotlight-logo-cloud`, `logos-with-blur-flip`
- Testimonials/Team/Features em bloco: `testimonials-marquee-grid`, `testimonials-grid-with-centered-carousel`, `team-section-with-small-avatars`, `features-with-hover-and-text-animation`, `three-column-bento-grid`

Os **componentes individuais** gratuitos do Aceternity (timeline, compare, animated-testimonials, lamp,
etc.) baixam normalmente. Consequência prática: **Pricing, FAQ, Footer, Métricas e Logos serão compostos**
a partir de componentes menores + estrutura própria, não de blocos prontos.

## 4. Nota de adaptação — `motion` vs `framer-motion`

Quase todos os componentes abaixo declaram dependência do pacote **`motion`** (motion.dev, o sucessor do
framer-motion) e importam de `motion/react`. O template já tem **`framer-motion`**. A API é a mesma; na
adaptação basta **trocar o import `motion/react` → `framer-motion`** (ou padronizar o projeto no pacote
`motion`, decisão para a fase de implementação). Por isso, "deps npm extras" abaixo **desconsidera
`motion`** como custo novo — ele já está coberto pelo framer-motion do template.

Dependências realmente novas que aparecem: `@tabler/icons-react`, `lucide-react` (já é padrão em projetos
shadcn), `react-use-measure`, `next-themes`, `@radix-ui/react-accordion`, `three` + `@react-three/fiber`
(apenas no card-spotlight — evitar).

---

## 5. Candidatos por seção

Legenda: tamanho = bytes do JSON do registry (código TSX embutido). Todas as URLs testadas em 2026-08-07
com corpo JSON validado.

### 5.1 Problema / Solução

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Aceternity | `sticky-scroll-reveal` | `https://ui.aceternity.com/registry/sticky-scroll-reveal.json` | 200 / 3.990 B | — |
| 2 | Aceternity | `compare` | `https://ui.aceternity.com/registry/compare.json` | 200 / 8.043 B | `@tabler/icons-react` |
| 3 | Aceternity | `wobble-card` | `https://ui.aceternity.com/registry/wobble-card.json` | 200 / 3.015 B | — |
| 4 | Magic UI | `text-reveal` | `https://magicui.design/r/text-reveal.json` | 200 / 2.439 B | — |
| 5 | Aceternity | `flip-words` | `https://ui.aceternity.com/registry/flip-words.json` | 200 / 3.233 B | — |

- **sticky-scroll-reveal** — narrativa "dor → solução" com painel fixo que troca de conteúdo conforme o
  scroll; fundo escuro nativo e cor de destaque configurável para o vermelho `#ED3237`.
- **compare** — slider "antes/depois" arrastável, perfeito para contrastar "operação sem IA vs com SPX IA"
  de forma tátil sobre fundo preto.
- **wobble-card** — cards que reagem ao mouse com translação 3D suave; ótimos para pares
  problema/solução com borda vermelha de destaque.
- **text-reveal** (Magic UI) — o parágrafo da "dor" revelado palavra a palavra conforme o scroll, dramático
  em branco `#FEFEFE` sobre `#1A1A1A`.
- **flip-words** — troca animada de palavras dentro do título ("perde tempo / perde lead / perde venda"),
  framer-motion puro e altíssimo contraste com DM Serif Display.

### 5.2 Serviços / Features (substituto do BentoGrid)

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Magic UI | `magic-card` | `https://magicui.design/r/magic-card.json` | 200 / 7.066 B | `next-themes` |
| 2 | Aceternity | `glowing-effect` | `https://ui.aceternity.com/registry/glowing-effect.json` | 200 / 7.196 B | `lucide-react` |
| 3 | Aceternity | `card-hover-effect` | `https://ui.aceternity.com/registry/card-hover-effect.json` | 200 / 3.087 B | — |
| 4 | KokonutUI | `bento-grid` | `https://kokonutui.com/r/bento-grid.json` | 200 / 40.166 B | `lucide-react` |
| 5 | cult-ui | `texture-card` | `https://raw.githubusercontent.com/nolly-studio/cult-ui/main/apps/www/public/r/texture-card.json` | 200 / 4.902 B | — |

- **magic-card** — spotlight de gradiente que segue o mouse; o gradiente é prop, então o brilho pode ser
  exatamente `#ED3237` sobre o card preto.
- **glowing-effect** — borda luminosa que persegue o ponteiro ao redor do card; visual premium dark que
  vira assinatura da seção de serviços.
- **card-hover-effect** — grid de serviços onde um highlight animado desliza para o card sob o mouse;
  leve, só framer-motion, e o highlight aceita o vermelho da marca.
- **bento-grid** (KokonutUI) — bento pronto com células de tamanhos variados e micro-animações; maior
  (traz demo completa) mas resolve a seção inteira de uma vez.
- **texture-card** — cartão com bisel e textura sutil, sem nenhuma dependência; contraponto sóbrio para
  serviços "sérios" em dark, combinando com JetBrains Mono nos rótulos.
- *Alerta:* `card-spotlight` (Aceternity) foi testado (200 / 11.506 B) mas depende de
  `canvas-reveal-effect` → `three` + `@react-three/fiber`. Pesado demais — **evitar**.

### 5.3 Depoimentos / Prova social

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Aceternity | `animated-testimonials` | `https://ui.aceternity.com/registry/animated-testimonials.json` | 200 / 5.962 B | `@tabler/icons-react` |
| 2 | Aceternity | `infinite-moving-cards` | `https://ui.aceternity.com/registry/infinite-moving-cards.json` | 200 / 4.199 B | — (CSS puro) |
| 3 | Magic UI | `marquee` | `https://magicui.design/r/marquee.json` | 200 / 2.694 B | — (CSS puro) |
| 4 | Aceternity | `card-stack` | `https://ui.aceternity.com/registry/card-stack.json` | 200 / 2.566 B | — |
| 5 | KokonutUI | `card-stack` | `https://kokonutui.com/r/card-stack.json` | 200 / 8.280 B | — |

- **animated-testimonials** — foto + citação com transição de profundidade entre depoimentos; layout
  editorial que valoriza DM Serif Display nas aspas.
- **infinite-moving-cards** — fileira infinita de cards de depoimento com pausa no hover; anima por CSS
  (zero custo de JS) e o fade lateral funde com o preto `#1A1A1A`.
- **marquee** (Magic UI) — a base canônica para "wall of love" em duas fileiras contrárias; com
  `[mask-image]` o recorte some no fundo escuro.
- **card-stack** (Aceternity) — depoimentos empilhados que rotacionam sozinhos; compacto para usar ao lado
  de um número de métrica.
- **card-stack** (KokonutUI) — variação com drag/swipe manual, mais interativa, também só framer-motion.

### 5.4 Métricas / Resultados (números animados)

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Magic UI | `number-ticker` | `https://magicui.design/r/number-ticker.json` | 200 / 2.291 B | — |
| 2 | motion-primitives | `animated-number` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/animated-number.json` | 200 / 1.198 B | — |
| 3 | motion-primitives | `sliding-number` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/sliding-number.json` | 200 / 3.557 B | `react-use-measure` |
| 4 | cult-ui | `animated-number` | `https://raw.githubusercontent.com/nolly-studio/cult-ui/main/apps/www/public/r/animated-number.json` | 200 / 1.575 B | — |
| 5 | Magic UI | `animated-circular-progress-bar` | `https://magicui.design/r/animated-circular-progress-bar.json` | 200 / 4.188 B | — |

- **number-ticker** — contagem crescente disparada ao entrar no viewport; em JetBrains Mono e vermelho
  `#ED3237` vira o coração da seção de resultados.
- **animated-number** (motion-primitives) — o menor da categoria (1,2 KB), spring física do framer-motion,
  ideal quando os números reagem a interação.
- **sliding-number** — dígitos que deslizam como odômetro/placar; estética "máquina" que casa com a fonte
  mono da marca.
- **animated-number** (cult-ui) — alternativa com formatação embutida, mesmo espírito minimalista.
- **animated-circular-progress-bar** — percentuais em anel animado (ex.: "98% de satisfação"); o traço do
  anel aceita o vermelho da marca sobre trilha cinza-escuro.

### 5.5 Pricing

Não existe bloco de pricing **gratuito** em nenhum dos seis registries (os do Aceternity são Pro/401).
Estratégia: estrutura própria com `card` do shadcn + estes destaques animados:

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Magic UI | `shine-border` | `https://magicui.design/r/shine-border.json` | 200 / 2.428 B | — (CSS puro) |
| 2 | Magic UI | `border-beam` | `https://magicui.design/r/border-beam.json` | 200 / 2.997 B | — |
| 3 | Aceternity | `background-gradient` | `https://ui.aceternity.com/registry/background-gradient.json` | 200 / 2.931 B | — |
| 4 | Aceternity | `moving-border` | `https://ui.aceternity.com/registry/moving-border.json` | 200 / 3.613 B | — |
| 5 | motion-primitives | `tilt` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/tilt.json` | 200 / 2.342 B | — |

- **shine-border** — borda com brilho animado em CSS para o plano recomendado; a cor do brilho é prop —
  vermelho `#ED3237` direto.
- **border-beam** — feixe de luz percorrendo a borda do card premium; o efeito "escolha óbvia" em dark.
- **background-gradient** — halo de gradiente animado atrás do card destacado, empurrando o plano
  principal para frente do fundo preto.
- **moving-border** — botão "Assinar" com borda em órbita contínua; CTA de pricing com movimento sem
  poluição.
- **tilt** — inclinação 3D sutil dos cards ao passar o mouse; percepção de profundidade nos três planos.
- Base estrutural: `card` do shadcn (`https://ui.shadcn.com/r/styles/new-york/card.json`, 200 / 2.215 B).

### 5.6 Processo / Como funciona (3 passos)

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Aceternity | `timeline` | `https://ui.aceternity.com/registry/timeline.json` | 200 / 3.816 B | — |
| 2 | Aceternity | `tracing-beam` | `https://ui.aceternity.com/registry/tracing-beam.json` | 200 / 4.056 B | — |
| 3 | Magic UI | `animated-beam` | `https://magicui.design/r/animated-beam.json` | 200 / 5.705 B | — |
| 4 | Magic UI | `animated-list` | `https://magicui.design/r/animated-list.json` | 200 / 2.586 B | — |
| 5 | motion-primitives | `in-view` + `animated-group` | `.../public/c/in-view.json` e `.../animated-group.json` | 200 / 1.515 + 3.586 B | — |

- **timeline** — linha vertical cujo traço se preenche com gradiente conforme o scroll; o gradiente
  vira vermelho→transparente e cada etapa ganha título em DM Serif Display.
- **tracing-beam** — feixe que "desenha" o caminho ao lado do conteúdo durante o scroll; metáfora visual
  perfeita para "passo 1 → 2 → 3".
- **animated-beam** — feixes conectando nós de um diagrama (diagnóstico → implementação → resultado);
  o feixe em vermelho sobre preto é a cara da marca.
- **animated-list** — passos entrando em sequência automática; útil se o processo for mostrado como
  notificações/entregas.
- **in-view + animated-group** — orquestração de entrada em cascata dos cards de passo; primitivo,
  minúsculo e totalmente controlável.

### 5.7 FAQ

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | motion-primitives | `accordion` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/accordion.json` | 200 / 5.326 B | — |
| 2 | shadcn/ui | `accordion` | `https://ui.shadcn.com/r/styles/new-york/accordion.json` | 200 / 3.179 B | `@radix-ui/react-accordion` |
| 3 | motion-primitives | `disclosure` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/disclosure.json` | 200 / 4.786 B | — |
| 4 | motion-primitives | `transition-panel` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/transition-panel.json` | 200 / 1.400 B | — |

- **accordion** (motion-primitives) — acordeão animado com springs do framer-motion (altura + fade reais,
  não `max-height` truncado); o divisor fino em cinza-escuro fica elegante no dark.
- **accordion** (shadcn) — base Radix acessível por teclado/leitor de tela; anima via tailwind e é a opção
  mais robusta se acessibilidade pesar mais que o show.
- **disclosure** — item de FAQ individual com controle fino da transição; permite misturar FAQ com
  conteúdo rico (imagem/código) dentro da resposta.
- **transition-panel** — FAQ por categorias em abas com painéis que transicionam; diferencia a seção se
  houver muitas perguntas.
- *Nota:* os quatro blocos de FAQ prontos do Aceternity são Pro (401) — ver §3.

### 5.8 Logos / Integrações (marquee)

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Magic UI | `marquee` | `https://magicui.design/r/marquee.json` | 200 / 2.694 B | — (CSS puro) |
| 2 | cult-ui | `logo-carousel` | `https://raw.githubusercontent.com/nolly-studio/cult-ui/main/apps/www/public/r/logo-carousel.json` | 200 / 29.547 B | — |
| 3 | motion-primitives | `infinite-slider` | `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/infinite-slider.json` | 200 / 3.281 B | `react-use-measure` |
| 4 | Aceternity | `infinite-moving-cards` | `https://ui.aceternity.com/registry/infinite-moving-cards.json` | 200 / 4.199 B | — (CSS puro) |

- **marquee** — o padrão da categoria: fileira infinita com pausa no hover e máscara de fade que se funde
  ao preto; logos em branco/cinza com hover vermelho.
- **logo-carousel** — em vez de rolar, os logos **trocam** com animação coluna a coluna; o tamanho maior é
  porque o JSON embute SVGs de exemplo (descartáveis).
- **infinite-slider** — slider infinito com velocidade e `speedOnHover` controláveis via framer-motion;
  a opção mais "física" das quatro.
- **infinite-moving-cards** — mesmo componente da prova social reaproveitado para logos, mantendo
  consistência de movimento entre as duas seções.

### 5.9 Sobre / Mentoria

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Aceternity | `animated-tooltip` | `https://ui.aceternity.com/registry/animated-tooltip.json` | 200 / 3.604 B | — |
| 2 | Magic UI | `avatar-circles` | `https://magicui.design/r/avatar-circles.json` | 200 / 1.611 B | — |
| 3 | Aceternity | `3d-card` | `https://ui.aceternity.com/registry/3d-card.json` | 200 / 4.374 B | — |
| 4 | Aceternity | `glare-card` | `https://ui.aceternity.com/registry/glare-card.json` | 200 / 7.027 B | — |
| 5 | Magic UI | `blur-fade` | `https://magicui.design/r/blur-fade.json` | 200 / 2.765 B | — |

- **animated-tooltip** — avatares do time/mentores com tooltip que salta com spring; humaniza a seção
  sem quebrar o dark.
- **avatar-circles** — círculos sobrepostos de alunos/clientes + contador ("+120 alunos"); prova social
  compacta para apoiar o texto da mentoria.
- **3d-card** — a foto/card do mentor com perspectiva 3D que reage ao mouse; presença física para a
  figura central da mentoria.
- **glare-card** — reflexo holográfico ao passar o mouse, estilo carta colecionável; torna o card do
  mentor "premium" sobre `#1A1A1A`.
- **blur-fade** — entrada de fotos e parágrafos com blur+fade em cascata; o reveal discreto que a seção
  de história/sobre pede.

### 5.10 Footer

Nenhum footer pronto gratuito (Aceternity Pro/401) — compor a estrutura com estes efeitos:

| # | Registry | Componente | URL testada | HTTP/Tam. | Deps extras |
|---|---|---|---|---|---|
| 1 | Aceternity | `text-hover-effect` | `https://ui.aceternity.com/registry/text-hover-effect.json` | 200 / 4.423 B | — |
| 2 | Magic UI | `dot-pattern` | `https://magicui.design/r/dot-pattern.json` | 200 / 4.818 B | — |
| 3 | Magic UI | `flickering-grid` | `https://magicui.design/r/flickering-grid.json` | 200 / 6.070 B | — (canvas) |
| 4 | Aceternity | `background-beams` | `https://ui.aceternity.com/registry/background-beams.json` | 200 / 10.510 B | — |

- **text-hover-effect** — "SPX IA" gigante em outline SVG cujo traço ganha gradiente seguindo o mouse;
  assinatura de footer premium usada com a marca em DM Serif Display.
- **dot-pattern** — malha pontilhada sutil de fundo; em cinza 10% sobre `#1A1A1A` dá textura sem competir
  com os links.
- **flickering-grid** — grade que cintila em canvas; com célula vermelha em opacidade baixa cria um fundo
  "vivo" de tecnologia.
- **background-beams** — feixes de luz animados atrás dos links do footer, ecoando o CTA final (que já usa
  AnimatedGradientBackground) sem repeti-lo.
- Ícones sociais: SVGs do Iconify (`api.iconify.design/simple-icons/<rede>.svg`) ou SuperTinyIcons,
  conforme o `COMPONENTES-API.md` §3.3.

---

## 6. Bônus testados (fora das seções, úteis na composição)

| Registry | Componente | URL | HTTP/Tam. | Uso sugerido |
|---|---|---|---|---|
| Aceternity | `hover-border-gradient` | `https://ui.aceternity.com/registry/hover-border-gradient.json` | 200 / 3.781 B | Botões secundários com borda gradiente |
| Aceternity | `lamp` | `https://ui.aceternity.com/registry/lamp.json` | 200 / 4.646 B | Abertura de seção com "lâmpada" vermelha |
| Aceternity | `spotlight-new` | `https://ui.aceternity.com/registry/spotlight-new.json` | 200 / 4.048 B | Reforço do spotlight do Hero em outra seção |
| Aceternity | `world-map` | `https://ui.aceternity.com/registry/world-map.json` | 200 / 5.892 B | Mapa pontilhado de clientes (dep: `dotted-map`) |
| Magic UI | `sparkles-text` | `https://magicui.design/r/sparkles-text.json` | 200 / 4.758 B | Palavra-chave com faíscas (já há Sparkles no CTA) |
| Magic UI | `word-rotate` / `hyper-text` | `.../r/word-rotate.json` · `.../r/hyper-text.json` | 200 / 1.562 · 5.335 B | Títulos animados |
| Magic UI | `interactive-hover-button` | `https://magicui.design/r/interactive-hover-button.json` | 200 / 1.409 B | Micro-CTA |
| motion-primitives | `text-effect` / `text-shimmer` / `text-loop` / `text-scramble` | `.../public/c/text-effect.json` etc. | 200 / 7.894 · 2.121 · 2.159 · 2.347 B | Sistema de animação tipográfica |
| KokonutUI | `gradient-button` / `particle-button` / `attract-button` | `kokonutui.com/r/<nome>.json` | 200 / 6.565 · 3.067 · 3.695 B | CTAs com física (deps: `lucide-react`) |
| KokonutUI | `beams-background` | `https://kokonutui.com/r/beams-background.json` | 200 / 7.570 B | Fundo animado alternativo |
| cult-ui | `gradient-heading` | `.../cult-ui/main/apps/www/public/r/gradient-heading.json` | 200 / 3.111 B | Títulos com gradiente (dep: `@radix-ui/react-slot`) |
| cult-ui | `neumorph-eyebrow` | `.../cult-ui/main/apps/www/public/r/neumorph-eyebrow.json` | 200 / 1.455 B | "Eyebrow" acima dos títulos de seção |

## 7. Dependências npm agregadas (se todos os candidatos nº 1 forem adotados)

| Pacote | Quem pede | Já no template? |
|---|---|---|
| `framer-motion` (ou `motion`) | quase todos | **Sim** (trocar import `motion/react` → `framer-motion`) |
| `lucide-react` | glowing-effect, KokonutUI | Padrão shadcn — verificar; provável que sim |
| `@tabler/icons-react` | animated-testimonials, compare | Não — ~2 componentes; substituível por lucide na adaptação |
| `react-use-measure` | sliding-number, infinite-slider | Não — micro-lib (~2 KB) |
| `next-themes` | magic-card | Não — dispensável em site 100% dark (fixar o gradiente) |
| `@radix-ui/react-accordion` | accordion shadcn | Não — só se optar pela via Radix no FAQ |
| `three` + `@react-three/fiber` | card-spotlight | **Evitar** — único componente que pede; descartado |

## 8. Licenças

| Registry | Licença | Fonte da verificação |
|---|---|---|
| shadcn/ui | MIT | LICENSE no repo (confirmado no COMPONENTES-API.md) |
| Magic UI | MIT | LICENSE lido (confirmado no COMPONENTES-API.md) |
| cult-ui | MIT | GitHub API `license.spdx_id: MIT` (verificado hoje) |
| KokonutUI | MIT | LICENSE lido (confirmado no COMPONENTES-API.md) |
| motion-primitives | MIT | GitHub API `license.spdx_id: MIT` (verificado hoje) |
| Aceternity | **Sem SPDX** | Sem LICENSE no repo; componentes gratuitos liberados na prática, mas sem licença formal — registrar o risco antes de usar em produto de cliente |

## 9. Recomendação resumida (1º candidato por seção)

| Seção | Escolha | Por quê |
|---|---|---|
| Problema/Solução | Aceternity `sticky-scroll-reveal` | Narrativa scroll-driven, dark nativo |
| Serviços | Magic UI `magic-card` (+ `glowing-effect` na variante) | Spotlight vermelho no hover, leve |
| Depoimentos | Aceternity `animated-testimonials` | Editorial, valoriza a serifa |
| Métricas | Magic UI `number-ticker` | Padrão da categoria, mono + vermelho |
| Pricing | shadcn `card` + Magic UI `shine-border`/`border-beam` | Não há bloco grátis; composição dá o destaque animado |
| Processo | Aceternity `timeline` (ou `tracing-beam`) | Traço que se preenche em vermelho no scroll |
| FAQ | motion-primitives `accordion` | Animação spring real, minimalista |
| Logos | Magic UI `marquee` | Canônico, CSS puro, fade no preto |
| Sobre/Mentoria | Aceternity `3d-card` + `animated-tooltip` | Presença física do mentor + time humanizado |
| Footer | Aceternity `text-hover-effect` + Magic UI `dot-pattern` | Marca gigante interativa sobre textura sutil |

Rate limit relevante: a API do GitHub sem token dá 60 req/h por IP (usada só para os índices de cult-ui,
motion-primitives e KokonutUI — os downloads via `raw.githubusercontent.com` e sites próprios não contam).
