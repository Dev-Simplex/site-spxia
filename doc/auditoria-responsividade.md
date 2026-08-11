# Auditoria de Responsividade e Qualidade Visual — Site SPXIA

**Data:** 2026-08-10 · **Método:** medição real no browser (Playwright + Chromium headless), build de produção (`pnpm build` + `next start` na porta 3210). Larguras testadas: **320, 375, 414, 768, 1024, 1280, 1440** px, nas páginas **home, /diagnostico, /login, /privacidade** (28 combinações), mais testes de interação (menu mobile, dropdown de idioma, FAQ, foco por teclado, /admin, /checkout). Evidências em `doc/auditoria-evidencias/*.png`.

> Nota: a auditoria rodou enquanto outro worker editava textos das seções. As duas primeiras baterias usaram builds diferentes; as métricas de layout foram idênticas entre elas.

---

## Resumo executivo

O site está **estruturalmente sólido**: zero overflow horizontal em todas as 28 combinações página×largura, hero legível até 320px, menu mobile e i18n funcionando, nenhum elemento interativo sem nome acessível. O único problema que **quebra layout de verdade** é a navbar desktop entre 640 e ~880px. O restante são ajustes de contraste, alvos de toque e polimento de consistência.

---

## CRÍTICO (quebra layout / impede uso)

### 1. Navbar desktop estoura o viewport entre 640px e ~880px
- **Seção:** Navbar (pill fixa) · **Larguras:** 640–880px (inclui tablet retrato 768)
- **Medição:** a pill muda de hambúrguer para versão desktop no breakpoint `sm` (640px), mas o conteúdo dela tem **865px de largura fixa**. Medido: em 768px → `left: -48px, right: 816px` (48px cortados de cada lado — o logo some pela esquerda e o botão "Agendar Diagnóstico" é cortado pela direita); em 640px → `left: -112px` (o logo e o botão ficam mais da metade fora da tela). Só cabe a partir de ~897px. Como a header é `position: fixed`, isso **não** gera scrollbar — o conteúdo é simplesmente cortado, sem como acessar. Evidência: `navbar-768.png`.
- **Correção sugerida:** manter o menu hambúrguer até `lg` (1024px) — trocar os prefixos `sm:` da navbar por `lg:` — ou comprimir a pill no intervalo (ocultar seletor de idioma/Fale Conosco em `md`).

---

## IMPORTANTE (feio, confuso ou barreira real)

### 2. Cortina de carregamento pode segurar o site por até ~13,5s
- **Seção:** SitePreloader (todas as páginas) · **Larguras:** todas
- **Medição:** com a cena Spline lenta (headless sem GPU, análogo a máquina fraca/rede lenta), a cortina só liberou a página **13,5s** após o load (scene-timeout 10s + failsafe 12s + animação de saída). Durante esse tempo nada é clicável.
- **Correção sugerida:** reduzir o failsafe/scene-timeout (ex.: 5–6s) ou abrir a cortina no `load` usando poster estático do robô como fallback.

### 3. Texto pequeno em vermelho #F90108 fica abaixo do contraste AA
- **Seções:** kickers de Serviços/Resultados/Mentoria, "ETAPA X DE 6" e "17%" (/diagnostico), "Criar conta" (/login), e-mails `sup@` (/privacidade), badge "DESENVOLVIDO COM IA" (Cases), "FEITO EM MATO GROSSO" (footer) · **Larguras:** todas
- **Medição:** #F90108 sobre #1A1A1A = **4.17:1**; sobre #212121 (bg-card) = **3.86:1** — mínimo AA para texto pequeno é 4.5:1. Todos os casos citados têm 8.8–15px.
- **Correção sugerida:** usar um tom mais claro (ex.: #FF4A4F) para texto vermelho pequeno, reservando #F90108 para títulos grandes e superfícies.

### 4. Botões primários: branco sobre vermelho a 4.13:1
- **Seções:** hero ("Nossos Serviços"), /diagnostico ("PRÓXIMO"), /login ("Entrar") · **Larguras:** todas
- **Medição:** texto #FEFEFE de 12–14px sobre o gradiente #F90108→#B02428 = **4.13:1** (< 4.5 exigido para esse tamanho).
- **Correção sugerida:** escurecer levemente o vermelho do botão (ex.: base #D90107) ou subir o rótulo para ≥19px bold (aí o mínimo cai para 3.0).

### 5. Alvos de toque abaixo de 44px no mobile
- **Seções/medições (@375):** hambúrguer **32×32**; links do menu mobile aberto **293×24** (gap 16px); links do footer **~20px** de altura; /login "Esqueceu a senha?" **119×20**, "Criar conta" **70×20**, "← Voltar ao site" **245×20**; "VOLTAR AO SITE" (/diagnostico e /privacidade) **128×17**; CTAs do hero **40px** de altura.
- Cumprem o mínimo WCAG 2.5.8 (24px) quase todos, mas ficam bem abaixo da diretriz de 44px de iOS/Android para alvos primários — e o link de 17px fica abaixo até do mínimo.
- **Correção sugerida:** aumentar padding vertical (`py`) para altura efetiva ≥44px nos alvos primários (hambúrguer, menu mobile, CTAs) e ≥24px nos secundários.

### 6. Checkout com slug inválido: "Carregando..." e redirect silencioso
- **Página:** /checkout/[slug] · **Larguras:** todas
- **Medição:** `/checkout/produto-teste` exibe "Carregando..." por vários segundos e depois redireciona para a home sem explicação (`router.replace("/")` em `app/checkout/[slug]/page.tsx:98`).
- **Correção sugerida:** estado "produto não encontrado" com CTA para /diagnostico ou home.

### 7. Seção Quote no mobile: ~1000px de rolagem quase vazia
- **Seção:** Quote · **Larguras:** < 640 principalmente
- **Medição:** @375 a seção mede **1334px** de altura e o texto (efeito scroll-reveal) só ocupa o terço final — o usuário atravessa ~2 telas escuras praticamente vazias. @1440 são 1800px. Evidência: `sec-quote-375.png`.
- **Correção sugerida:** encurtar a área de reveal no mobile (ex.: metade da altura) ou desativar o efeito abaixo de `md`.

---

## POLIMENTO (nice to have)

### 8. Headline da seção Problema foge do sistema tipográfico
- O h2 de Problema usa **sans-serif bold** (`text-3xl font-bold`, `problema.tsx:205`); todas as outras seções usam `font-serif`. Visível em `sec-problema-375.png`. Sugestão: adicionar `font-serif` (removendo `font-bold`).

### 9. Ritmo vertical desktop varia sem padrão
- Padding vertical medido @1440: Problema/Mentoria/FAQ = **96px** fixos; Sobre/Serviços/Cases/Resultados/CTA = **128px**; marquee 64px (ok, é uma faixa). No mobile todos convergem para 96px — consistente. Sugestão: adotar a escala responsiva `py-24 sm:py-28 lg:py-32` também em Problema, Mentoria e FAQ.

### 10. Sistema de kickers inconsistente
- Tamanho alterna 10px/11px, cor alterna vermelho/cinza e o tracking varia entre .1em, .14em, .15em e .16em conforme a seção. O h2 também alterna teto de `text-4xl` (Sobre/Cases/FAQ/Como Funciona) e `text-6xl` (Serviços/Resultados). Sugestão: fixar um único par kicker+h2 e aplicar em todas.

### 11. Badge "DESENVOLVIDO COM IA" com fonte de 8.8px
- `text-[0.55rem]` em `cases.tsx:262` — ilegível no mobile e abaixo do contraste (item 3). Sugestão: mínimo 10px.

### 12. Iniciais dos avatares da Mentoria cortadas
- Na faixa "+50 EMPRESAS ATENDIDAS", a sobreposição dos círculos corta as iniciais (`sec-mentoria-1440.png`). Sugestão: reduzir a sobreposição ou usar só círculos vazios + contador.

### 13. Sobre @1440: vazio no canto inferior direito
- O mock de dashboard termina ~200px abaixo dos 4 cards da coluna direita, deixando um retângulo morto (`sec-sobre-1440.png`). Sugestão: esticar os cards (`h-full`) ou reposicionar o mock.

### 14. Opções do dropdown de idioma com 36px de altura
- Funciona bem, mas 214×36 fica abaixo dos 44px ideais para toque.

---

## O que está BOM (verificado, não presumido)

- **Zero overflow horizontal** nas 28 combinações (`document.documentElement.scrollWidth == innerWidth` em todas). Nenhum elemento vazando de container.
- **Hero em 320px:** título 44px legível, robô Spline atenuado por overlay `bg-black/70`, texto nunca é "engolido" (`hero-320.png`). CTAs empilhados sem corte.
- **Menu hambúrguer funciona**, o **dropdown de idioma dentro dele abre dentro do viewport** (bandeiras + check) e a **troca PT→EN traduz a página de verdade** (h1 verificado em inglês). Evidência: `menu-lang-375.png`.
- **FAQ acessível:** `aria-expanded` alterna corretamente, abre no clique e os triggers recebem foco visível (outline padrão do browser).
- **Foco por teclado:** links/botões do header mostram outline; CTAs de hero/contato trocam o box-shadow no focus (anel presente).
- **Nenhum botão/link sem nome acessível** em nenhuma página testada (varredura de aria-label/texto/alt = 0 ocorrências).
- **Nenhuma imagem ou canvas deformado** (proporção natural × renderizada verificada em todas as larguras). Nenhum erro de JS de página registrado.
- **Alternância de fundo consistente:** #050505 (hero) → alternância regular #1A1A1A/#212121 até o footer #111.
- **Tipografia geral premium:** serif nos títulos com itálico vermelho, corpo Inter, mono para kickers — coeso nas seções principais (Serviços, Cases, Resultados, Como Funciona, CTA e Footer estão à altura de consultoria premium).
- **/login, /diagnostico e /privacidade:** sem overflow em nenhuma largura; formulário do diagnóstico bem resolvido em 320px (inputs 42px, grid quebra correto).
- **Produtos** corretamente oculta com `NEXT_PUBLIC_SHOW_PRODUCTS=false`.
- **/admin sem sessão** redireciona para /login como esperado.

---

## Cobertura e limitações

- **Admin não auditado no browser:** exige login Supabase e não há credencial de teste no vault. Análise estática: a tabela do Financeiro tem wrapper `overflow-x: auto` (`admin.css:803`), a filter-bar rola horizontal em telas estreitas (`admin.css:1688`) e a sidebar é off-canvas abaixo de 1024px — padrões corretos, mas sem medição real. Recomendo repetir a bateria autenticada quando houver usuário de teste.
- **Checkout com slug válido não testado** (depende de produto real no Supabase); só o fluxo de slug inválido foi coberto.
- Screenshot da Quote @1440 falhou por timeout (seção de 1800px com sticky) — medições numéricas foram coletadas normalmente.
