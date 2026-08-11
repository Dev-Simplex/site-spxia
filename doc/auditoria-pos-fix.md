# Correções da Auditoria de Responsividade — Medição Pós-Fix

**Data:** 2026-08-10 · **Método:** idêntico ao da auditoria (Playwright + Chromium headless sobre build de produção, `pnpm build` + `next start` na porta 3312). Números medidos no browser, não estimados. Evidências novas em `doc/auditoria-evidencias/pos-fix/`.

**Validação técnica:** `tsc --noEmit` limpo · `pnpm build` verde (22/22 páginas).

---

## 1. Navbar (CRÍTICO) — hambúrguer até `lg` (1024px)

Decisão: manter o hambúrguer até 1024px (sugestão principal da auditoria). Comprimir a pill não resolveria 640–768px — o conteúdo desktop tem 865px e precisaria perder >220px. A partir de 1024px a pill desktop (865px) cabe com folga (precisa de ~897px).

| Largura | Antes | Depois (medido) |
|---|---|---|
| 640 | `left: -112px` (logo e CTA mais da metade fora) | hambúrguer · pill `left: 16, right: 624` ✔ |
| 700 | cortado | hambúrguer · `left: 16, right: 684` ✔ |
| 768 | `left: -48px, right: 816` (corte dos dois lados) | hambúrguer · `left: 16, right: 752` ✔ |
| 820 | cortado | hambúrguer · `left: 16, right: 804` ✔ |
| 900 | cortado (precisa ~897; borda no limite) | hambúrguer · `left: 16, right: 884` ✔ |
| 1024 | ok | pill desktop 865px · `left: 79.5, right: 944.5` ✔ |
| 1100 | ok | pill desktop 865px · `left: 117.5, right: 982.5` ✔ |

Nenhuma largura corta conteúdo (`header.left ≥ 0` e `header.right ≤ innerWidth` em todas); `scrollWidth == innerWidth` em todas.

## 2. Contraste (tokens novos em `globals.css`)

- `--primary-text: #FF4A4F` — texto vermelho pequeno (kickers, labels, links).
- `--primary-btn: #E60107` — fundo de botão com rótulo branco pequeno.
- `#F90108` permanece em títulos grandes, superfícies (`bg-primary/10`, barra de progresso) e símbolo da marca.

| Caso | Antes | Depois (medido no browser) |
|---|---|---|
| Kicker Serviços (11px, shimmer base) | 4.17:1 | **5.26:1** (`#ff4a4f` confirmado no CSS var) |
| Kicker Sobre (10px, shimmer base) | 4.17:1 | **5.26:1** |
| Kicker Resultados (11px, sobre card) | 3.86:1 | **4.86:1** |
| Kicker Mentoria (12px) | 4.17:1 | **5.26:1** |
| Público-alvo Mentoria (10px, card) | 3.86:1 | **4.86:1** |
| Kicker FAQ (12px) | 4.17:1 | **5.26:1** |
| Badge "DESENVOLVIDO COM IA" (Cases) | 3.86:1 e **8.8px** | **4.86:1** vs card (4.66:1 com o tint `primary/10`) e **10px** |
| Link chatspx.com.br (Cases, 12px) | 3.86:1 | **4.86:1** |
| "ETAPA 1 DE 6" (/diagnostico, 11px) | 3.86:1 | **4.86:1** (`rgb(255,74,79)` medido) |
| "17%" (/diagnostico, 11px) | 4.17:1 | **5.26:1** |
| "Criar conta" (/login, 13px) | 3.86:1 | **4.86:1** |
| E-mails (/privacidade, 15px) | 4.17:1 | **5.26:1** |
| Números de seção legais (12px) | 4.17:1 | **5.26:1** |
| "FEITO EM MATO GROSSO" + copyright + CNPJ (10px) | 2.4–4.2:1 (`#888` a 55–80%) | **5.33:1** (`#888` cheio sobre `#111`) |
| Botões primários (branco 12–14px sobre vermelho) | 4.13–4.17:1 | **4.76:1** (`rgb(230,1,7)` medido em hero, login, diagnóstico, checkout, CTA final) |
| CTA da navbar (gradiente) | 4.13:1 | gradiente inicia em `rgb(230,1,7)` → **4.76:1** no ponto mais claro; base `#B02428` = 6.7:1 |

Todos os casos ≥ 4.5:1. Páginas 404/erro e caixas de erro de login/redefinir-senha receberam os mesmos tokens.

## 3. Alvos de toque @375 (medidos)

| Alvo | Antes | Depois |
|---|---|---|
| Hambúrguer | 32×32 | **44×44** (margens negativas preservam a altura da pill) |
| Links do menu mobile | 293×24 | **293×44** (todos os 5) |
| CTA "Agendar Diagnóstico" no menu mobile | ~32 | **293×44** |
| CTAs do hero (ambos) | 40px | **44px** (`Button size lg` h-10→h-11, vale também para "Entrar" do login: **44px**) |
| Links do footer (nav, legal, e-mail) | ~20px | **28px** (secundários, ≥24 ✔) |
| "Esqueceu a senha?" (/login) | 119×20 | **36px** |
| "Criar conta" (/login) | 70×20 | **36px** |
| "← Voltar ao site" (/login) | 245×20 | **36px** |
| "VOLTAR AO SITE" (/diagnostico e /privacidade) | 128×**17** (abaixo do mínimo WCAG) | **33px** |
| Botão "PRÓXIMO" (/diagnostico) | — | **44px** |
| Opções do dropdown de idioma | 36px | py 8→10px (~40px, item de polimento) |

## 4. Checkout com slug inválido

`/checkout/produto-que-nao-existe`: **permanece na URL** (sem `router.replace("/")`), exibe card "Produto não encontrado" com explicação e CTAs "Agendar Diagnóstico" (/diagnostico) e "Voltar para a home". `stillLoading: false`. Evidência: `pos-fix/pos-checkout-invalido.png`.

## 5. Quote no mobile

- @375: seção **1334px → 934px** (140vh; texto pinado o tempo todo, reveal no último trecho).
- @1440: 1800px (inalterado — o item era mobile; desktop mantém o ritmo aprovado).

## 6. Overflow horizontal

`scrollWidth == innerWidth` nas **40 combinações** (home, /diagnostico, /login, /privacidade, /termos × 320/375/414/768/820/1024/1280/1440) + nas 7 larguras da bateria da navbar. **Zero overflow.**

## 7. Polimento aplicado

- h2 da seção Problema agora em `font-serif` como as demais.
- Ritmo vertical padronizado: Problema/Mentoria/FAQ em `py-24 sm:py-28 lg:py-32`.
- Avatares da Mentoria: sobreposição -16px → -8px (iniciais não cortam mais); círculo "+50" em `#E60107` (branco 12px a 4.76:1).
- Sobre @1440: colunas esticam juntas — bottom esquerda 2023px = bottom direita 2023px (**gap 0**, antes ~200px de vazio).

## 8. Não-regressão (verificado em runtime)

- Preloader intacto (arquivo não tocado): presente no load, animação aprovada rodando, **liberou em 4,6s** no headless sem GPU (failsafe CSS `spx-preloader-failsafe` ativo, `WAIT_FOR_SCENE=false`, `USE_POSTER=true` confirmados por leitura).
- `spline-scene.tsx` não tocado.
- Cursor pointer nos clicáveis (medido: `cursor: pointer` no hambúrguer via regra global do `globals.css`).
- Zero travessão (—) em texto visível da home.
- Favicon, logo e textos aprovados: sem alteração.

## Arquivos alterados (26)

`app/globals.css` (tokens) · `components/ui/navbar.tsx` · `components/ui/button.tsx` · `components/ui/text-reveal.tsx` · `components/ui/avatar-circles.tsx` · `components/language-switcher.tsx` · `components/legal/legal-shell.tsx` · seções: `hero`, `sobre`, `servicos`, `resultados`, `mentoria`, `faq`, `problema`, `cases`, `cta-final`, `produtos`, `footer` · páginas: `checkout/[slug]`, `login`, `redefinir-senha`, `diagnostico`, `privacidade`, `termos`, `not-found`, `error`.

Nada foi commitado, conforme instruído.
