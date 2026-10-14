# QA final do rebrand SPXia

Feito em 2026-10-14 no servidor de produção (`pnpm start -p 3215`, build da branch `rebrand-spxia`). As verificações rodaram com Playwright (Chromium 1243) e script no navegador. Nada foi conferido só a olho.

- **Páginas:** `/`, `/diagnostico`, `/login`, `/redefinir-senha`, `/privacidade`, `/termos`, `/checkout/slug-que-nao-existe`, `/rota-que-nao-existe-qa` (404) e `/admin`.
- **Larguras:** 390, 768, 1024, 1366, 1440 e 1920. São 54 combinações.
- **Prints de página inteira:** `C:\Users\walis\orca\spxia-rebrand-assets\prints\qa-final\<pagina>-<largura>.png`. Os mesmos prints foram refeitos depois do build com as correções (a home de novo depois do build final).
- **Prints por seção** (home, 1440 e 390): `prints\qa-final\secoes\`.
- **Prints de interação:** `faq-teclado-1366.png`, `menu-mobile-aberto-390.png` e `ajuste-*-1440.png`.
- **Dados brutos:** `prints\qa-final-all.json` e `prints\qa-final-interacoes.json` (depois das correções), mais as versões `*-antes.json`.
- **Lighthouse:** `relatorios\lighthouse-{mobile,desktop}-{antes,depois}.html`.
- **Scripts:** `spxia-rebrand-assets\qa-tools\` (`qa.mjs`, `interacoes.mjs`, `lh.mjs`, `secoes.mjs`, `ajustes.mjs`), fora do repo.

## Resultado por verificação (depois das correções)

| # | Verificação | Resultado |
|---|---|---|
| 1 | Console, hidratação, 404, Spline | Nenhum erro de JS nem aviso de hidratação nas 54 combinações. Nenhuma requisição a `prod.spline.design`. Nenhum recurso com 404. O único 404 é o próprio documento da rota inexistente, que é o esperado. O único aviso é o do reCAPTCHA (M3). O único erro é o DNS do Supabase no checkout (C1). |
| 2 | Travessão e marca antiga | 0 ocorrências de "—" ou "–" no texto visível, no `<title>`, na meta description, em `og:*`, `alt`, `aria-label`, `placeholder` e `title`. 0 ocorrências de "SPXIA", "SPX IA" ou "Intelligence and Automation". 0 elementos com `#F90108` ou `#ED3237`, e o HTML também não tem esses hex. No admin havia "SPXIA" visível, já corrigido (A2). |
| 3 | Contraste | 0 textos abaixo de 4,5:1 (ou 3:1 se grande) nas 54 combinações. O fundo real foi calculado compondo os ancestrais. |
| 4 | Estouro, menu e rosto | `scrollWidth` = `clientWidth` em todas as combinações. O menu mobile abre (`aria-expanded=true`, rótulo "Fechar menu"), fecha no X, no Esc e ao tocar num link, e não estoura aberto. Rosto do hero (zona x 25 a 79 %, y 0 a 40 % da foto): livre em 390, 768, 1024, 1366, 1440 e 1920, sem nada por cima e sem corte pela seção. |
| 5 | Teclado | Na home em 1366, o Tab passa por 41 paradas (links, botões, idiomas e as 9 perguntas do FAQ) e todas têm foco visível (`outline`). No FAQ, Enter abre e Espaço fecha e reabre (`aria-expanded` alterna). |
| 6 | Movimento | **Com reduced motion** (390 e 1440): nenhum transform muda com o tempo nem com a rolagem e nenhuma animação CSS/WAAPI roda. Depois de rolar a página, todo o conteúdo fica visível; a única exceção é a forma decorativa do FAQ, com `opacity: 0.15` de propósito. **Sem emulação:** as revelações P1 estão ativas (110 a 116 blocos começam ocultos e entram ao rolar). O parallax P2 aparece em hero, sobre e problema só a partir de `md` (18 transforms ligados à rolagem em 1440, nenhum em 390). A linha do tempo P6 preenche e o sticky P3 do Como funciona está ativo. |
| 7 | Lighthouse | Veja a tabela abaixo. Depois das correções, tudo ficou ≥ 96. |
| 8 | Visual | Segue o mockup: hero com a pessoa sobre a forma verde e os dois cards, faixa de canais, bento de Soluções, Como funciona com 4 passos, frase da marca com os mascotes, CTA azul com card de agendamento e rodapé Azul Profundo. Nenhuma estatística voltou. Pontos de texto em M4 a M6 e B1. |

## Problemas

### Crítico

| Problema | Página/largura | Evidência | Corrigido? |
|---|---|---|---|
| C1. O Supabase do `.env.local` não existe: `tdthuluyohqtmdhegjhf.supabase.co` dá NXDOMAIN (`nslookup` no 8.8.8.8). O checkout falha com `net::ERR_NAME_NOT_RESOLVED`. Login, redefinir senha, envio do diagnóstico e admin dependem do mesmo projeto. É problema de ambiente, anterior ao rebrand. | `/checkout/*`, todas as larguras (e todo fluxo com Supabase) | `qa-final-all.json` → `failed`: `https://tdthuluyohqtmdhegjhf.supabase.co/rest/v1/products?...` | **Não.** Falta a URL e a chave anon do projeto Supabase certo. O ajuste é só no `.env.local` (e nas variáveis da hospedagem), sem mudança de código. |

### Alto

| Problema | Página/largura | Evidência | Corrigido? |
|---|---|---|---|
| A1. `aria-orientation="vertical"` num `div` sem papel ARIA, no FAQ (WCAG 4.1.2). Era a única falha de acessibilidade do Lighthouse. | `/`, todas | Lighthouse `aria-allowed-attr` = 0. Acessibilidade 94 (mobile e desktop). | **Sim.** O atributo saiu de `components/ui/accordion-animated.tsx` e a acessibilidade foi para 100. |
| A2. Marca antiga em texto visível: "Bem-vindo à área de membros SPXIA." | `/admin` (logado) | `app/admin/page.tsx:81` | **Sim.** Agora é "SPXia". |

### Médio

| Problema | Página/largura | Evidência | Corrigido? |
|---|---|---|---|
| M1. Imagens sem otimização (`images.unoptimized: true` no `next.config.mjs`). A LCP mobile é `hero-pessoa.png` (395 KB, PNG) e não tem `fetchpriority="high"` (só o `preload`). `ilustracao-fio-embolado.png` tem 763 KB e aparece com 497 px; `ilustracao-crm.png` tem 1,09 MB. | `/`, mobile | Lighthouse `image-delivery-insight`: economia de 1.429 KiB (mobile) e 2.232 KiB (desktop); `lcp-discovery-insight` falha em `priorityHinted`. A performance mobile oscilou entre 84 e 96 entre execuções. | Não (só registro). Sugestão: exportar as fotos e ilustrações em WebP/AVIF no dobro do tamanho exibido, ou ligar a otimização do `next/image` se a hospedagem permitir. |
| M2. `<title>` genérico: várias páginas usam o título da home, "SPXia \| Sua rotina pode ser mais simples", e não o formato "Página \| SPXia" (decisão 14). | `/diagnostico`, `/login`, `/redefinir-senha`, 404, `/admin`→login | `qa-final-all.json` → `head.title` | Não (só registro). |
| M3. Aviso no console: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY não configurada". É um `console.warn` em nível de módulo em `app/diagnostico/page.tsx:26`. Ele aparece também na home, porque o `Link` para `/diagnostico` pré-carrega o módulo. | `/` e `/diagnostico`, todas | `qa-final-all.json` → `console` | Não (ambiente). Some quando a chave do reCAPTCHA for preenchida. |
| M4. Projetos (Cases) é a seção com mais texto. São 5 cards, cada um com pílula, título, frase e 2 ou 3 benefícios (cerca de 13 blocos de texto), e um único visual (a foto). A decisão 8 pede "card: título + ≤ 12 palavras". | `/`, todas | `prints/qa-final/secoes/1440-cases-6.png` | Não (só registro). Sugestão: 3 cases com mini-conversa por cliente (padrão Blip do REFERENCIAS) ou só título e um benefício por card. |
| M5. O FAQ abre com a primeira pergunta expandida (resposta de cerca de 50 palavras, com "24 horas" e "30 minutos"). O PLANO pede "O FAQ continua, recolhido". | `/`, todas | `prints/qa-final/secoes/1440-faq-9.png` | Não (só registro). |
| M6. Soluções mantém a linha "Também fazemos: sistemas sob medida · treinamento de equipes · assessoria contínua". A decisão 8 proíbe "também fazemos", mas o mockup aprovado (`sec-solucoes.png`) tem a linha. Fica para o usuário decidir. | `/`, todas | `components/sections/servicos.tsx` (`also`, `alsoItems`) | Não (conflito entre PLANO e mockup). |

### Baixo

| Problema | Página/largura | Evidência | Corrigido? |
|---|---|---|---|
| B1. Números de prazo no texto: "24 horas" e "30 minutos" no FAQ, "Em 30 minutos" e "30 minutos" na CTA. Não são estatísticas; os números de interface ("3 quartos", "10h", horários) são parte das telas. | `/` | `faq.tsx`, `cta-final.tsx` | Não (só registro). |
| B2. Os botões do acordeão do FAQ não têm `aria-controls` ligando ao painel. O `aria-expanded` funciona. | `/` | `qa-final-interacoes.json` → `faq.panelVisible: "sem aria-controls"` | Não (só registro). |
| B3. Com reduced motion, o conteúdo abaixo da dobra só aparece por fade ao entrar na tela (cerca de 110 blocos começam com `opacity: 0`). Isso segue o REFERENCIAS ("vira só fade"), e nada fica escondido depois de rolar. | `/` | `qa-final-interacoes.json` → `motion[].hiddenAtStart` | Não (comportamento previsto). |
| B4. Ao navegar com Tab, 5 paradas recebem foco enquanto o elemento ainda está entrando (opacidade < 0,5 nos primeiros 60 ms do fade de 0,6 s). | `/`, 1366 | `qa-final-interacoes.json` → `keyboard.invisiveis` | Não (só registro). |
| B5. Check branco sobre o Verde Pulso (pedido do usuário) dá 2,3:1, abaixo dos 3:1 da WCAG 1.4.11 para gráficos. Fica aceitável porque o check é decorativo (`aria-hidden`) e repete o texto ao lado. | hero, Soluções (VoxIA), Projetos | `ajuste-check-*-1440.png` | Não (decisão do usuário). |
| B6. `lib/i18n/pt.ts` e `en.ts` ainda guardam textos antigos com "SPXIA" (chaves `sobre`, `problema`, `mentoria` etc.) que nenhum componente usa mais. É código morto e não aparece na tela. | n/a | `grep SPXIA lib/i18n` | Não (só registro). Remover numa limpeza. |

## Ajustes pedidos pelo usuário durante o QA

1. **Check branco nos círculos verdes.** O check passou de Azul Profundo para branco, com traço 3,5. Mudou em três lugares: card "Visita agendada" do hero (`hero.tsx`), selo "Cliente respondido na hora" de Projetos (`cases.tsx`) e os três itens do checklist da VoxIA (`servicos.tsx`). Não há outros círculos verdes com ícone: o sucesso do checkout usa verde a 15 % com check azul. Onde há texto sobre o verde (horário selecionado na CTA, pílula "IA ativa"), o texto continua Azul Profundo. Medido no navegador: os 5 checks em `rgb(255, 255, 255)`.
2. **WhatsApp azul.** Na faixa de canais, o ícone do WhatsApp agora usa `text-primary`, como os outros (`rgb(0, 31, 218)`). O token `--whatsapp` / `--color-whatsapp` saiu de `app/globals.css` e não sobrou nenhum uso. O comentário de `components/icons/brand.tsx` agora diz que o ícone segue `currentColor`.

## Lighthouse da home

Pacote `lighthouse` do npm com o Chrome em modo headless, em `http://localhost:3215/`, presets padrão mobile e desktop.

| Modo | Momento | Performance | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile | antes | 84 | 94 | 100 | 100 | 3,3 s | 360 ms | 0 |
| Mobile | depois | 96 | 100 | 100 | 100 | 2,6 s | 110 ms | 0 |
| Desktop | antes | 100 | 94 | 100 | 100 | 0,6 s | 0 ms | 0 |
| Desktop | depois | 100 | 100 | 100 | 100 | 0,6 s | 0 ms | 0 |

O que ficou abaixo de 90 foi investigado:

- **Acessibilidade 94:** a causa era só o A1, já corrigido.
- **Performance mobile 84:** as correções não mexeram em performance. A diferença para 96 é variação entre execuções (TBT de 360 ms contra 110 ms, com a máquina mais carregada na primeira). O risco que sobra é a imagem da LCP, com 395 KB em PNG sem otimização (M1).

Alertas que continuam, sem afetar a nota: JS não usado (cerca de 70 KiB), 12 KiB de polyfills legados e CSS de 14 KB bloqueando a renderização.

## Arquivos alterados

- `components/ui/accordion-animated.tsx`: tirei o `aria-orientation` inválido (A1).
- `app/admin/page.tsx`: "SPXIA" virou "SPXia" (A2).
- `components/sections/hero.tsx`: check branco no card "Visita agendada".
- `components/sections/cases.tsx`: check branco no selo verde.
- `components/sections/servicos.tsx`: check branco no checklist da VoxIA.
- `components/sections/tech-marquee.tsx`: ícone do WhatsApp em `text-primary`.
- `components/icons/brand.tsx`: comentário do ícone atualizado.
- `app/globals.css`: saiu o token `--whatsapp` / `--color-whatsapp`.
- `doc/rebrand/QA.md`: este relatório.

`pnpm exec tsc --noEmit` passou limpo. `pnpm build` ficou verde depois de todas as correções (23 páginas) e o servidor de produção foi reiniciado no mesmo terminal (`pnpm start -p 3215`, "Ready"). Não houve commit.
