# Auditoria Técnica — Template Base do Novo Site SPX IA

**Projeto auditado:** `correcao-de-dependencia (1)/` (Next.js 14.2.25 + Tailwind 4 + shadcn, gerado no v0)
**Data:** 2026-08-07
**Escopo:** somente pesquisa — nenhum arquivo do template foi modificado.
**Rebrand alvo:** preto `#1A1A1A`, vermelho `#ED3237`, branco `#FEFEFE`; fontes DM Serif Display + Inter + JetBrains Mono; conteúdo em pt-BR.

Todas as referências `arquivo:linha` são relativas à raiz do template.

---

## Sumário executivo

- Dos **58 arquivos** em `components/ui/`, apenas **11 são usados** pelas páginas; **47 são órfãos** e podem ser deletados (junto com `components/theme-provider.tsx`, `styles/globals.css` e 2 hooks).
- Das **~60 dependências** do `package.json`, cerca de **30 são lixo do v0** — incluindo `expo`, `react-native`, `three` e `@react-three/*`, que **não são importados por nenhum arquivo** e existem só para calar peer-warnings. Removê-las corta centenas de MB da instalação.
- O tema é o shadcn neutro padrão (chroma 0) e **quase nada da identidade visual vem dos tokens**: o site inteiro usa classes literais (`bg-black`, `text-blue-400`, hex inline). O rebrand exige mexer em ~40 pontos hardcoded, listados abaixo com arquivo:linha.
- **Riscos graves de build**: `react ^19` com Next 14 (que é da era React 18), `@types/react ^18` com React 19, 7 dependências com tag `latest`, e `typescript.ignoreBuildErrors: true` mascarando erros reais (há pelo menos um erro de tipo conhecido em `app/page.tsx:40`).
- Para produção falta praticamente tudo de SEO/branding: metadata é `'v0 App'`, `<html lang="en">`, ícones placeholder do v0, conteúdo 100% em inglês com dados fictícios, e páginas privacy/terms genéricas em inglês.

---

## (a) Inventário de componentes — usados vs. órfãos

### Grafo de uso (evidência)

Entradas do app:
- `app/page.tsx:1-9` importa: `button`, `card`, `spotlight`, `spline-scene`, `animated-gradient-background`, `sparkles`, `bento-grid`, `navbar`, `pricing`.
- `app/privacy/page.tsx:1-2` e `app/terms/page.tsx:1-2` importam: `navbar`, `button`.
- `app/layout.tsx` não importa nada de `components/`.

Transitivos:
- `pricing.tsx:3-7` → `button` (buttonVariants), `label`, `switch`, `hooks/use-media-query`, `lib/utils`.
- `bento-grid.tsx:4-5` → `lib/utils`, `button`.
- Todos os usados dependem de `lib/utils.ts` (`cn`).

### ✅ Usados (11 arquivos em `components/ui/`)

| Arquivo | Usado por |
|---|---|
| `animated-gradient-background.tsx` | page.tsx:5 (fundo do CTA) |
| `bento-grid.tsx` | page.tsx:7 (seção Services) |
| `button.tsx` | page, privacy, terms, pricing, bento-grid |
| `card.tsx` | page.tsx:2 (hero + depoimentos) |
| `label.tsx` | pricing.tsx:4 |
| `navbar.tsx` | page, privacy, terms |
| `pricing.tsx` | page.tsx:9 |
| `sparkles.tsx` | page.tsx:6 (partículas do CTA) |
| `spline-scene.tsx` | page.tsx:4 (robô 3D do hero) |
| `spotlight.tsx` | page.tsx:3 (hero) |
| `switch.tsx` | pricing.tsx:5 (toggle mensal/anual) |

Fora de `components/ui/` também são usados: `lib/utils.ts` e `hooks/use-media-query.ts`.

### 🗑️ Órfãos — podem ser deletados (47 arquivos em `components/ui/`)

Nenhum destes é importado por página ou por componente usado (só se importam entre si):

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spotlight-cursor`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, `use-mobile.tsx`, `use-toast.ts`.

Órfãos fora de `components/ui/`:
- `components/theme-provider.tsx` — nunca montado no layout (o site não tem toggle de tema).
- `hooks/use-mobile.ts` e `hooks/use-toast.ts` — só usados pelos órfãos `sidebar`/`toaster`.
- `styles/globals.css` — **byte a byte idêntico** a `app/globals.css`; só `app/globals.css` é carregado (`app/layout.tsx:5`).
- `public/assets/3d/texture_earth.jpg` (764 KB) — não referenciado por ninguém (sobra de demo three.js do v0).

### Duplicatas e anomalias

1. **`spotlight-cursor.tsx` é cópia idêntica de `spotlight.tsx`** (mesmo export `Spotlight`; diferem só em whitespace). Deletar uma.
2. `components/ui/use-toast.ts` == `hooks/use-toast.ts` e `components/ui/use-mobile.tsx` == `hooks/use-mobile.ts` (duplicatas exatas, padrão do v0).
3. **Bug latente:** `app/page.tsx:40` passa `fill="white"` para `<Spotlight>`, mas `SpotlightProps` (`components/ui/spotlight.tsx:6-10`) só aceita `className`, `size`, `springOptions`. A prop é ignorada em runtime e é um **erro de TypeScript** — o build só passa porque `next.config.mjs:3-5` tem `ignoreBuildErrors: true`. A cor real do spotlight vem de `spotlight.tsx:63`.

---

## (b) Tema e rebrand

### Estado atual

`app/globals.css` e `styles/globals.css` são idênticos (Tailwind 4 CSS-first, sem `tailwind.config`):
- `app/globals.css:1-2` — `@import 'tailwindcss'` + `@import 'tw-animate-css'`.
- `:4` — `@custom-variant dark` (variante `.dark` nunca é ativada; não há ThemeProvider no layout).
- `:6-40` — tokens `:root` (tema claro), `:42-75` — tokens `.dark`, `:77-116` — `@theme inline` mapeando tokens → classes Tailwind.
- Paleta inteira é **neutra (chroma 0)** exceto `--destructive` e `--chart-*`. Ou seja: o visual dark do site **não vem dos tokens** — vem de classes literais `bg-black`/`text-white` espalhadas nas páginas. O tema efetivo dos componentes shadcn em uso é o **claro** (`:root`), o que gera incoerências (ex.: o `Switch` do pricing usa `--primary` claro).

Fontes atuais: Geist Sans/Mono via pacote `geist` (`app/layout.tsx:2-3,37`), mapeadas em `app/globals.css:78-79` (`--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`). Não há token `--font-serif`.

### Tokens a alterar para o rebrand (em `app/globals.css`)

Conversões aproximadas (conferir na conversão final):
- `#1A1A1A` ≈ `oklch(0.205 0 0)` — curiosamente já é o valor atual de `--primary` claro (`:13`).
- `#FEFEFE` ≈ `oklch(0.995 0 0)`.
- `#ED3237` ≈ `oklch(0.63 0.22 27)` (vizinho do red-500 `oklch(0.637 0.237 25.331)` que já está em `--destructive:21`).

Mudanças sugeridas (estratégia: tema único escuro direto no `:root`, eliminando o bloco `.dark` e o `@custom-variant`):
- `--background` → `#1A1A1A`; `--foreground` → `#FEFEFE` (`:7-8`).
- `--primary` → `#ED3237`, `--primary-foreground` → `#FEFEFE` (`:13-14`).
- `--ring` → vermelho SPX (`:25`); `--border`/`--input` → cinza sobre `#1A1A1A` (`:23-24`).
- `--card`/`--popover` → variação de `#1A1A1A` (ex. `#212121`) (`:9-12`).
- `@theme inline` (`:77-116`): adicionar `--font-serif: var(--font-dm-serif)` e trocar `--font-sans`/`--font-mono` para as variáveis de Inter e JetBrains Mono (carregadas via `next/font/google` no layout, substituindo o pacote `geist`).

**Atenção ao contraste:** `#ED3237` sobre `#1A1A1A` ≈ 4.2:1 — passa WCAG AA só para texto grande/bold; para texto pequeno em vermelho será preciso clarear o tom ou usar como acento não textual.

### Cores hardcoded a trocar (arquivo:linha)

**`components/ui/navbar.tsx`** (os azuis citados no briefing):
- `:53` — `bg-blue-400` (ponto do logo CSS).
- `:67` — `border-[#333] bg-[rgba(31,31,31,0.62)]` (botão "Call Us").
- `:77` — `bg-blue-400` (glow do botão "Get Quote").
- `:82` — `bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700` (botão "Get Quote") → gradiente do vermelho SPX.
- `:94` — `border-[#333] bg-[#1f1f1f57]` (pílula do header).
- `:50-59` — o "logo" é um desenho CSS com texto "AI"; substituir pela marca SPX IA.

**`app/page.tsx`:**
- `:32,37,92,143,203,262,308,377,461` — `bg-black` seções (→ `bg-background` com `#1A1A1A`).
- `:39` — `bg-black/[0.96]` no Card do hero.
- `:40` — `fill="white"` (prop morta, ver seção a).
- `:45,442` — gradiente de título `from-neutral-50 to-neutral-400`.
- `:54,448` — CTA `bg-white text-black hover:bg-gray-100` (→ vermelho SPX).
- `:61` — `border-neutral-600 text-neutral-300 hover:bg-neutral-800`.
- `:69,73,121,125,129,133` — `text-green-400`/`text-green-500` (checks).
- `:99,103,107,111` — `text-red-500` (✗ da seção problema; próximo do vermelho da marca, unificar em `#ED3237`).
- `:213,229,245` — `text-yellow-400` (estrelas dos depoimentos).
- `:273-274` — `bg-green-900/40` + `text-green-400`; `:281-282` — `bg-blue-900/40` + `text-blue-400`; `:289-290` — `bg-purple-900/40` + `text-purple-400`; `:297-298` — `bg-orange-900/40` + `text-orange-400` (métricas multicoloridas → paleta SPX).
- `:388,398,408` — círculos numerados `bg-white text-black`.
- `:424` — **gradientColors do CTA**: `["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]` — arco-íris azul/rosa/laranja/amarelo/verde; trocar por rampa preto→vermelho SPX (`#1A1A1A` → `#ED3237`).
- `:438` — `particleColor="#FFFFFF"` (ok para o rebrand, `#FEFEFE` se quiser exatidão).
- `:452` — `border-white text-white hover:bg-white/10`.

**`components/ui/pricing.tsx`:**
- `:79` — `text-blue-400` ("Save 20%").
- `:109` — `border-blue-400` (card popular).
- `:120` — `bg-blue-500` (badge "Popular").
- `:141` — `text-blue-400` (checks da lista).
- `:156-157` — `hover:ring-blue-400 hover:bg-blue-500` / `bg-blue-500 ... border-blue-400` (botões dos planos).
- `:55` — cores do confetti usam `hsl(var(--primary))` etc. — **sintaxe Tailwind 3**; os tokens agora são oklch puros, então esses `hsl(var(--...))` geram cores inválidas. Trocar por `var(--primary)`.

**`components/ui/spotlight.tsx`:**
- `:63` — **spotlight branco**: `from-zinc-50 via-zinc-100 to-zinc-200` (é daqui que vem a cor, não do `fill` do page.tsx). Para rebrand, considerar tom levemente avermelhado ou manter branco.

**`components/ui/sparkles.tsx`:**
- `:55` — default `background: "#0d47a1"` (azul; hoje sobrescrito por `background="transparent"` em page.tsx:433).
- `:116` — default `particleColor: "#ffffff"`.

**`components/ui/animated-gradient-background.tsx`:**
- `:23,80` — defaults com a mesma paleta arco-íris do CTA (documentação e fallback).

**Spline (hero):** a cena 3D (`app/page.tsx:82`, `https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode`) tem cores/iluminação **embutidas na cena** — não é re-temável via CSS. Rebrand exige editar a cena no editor da Spline ou substituí-la.

---

## (c) Dependências do `package.json`

### Realmente usadas (runtime)

| Pacote | Evidência |
|---|---|
| `next` 14.2.25, `react` ^19, `react-dom` ^19 | framework |
| `geist` ^1.3.1 | `app/layout.tsx:2-3` — **sai no rebrand** (Inter/JetBrains/DM Serif via `next/font/google`) |
| `@vercel/analytics` 1.3.1 | `app/layout.tsx:4,39` |
| `framer-motion` 12.23.12 | spotlight:3, animated-gradient-background:3, sparkles:8, pricing:8 |
| `lucide-react` ^0.454.0 | page.tsx:10-28, pricing:9, privacy:3, terms:3 |
| `@radix-ui/react-icons` 1.3.2 | bento-grid:2 (só `ArrowRightIcon` — dá para trocar por lucide e remover) |
| `@radix-ui/react-slot` 1.1.1 | button:2 |
| `@radix-ui/react-label` 2.1.1 | label:4 |
| `@radix-ui/react-switch` 1.1.2 | switch:4 |
| `class-variance-authority` ^0.7.1 | button:3 |
| `clsx` + `tailwind-merge` | lib/utils.ts:1-2 |
| `canvas-confetti` 1.9.3 | pricing:12 (sem `@types/canvas-confetti` — erro TS mascarado) |
| `@tsparticles/react` + `@tsparticles/engine` + `@tsparticles/slim` | sparkles:4-6 |
| `@splinetool/react-spline` 4.1.0 + `@splinetool/runtime` (latest) | spline-scene:4 |

Build/dev usados: `tailwindcss` ^4.1.9, `@tailwindcss/postcss` (postcss.config.mjs:4), `postcss`, `tw-animate-css` (app/globals.css:2), `typescript`, `@types/node`, `@types/react`, `@types/react-dom`.

### 🗑️ Lixo do v0 — nenhum arquivo importa (verificado por grep no código-fonte)

**Bloco expo/three (as suspeitas do briefing — confirmadas):**
- `expo`, `expo-asset`, `expo-file-system`, `expo-gl`, `react-native` — todos com tag `latest` (lockfile resolveu `expo@57.0.8`, `react-native@0.86.0`). Zero imports. Foram adicionados (daí o nome da pasta, "correção de dependência") só para satisfazer peers opcionais de `@react-three/fiber`.
- `three` 0.180.0, `@react-three/fiber` 9.3.0, `@react-three/drei` 10.7.4 — zero imports. O Spline **não usa three.js** (tem renderer próprio). Removendo os três, o bloco expo/react-native perde a razão de existir.
- Custo: são as maiores árvores do lockfile; inflam a instalação em centenas de MB e milhares de arquivos (lento no Windows, ver seção e).

**Restante não utilizado** (importados apenas por componentes órfãos, ou por ninguém):
- `@emotion/is-prop-valid` (latest→1.4.0) — peer opcional do framer-motion, só necessário com styled-components.
- `@number-flow/react` — a versão original do componente pricing (21st.dev) usava; esta cópia não usa.
- Radix órfãos: `react-accordion`, `react-alert-dialog`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-collapsible`, `react-context-menu`, `react-dialog`, `react-dropdown-menu`, `react-hover-card`, `react-menubar`, `react-navigation-menu`, `react-popover`, `react-progress`, `react-radio-group`, `react-scroll-area`, `react-select`, `react-separator`, `react-slider`, `react-tabs`, `react-toast`, `react-toggle`, `react-toggle-group`, `react-tooltip`.
- `react-hook-form`, `@hookform/resolvers`, `zod` (form.tsx órfão), `cmdk` (command), `date-fns` (ninguém importa; react-day-picker v9 embute a própria), `embla-carousel-react` (carousel), `input-otp`, `next-themes` (theme-provider/sonner), `react-day-picker` (calendar), `react-resizable-panels` (resizable), `recharts` (chart), `sonner`, `vaul` (drawer).
- `tailwindcss-animate` — plugin da era Tailwind 3; o projeto já usa `tw-animate-css` (Tailwind 4). Remover.
- `autoprefixer` — não referenciado em `postcss.config.mjs`; Tailwind 4 já cuida de prefixos. Remover.

> Deletando os 47 componentes órfãos + essas deps, o `package.json` cai de ~60 para ~20 dependências.

### Custo do Spline 3D no hero

- `@splinetool/runtime` (lockfile: **1.12.98**, tag `latest` no package.json) é um runtime WebGL completo: chunk JS na casa de **~2 MB** só para o robô do hero — de longe o maior peso da página.
- A cena é baixada **em runtime** de `prod.spline.design` (`app/page.tsx:82`): dependência de CDN de terceiro; se a Spline mudar/derrubar o link, o hero fica eternamente no spinner (`spline-scene.tsx:14-17` — o fallback é só um spinner, sem imagem estática).
- Carregado via `React.lazy` (`spline-scene.tsx:4`), então não bloqueia o SSR — mas WebGL contínuo pesa em mobile (CPU/GPU/bateria) e o plano gratuito da Spline exibe watermark.
- Com a tag `latest`, um `npm install` sem lockfile pode puxar um runtime incompatível com `@splinetool/react-spline` 4.1.0. **Fixar a versão.**
- Recomendação: ou assumir o custo (fixando versão e adicionando poster estático como fallback), ou substituir por imagem/vídeo/render estático do robô.

### Riscos de versão

1. **`react ^19` + `next 14.2.25`** (lockfile: react 19.2.8): Next 14 é da geração React 18; suporte oficial a React 19 estável chegou no Next 15. Combinação frágil (hydration, tipos, APIs). **Recomendação: subir para Next 15** (ou, se quiser mexer no mínimo, fixar `react`/`react-dom` em 18.3.1).
2. **`@types/react ^18` / `@types/react-dom ^18` com React 19**: mismatch de tipos em toda a base — hoje invisível porque `next.config.mjs:3-5` tem `ignoreBuildErrors: true`.
3. **7 dependências com tag `latest`** (`@emotion/is-prop-valid`, `@splinetool/runtime`, `expo`, `expo-asset`, `expo-file-system`, `expo-gl`, `react-native`): build não reprodutível fora do pnpm-lock. Após a limpeza sobra só `@splinetool/runtime` — fixar.
4. **`pnpm.overrides` (motion-dom 12.23.12)** no package.json — só é honrado pelo pnpm; npm/yarn ignoram silenciosamente.
5. `vaul 0.9.9` declara peer `react ^16.8||^17||^18` — warning/conflito sob React 19 (é órfão; a remoção resolve).
6. Ponto positivo: 14.2.25 é exatamente a versão que corrige a CVE-2025-29927 (bypass de middleware) — sem pendência aí.

---

## (d) O que falta para produção

### Metadata/SEO (`app/layout.tsx`)

- `:7-28` — `title: 'v0 App'`, `description: 'Created with v0'`, `generator: 'v0.app'`. Falta: `metadataBase`, `openGraph` (+ imagem OG), `twitter`, `robots`, canonical/`alternates`, template de título por página.
- `:36` — `<html lang="en">` → **`pt-BR`** (obrigatório para o rebrand em português).
- Não existem `app/robots.ts`, `app/sitemap.ts` nem manifest PWA.
- Não há página 404 custom (`app/not-found.tsx`), nem `error.tsx`/`loading.tsx`.

### Favicon/logo e `public/`

- Ícones atuais são os placeholders do v0: `public/icon.svg`, `icon-light-32x32.png`, `icon-dark-32x32.png`, `apple-icon.png` (referenciados em `layout.tsx:11-27`). Substituir pela marca SPX IA.
- `public/placeholder-logo.png/svg`, `placeholder-user.jpg`, `placeholder.jpg/svg` — placeholders genéricos; deletar ou substituir.
- `public/assets/3d/texture_earth.jpg` (764 KB) — lixo, deletar.
- Não existe nenhuma imagem real da marca (logo SPX IA, OG image, foto de equipe/cases).

### Conteúdo (tudo em inglês com dados fictícios)

- Todo o texto de `app/page.tsx` é em inglês ("Results and Costs Reduced by AI", etc.) → reescrever em pt-BR.
- Dados falsos a substituir: telefone `(555) 123-4567` (page.tsx:453,563), e-mail `hello@aiagency.com` (:553-555), endereço "123 AI Street, Tech City" (:571), depoimentos fictícios Sarah Johnson/Michael Chen/Emily Rodriguez (:219-252), preços em dólar (pricing, page.tsx:315-355), "© 2024 AI Agency" (:580), redes sociais com `href="#"` (:476-493).
- Navbar em inglês: "Services/Case Studies/Call Us/Get Quote" (`navbar.tsx:61-84`).

### Páginas privacy e terms

- `app/privacy/page.tsx` e `app/terms/page.tsx` existem mas são **genéricas, em inglês**, "Last updated: December 2024", em nome de "AI Agency". Para o site pt-BR precisam ser reescritas (Política de Privacidade adequada à **LGPD** + Termos de Uso) ou removidas do rodapé até existirem.

### Configuração

- `next.config.mjs:3-5` — `typescript.ignoreBuildErrors: true`: **desligar antes de produção** (vai expor os erros reais: prop `fill` inválida, tipos React 18 vs 19, canvas-confetti sem types).
- `next.config.mjs:6-8` — `images.unoptimized: true`: sem otimização do `next/image`. Aceitável para export estático; ruim em produção Vercel/`next start`.
- Script `"lint": "next lint"` sem ESLint instalado nem configurado no template (nota: há um `eslint.config.js` na raiz do repo pai, mas não deste template).

---

## (e) Riscos de build no Windows

1. **Nome da pasta: `correcao-de-dependencia (1)`** — espaço e parênteses no caminho quebram scripts npm/CLIs que não citam paths e complicam qualquer automação. **Renomear a pasta antes de qualquer outra coisa** (ex.: `site-novo/` ou mover para a raiz do repo).
2. **pnpm vs npm:** só existe `pnpm-lock.yaml` (8.147 linhas). Um `npm install` ignora esse lock e re-resolve as 7 deps `latest` → árvore diferente da testada, além de ignorar o `pnpm.overrides`. **Usar pnpm** (via corepack) e adicionar o campo `"packageManager"` ao package.json para travar isso.
3. **MAX_PATH / volume de arquivos:** as árvores de `react-native`/`expo`/`three` (não usadas!) criam milhares de arquivos e caminhos profundos; no Windows isso significa instalação lenta (Defender escaneando tudo) e risco de estourar o limite de 260 caracteres se "long paths" não estiver habilitado. A limpeza de dependências da seção (c) elimina o problema na raiz.
4. **`node_modules` ainda não existe** no template — a primeira instalação será o momento de verdade; fazer com pnpm já com o package.json limpo.
5. `next.config.mjs` em si é portável (sem plugins nativos); os riscos reais de build são os de versão da seção (c) — hoje mascarados pelo `ignoreBuildErrors`. Ao desligar a flag, esperar o build **falhar** até corrigir: prop `fill` (page.tsx:40), `@types/react` 18 vs React 19, e falta de `@types/canvas-confetti`.
6. Menor: fim de linha CRLF/LF — definir `.gitattributes` (`* text=auto eol=lf`) para evitar diffs sujos entre Windows e CI.

---

## Plano de ação recomendado (ordem sugerida)

1. Renomear/mover a pasta do template (remove espaço/parênteses do caminho).
2. Deletar os 47 componentes órfãos, `spotlight-cursor.tsx`, duplicatas de hooks, `theme-provider.tsx`, `styles/globals.css`, placeholders e `texture_earth.jpg`.
3. Limpar o `package.json` (~30 deps fora, fixar `@splinetool/runtime`), decidir Next 15 + React 19 (recomendado) ou React 18.3 + Next 14, alinhar `@types/*`, adicionar `@types/canvas-confetti` e `"packageManager"`; instalar com pnpm.
4. Desligar `ignoreBuildErrors` e corrigir o que aparecer (inclui page.tsx:40).
5. Rebrand: tokens em `app/globals.css` (paleta SPX + `--font-serif`), fontes via `next/font/google` (remove `geist`), e a lista de ~40 cores hardcoded da seção (b).
6. Conteúdo pt-BR + metadata/SEO + ícones/logo reais + privacy/terms LGPD.
7. Decisão sobre o Spline do hero (manter com versão fixa + poster fallback, ou substituir).
