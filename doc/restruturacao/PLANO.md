# PLANO — Reestruturação Total do Site SPX IA

**Data:** 2026-08-07 · **Coordenador:** Claude (Orca Run `run_895e6f3997a3`)
**Insumos:** `auditoria-site-novo.md` · `pesquisa-registries.md` · `fontes-extras.md` · exploração do site atual

---

## 1. Decisões tomadas (confirmadas com o Walisson em 2026-08-07)

| # | Decisão | Escolha |
|---|---|---|
| 1 | Arquitetura | **Migração total para Next.js** — landing + `/diagnostico` + `/checkout/[slug]` + `/login` + `/redefinir-senha` + `/admin/*` saem do Vite e entram no projeto Next. Nada do front atual sobrevive. |
| 2 | Hero 3D | **Robô Spline mantido como está** (fixar versão do runtime + poster de fallback). |
| 3 | Idiomas | **pt-BR + EN**, seletor no header com **bandeiras** (circle-flags — SVGs redondos ~700 B, MIT, validados por API; self-host em `public/flags/br.svg` e `us.svg`). |
| 4 | Pricing | **Produtos dinâmicos do Supabase** → botões levam ao `/checkout`. **Asaas/checkout/admin estão em estruturação: o código migra completo para o projeto novo, mas nada disso aparece no front público ainda** — a seção Produtos fica pronta e oculta (flag) até o Walisson mandar ativar. |
| 5 | Localização | **O Next.js assume a raiz do repo já na Fase 0**; o app Vite vai para `legacy/` como referência de migração e é removido no cutover. |
| 6 | Deploy | **Coolify/servidor próprio, como hoje** — Dockerfile adaptado para Next (standalone) na Fase 5; detalhes de infra no vault. |
| 7 | FAQ | **Aprovada** — Claude redige 6–8 perguntas, Walisson revisa antes do cutover. |
| 8 | Depoimentos | **Não existem** — os 6 cases reais ocupam o slot de prova social. |

**O que prevalece do template** (`correcao-de-dependencia (1)`): Hero (Spotlight + SplineScene), CTA final (AnimatedGradientBackground + SparklesCore) e Header (navbar pílula flutuante) — os três rebrandeados. **Todas as demais seções são substituídas** por componentes novos dos registries.

---

## 2. Identidade (extraída do site atual — fonte da verdade da marca)

- **Cores:** preto `#1A1A1A` · vermelho `#ED3237` · branco `#FEFEFE` · surface `#2D2D2D` · borda `#3D3D3D` · muted `#888888` · footer `#111111` · verde de acerto `#4ade80`.
- **Fontes:** DM Serif Display (títulos, itálico vermelho nos destaques) · Inter (corpo) · JetBrains Mono (labels/tags/números) — via `next/font/google` (remove `geist`).
- **Logo:** "SPX" branco (Inter 800) + "(IA)" vermelho — componente SVG (portar `Logo.jsx`).
- **Marca:** SPXIA, divisão de IA da **Simplex Soluções** · porta-voz **Paulo Seze** · contato `contato@simplexsolucoes.com.br` · Mato Grosso, Brasil · case com link: `chatspx.com.br`.
- **Copy âncora (pt):** hero "Seu negócio precisa de *IA que funciona.* Não de promessas." · badge "CONSULTORIA · AUTOMAÇÃO · IA PARA NEGÓCIOS" · quote "IA não é sobre tecnologia. É sobre resultado de negócio…".
- **Números reais:** 50+ projetos · 40+ automações · 3x ROI médio · 80% redução de tempo · 100% clientes com ROI positivo.
- **Contraste:** `#ED3237` sobre `#1A1A1A` ≈ 4.2:1 — usar vermelho só em texto grande/bold ou como acento.

## 3. Arquitetura técnica

- **Novo app:** o conteúdo do template sai de `correcao-de-dependencia (1)` (nome com espaço/parênteses quebra tooling no Windows) e **assume a raiz do repo** na Fase 0. O app Vite inteiro (src/, index.html, vite.config.js, package.json) vai para **`legacy/`** como referência para a migração das páginas funcionais, e é deletado no cutover. Infra da raiz (Dockerfile, Caddyfile, *.sql, supabase/, migrations/, doc/) permanece.
- **Framework:** **Next.js 15 + React 19** (o template traz react 19 com next 14 — combinação frágil; subir para 15 alinha tipos e resolve o mismatch `@types/react`).
- **Gerenciador:** pnpm + campo `packageManager` (só existe `pnpm-lock.yaml`; npm re-resolveria 7 deps `latest`).
- **Animação:** padronizar no pacote **`motion`** (sucessor do framer-motion; quase todos os componentes dos registries importam `motion/react` — troca de 4 imports nos componentes mantidos vs ~15 nos baixados).
- **Limpeza (da auditoria):** deletar 47 componentes órfãos + `spotlight-cursor` (duplicata) + `styles/globals.css` (duplicata) + hooks duplicados + `theme-provider` + placeholders + `texture_earth.jpg`; remover ~30 deps lixo (expo, react-native, three, @react-three/*, radix órfãos, etc.) → package.json cai de ~60 para ~20 deps; fixar `@splinetool/runtime`; **desligar `ignoreBuildErrors`** e corrigir (prop `fill` em page.tsx:40, types, `@types/canvas-confetti`).
- **Supabase:** portar `src/lib/supabase.js` (env `VITE_*` → `NEXT_PUBLIC_*`, sem fallback hardcoded de chave no código novo), `AuthContext`, `usePermissions`, `lib/asaas.js`.
- **i18n:** dicionários `pt.ts`/`en.ts` portados do atual e expandidos (novas seções + Produtos que hoje tem ternários inline). Contexto client-side próprio (mesmo padrão atual, sem lib) + `localStorage`. **Default: pt** (hoje o default é en — corrigir). Seletor no header com bandeiras circle-flags.
- **Tema:** tokens Tailwind 4 CSS-first em `app/globals.css` — tema único dark direto no `:root` (`--background #1A1A1A`, `--primary #ED3237`, `--font-serif` novo), eliminando o bloco `.dark` morto. Corrigir `hsl(var(--…))` legado no pricing (sintaxe Tailwind 3 gera cor inválida).

## 4. Mapa da landing — seção a seção

Ordem do template preservada; Cases entra no slot de prova social; Sobre, Mentoria, Quote e FAQ entram como seções do conteúdo SPXIA. Componente titular + alternativa (todas as URLs testadas nos relatórios):

| # | Seção | Conteúdo (do site atual) | Componente novo | Alternativa |
|---|---|---|---|---|
| 1 | **Header** (mantido) | Links: Sobre, Serviços, Como Funciona, Cases, Mentoria + CTA "Agendar Diagnóstico" → `/diagnostico` + seletor pt/en com bandeiras | Navbar pílula do template rebrandeada (azuis → vermelho SPX, logo SPX(IA)) | — |
| 2 | **Hero** (mantido) | Headline/sub/badge reais + 3 stats reais | Spotlight + SplineScene do template; stats com `number-ticker` | — |
| 3 | **Logos/техs marquee** | Tecnologias que a SPXIA domina (n8n, WhatsApp, OpenAI, Claude, Supabase…) | Magic UI `marquee` (CSS puro) + ícones Iconify/SuperTinyIcons | motion-primitives `infinite-slider` |
| 4 | **Sobre** | "Quem somos" + 4 valores + Simplex Soluções | Magic UI `blur-fade` + cult-ui `texture-card` | Spectrum UI `bento-grid` |
| 5 | **Problema/Solução** | Callout da dor + SEM/COM SPXIA (5+5 itens) | Aceternity `sticky-scroll-reveal` | Aceternity `compare` (antes/depois arrastável) |
| 6 | **Serviços** | 6 serviços reais com tags | Magic UI `magic-card` (spotlight vermelho no hover) + Aceternity `glowing-effect` | `card-hover-effect` |
| 7 | **Como Funciona** | 4 passos 01–04 com details em mono | Aceternity `timeline` (traço que preenche em vermelho no scroll) | `tracing-beam` |
| 8 | **Cases** (slot prova social) | 6 cases reais c/ métricas + badge "DESENVOLVIDO COM IA" + link ChatSPX | Aceternity `wobble-card` em grid | skiper `card-carousel` / `infinite-moving-cards` |
| 9 | **Resultados** | 50+ · 40+ · 3x · 80% | Magic UI `number-ticker` em JetBrains Mono vermelho | motion-primitives `sliding-number` |
| 10 | **Mentoria** | 3 programas com público e tópicos | Aceternity `glare-card` + Magic UI `avatar-circles` | `3d-card` |
| 11 | **Produtos/Pricing** | **Dinâmico do Supabase** (`products` publicados) → `/checkout/{slug}`; some se vazio (comportamento atual) | Estrutura própria (card shadcn) + Magic UI `shine-border` no destaque + `border-beam` + Aceternity `moving-border` no CTA | SmoothUI `pricing-1` como referência estrutural |
| 12 | **Quote** | Citação do Paulo Seze | Magic UI `text-reveal` (palavra a palavra no scroll) | motion-primitives `text-effect` |
| 13 | **FAQ** (nova) | Redigir 6–8 perguntas (objeções de venda) — pendente aprovação de conteúdo | motion-primitives `accordion` (spring real) | SmoothUI `faq-1` / shadcn accordion (a11y) |
| 14 | **CTA final** (mantido) | Copy pt + botões → `/diagnostico` e contato | AnimatedGradientBackground com rampa **preto→vermelho** (`#0A0A0A → #1A1A1A → #ED3237`) + SparklesCore | — |
| 15 | **Footer** | Âncoras + contato + LGPD (privacy/terms) | Aceternity `text-hover-effect` ("SPXIA" gigante interativo) + Magic UI `dot-pattern` | `flickering-grid` |

**Fontes reserva** (se algum titular decepcionar na prática): SmoothUI (MIT, seções completas), Eldora UI, UI Layouts, Spectrum UI (Apache-2.0), Origin/Coss via raw. **Evitar:** Berlix e bg.ibelick (sem licença), Tailark blocks (401), `card-spotlight` do Aceternity (puxa three.js). React Bits/Shadcnblocks: ok usar no site (Commons Clause proíbe só redistribuir como biblioteca). Aceternity: sem SPDX formal — risco baixo registrado; alternativas MIT mapeadas para cada uso.

## 5. Páginas funcionais migradas (Vite → Next)

| Página | Origem | Notas de migração |
|---|---|---|
| `/diagnostico` | `src/pages/Diagnostico.jsx` | Wizard multi-etapas + reCAPTCHA + insert `diagnostics`; client component |
| `/checkout/[slug]` | `src/pages/Checkout.jsx` + `lib/asaas.js` | RPC Supabase + Asaas; client component |
| `/login`, `/redefinir-senha` | `src/pages/…` | Auth Supabase |
| `/admin/*` (11 páginas + layout) | `src/pages/admin/*` | Guards client-side (`ProtectedRoute`/`PermGuard`) portados; visual admin pode ser portado 1:1 (`admin.css`) numa primeira leva — o pedido de redesign é do site público |
| `/privacy`, `/terms` | novas | Reescrever em pt-BR adequadas à LGPD (as do template são genéricas em inglês) |

### 5.1 SEO e descoberta (checklist completo — entra na Fase 1 e é validado na Fase 4)

| Item | Implementação |
|---|---|
| **Metadata** | `metadata` do App Router: `metadataBase`, título com template (`SPXIA — %s`), description por página, keywords; hoje é `'v0 App'` |
| **sitemap.xml** | `app/sitemap.ts` gerado pelo Next — landing + âncoras relevantes + privacy/terms (páginas privadas/admin fora) |
| **robots.txt** | `app/robots.ts` — libera o site público, bloqueia `/admin`, `/login`, `/checkout`, `/redefinir-senha`; aponta o sitemap |
| **llms.txt** | `public/llms.txt` — padrão para agentes de IA: quem é a SPXIA, serviços, cases, contato, links canônicos (e `llms-full.txt` se valer o detalhe) |
| **Open Graph / Twitter** | OG image 1200×630 da marca (preto + logo SPX(IA) vermelho) gerada como asset estático; cards `summary_large_image` |
| **JSON-LD** | `Organization` (SPXIA/Simplex Soluções, logo, e-mail, região MT) + `WebSite` + `FAQPage` (quando o FAQ entrar) |
| **hreflang** | `alternates.languages` pt-BR/en (site bilíngue) + `<html lang>` dinâmico conforme o locale |
| **Favicons/manifest** | Ícones reais SPXIA (substituem placeholders v0) + `manifest.webmanifest` |
| **Páginas de erro** | `not-found.tsx` e `error.tsx` com a marca |
| **Performance/CWV** | Spline lazy com poster estático (LCP protegido), fontes `next/font` (sem FOUT), imagens `next/image` — meta Lighthouse ≥ 90 mobile |
| **Analytics** | O template traz `@vercel/analytics`, que **não funciona no Coolify** — remover; decidir com o Walisson se entra GA4/Umami/Plausible na Fase 5 |

## 6. Fases de execução (orquestração Orca — workers claude/codex supervisionados)

- **Fase 0 — Fundação** (1 worker): copiar template → `web/`, limpeza total (órfãos + deps), Next 15, pnpm install, build verde com `ignoreBuildErrors: false`.
- **Fase 1 — Design system** (1 worker): tokens rebrand, fontes, logo, navbar rebrandeada com seletor de bandeiras, i18n base (contexto + dicionários), layout/metadata.
- **Fase 2 — Seções** (waves de 3–4 workers em paralelo, 1 seção por worker): baixar componente do registry → adaptar (`motion/react`→padrão do projeto, cores → tokens SPX) → integrar conteúdo do i18n → conferir mobile. Hero e CTA rebrandeados nesta fase.
- **Fase 3 — Funcionais** (3–4 workers): diagnostico, checkout, login/senha, admin. Testes manuais de fluxo (diagnóstico grava? checkout chama RPC? admin loga?).
- **Fase 4 — QA** (2 workers + coordenador): build prod, Lighthouse, responsivo, i18n completo pt/en, review cruzado (codex revisa o que claude fez e vice-versa), screenshots via browser do Orca.
- **Fase 5 — Cutover** (com aprovação): Dockerfile/Caddyfile para Next, deploy, remoção do app Vite.

Dependências: F0 → F1 → F2 ∥ F3 → F4 → F5. Waves da F2 são independentes entre si.

## 7. Riscos e mitigações

1. **Admin/checkout regressão** — maior risco da migração total; mitigar com checklist de fluxo por página na F3/F4 e manter o Vite intocado até o cutover.
2. **Spline**: CDN de terceiro + ~2 MB + watermark possível — fixar versão, poster fallback; decisão consciente do Walisson.
3. **Commons Clause / Aceternity sem SPDX** — registrado; alternativas MIT para tudo.
4. **Contraste do vermelho** — regra: vermelho só em display/bold/acentos.
5. **Windows/caminhos** — resolvido com `web/`; `.gitattributes` eol=lf.
6. **Supabase key hardcoded no código atual** — não repetir no novo; usar env.

## 8. Pendências

Todas as decisões foram respondidas pelo Walisson em 2026-08-07 (tabela da seção 1). Restam apenas as revisões dele: texto do FAQ e aprovação do cutover (Fase 5).
