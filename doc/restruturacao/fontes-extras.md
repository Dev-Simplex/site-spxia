# Fontes extras de componentes para a reconstrução do SPX IA

**Data dos testes:** 2026-08-07  
**Escopo:** fontes além das já registradas em `COMPONENTES-API.md`, para o template Next.js 14 +
Tailwind 4 + shadcn + framer-motion. Nenhum pacote foi instalado e nenhum código do site foi alterado.

## 1. Como a validação foi feita

Cada URL candidata passou pelos três testes de `COMPONENTES-API.md`:

1. download com `curl -sL`, guardando o status HTTP;
2. inspeção do início do corpo para rejeitar `<!DOCTYPE>`/`<html>` e, nos registries, parse do JSON;
3. conferência do tamanho: arquivos de componente devem ter poucos KB ou dezenas de KB; índices podem ser
   maiores, mas precisam continuar sendo JSON real.

Nos resultados abaixo, **JSON** significa que o corpo passou no parse; **TSX** significa texto-fonte real,
sem HTML. A licença foi lida no arquivo `LICENSE`/`LICENSE.md` do repositório, e não inferida do README ou do
rodapé do site.

## 2. Resumo executivo

| Fonte extra | Forma de acesso validada | Índice utilizável | Licença lida | Veredito |
|---|---|---|---|---|
| Eldora UI | `eldoraui.site/r/<nome>.json` | `eldoraui.site/registry.json` | MIT | **Usar** |
| SmoothUI | `smoothui.dev/r/<nome>.json` | `/r/registry.json` e `/api/v1/blocks` | MIT | **Melhor fonte nova de seções inteiras** |
| Fancy Components | `fancycomponents.dev/r/<nome>.json` | árvore do repo via jsDelivr | MIT | **Usar para efeitos/blocos** |
| UI Layouts | `www.ui-layouts.com/r/<nome>.json` | árvore do repo via jsDelivr | MIT | **Usar** |
| Spectrum UI | `ui.spectrumhq.in/r/<nome>.json` | `/r/registry.json` | Apache-2.0 | **Usar; o domínio correto mudou** |
| React Bits | `reactbits.dev/r/<Nome>-TS-TW.json` | `/r/registry.json` | MIT + Commons Clause | Usar em produto final, sem redistribuir os componentes |
| Shadcnblocks gratuitos | `shadcnblocks.com/r/<nome>.json` | repo público/`/blocks/free` | MIT + Commons Clause | Usar em produto final, com a mesma ressalva |
| Origin UI atual (Coss) | raw do repo `cosscom/coss` | `apps/origin/registry.json` | MIT | **Usar pelo raw; URL antiga morreu** |
| Animata | raw TSX do GitHub | árvore do repo via jsDelivr | MIT | Usar como fonte copy/paste; não há registry JSON público confiável |
| SyntaxUI | raw TSX do GitHub | árvore do repo via jsDelivr | MIT | Usar como fonte de blocos; não há registry JSON público |
| Skiper UI | raw JSON do repo legado | árvore do repo via jsDelivr | MIT | Usar somente pelo raw; os hosts não servem o registry |
| Berlix | raw JSON do GitHub | árvore do repo via jsDelivr | **sem LICENSE** | Tecnicamente acessível, juridicamente evitar |
| BG.IBELICK | raw TSX do GitHub | um arquivo com 22 opções | **sem LICENSE** | Só referência visual; evitar copiar em cliente |
| Tailark | primitivo `button` funciona; blocos retornam 401 | não há índice aberto | não há repo público com LICENSE dos blocos | **Não serve para seções grátis** |
| `ui.hover.dev` | host não respondeu | não localizado | não verificável | **Não usar** |

## 3. Registries JSON que funcionam

### 3.1 Eldora UI

- **Padrão:** `https://eldoraui.site/r/<nome>.json`
- **Índice real:** [`https://eldoraui.site/registry.json`](https://eldoraui.site/registry.json) — HTTP 200,
  51.549 B, JSON, 115 itens. Atenção: `/r/index.json` tem só 315 B e é um item de estilo, não o catálogo.
- **Como listar:** baixar `registry.json` e percorrer `items[].name`/`items[].categories`.
- **Licença:** [MIT no `LICENSE.md`](https://raw.githubusercontent.com/karthikmudunuri/eldoraui/main/LICENSE.md)
  — HTTP 200, 1.086 B.

Exemplos úteis, todos shadcn-compatible:

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`pricing-01`](https://eldoraui.site/r/pricing-01.json) | pricing completo com animação | 200 · 11.734 B · JSON |
| [`features-01`](https://eldoraui.site/r/features-01.json) | features com accordion e carrossel de imagem | 200 · 16.044 B · JSON |
| [`testimonal-02`](https://eldoraui.site/r/testimonal-02.json) | depoimentos em marquee | 200 · 11.311 B · JSON |

Há também `logo-cloud-03`, `marquee`, `testimonal-01/03` e quatro logo clouds. A grafia
`testimonal` (sem o segundo “i”) é a usada pelo registry. Os blocos recentes importam `motion/react`; no
template SPX IA será preciso adaptar para `framer-motion` ou decidir padronizar no pacote `motion`.

### 3.2 SmoothUI

- **Padrão:** `https://smoothui.dev/r/<nome>.json`
- **Índice completo:** [`https://smoothui.dev/r/registry.json`](https://smoothui.dev/r/registry.json) — HTTP
  200, 1.426.127 B, JSON, 178 itens. É grande porque embute o conteúdo de todos os arquivos.
- **Índice específico de blocos:**
  [`https://smoothui.dev/api/v1/blocks?pageSize=100`](https://smoothui.dev/api/v1/blocks?pageSize=100) —
  HTTP 200, 22.355 B, JSON, 34 blocos. Aceita filtros como `?blockType=pricing` e paginação.
- **Licença:** [MIT no `LICENSE`](https://raw.githubusercontent.com/educlopez/smoothui/main/LICENSE) — HTTP
  200, 1.070 B.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`pricing-1`](https://smoothui.dev/r/pricing-1.json) | seção de preço pronta | 200 · 11.116 B · JSON |
| [`faq-1`](https://smoothui.dev/r/faq-1.json) | FAQ em grid/tabs | 200 · 9.683 B · JSON |
| [`testimonials-1`](https://smoothui.dev/r/testimonials-1.json) | cards de depoimentos com rotação | 200 · 7.415 B · JSON |

É a descoberta mais útil para o SPX IA: o catálogo também inclui `features-1/2/3`, `logo-cloud-1..4`,
`pricing-1..3`, `stats-1/2`, `testimonials-1..3` e quatro FAQs, todos já modelados como blocos.

### 3.3 Fancy Components

- **Padrão:** `https://fancycomponents.dev/r/<nome>.json`
- **Índice:** não há endpoint (`/registry.json` e `/r/index.json` deram 404 com HTML). Liste a árvore em
  [`data.jsdelivr.com/v1/package/gh/danielpetho/fancy@main/flat`](https://data.jsdelivr.com/v1/package/gh/danielpetho/fancy@main/flat)
  e filtre `src/fancy/components/`; foram encontrados 45 arquivos TSX.
- **Licença:** [MIT no `LICENSE`](https://raw.githubusercontent.com/danielpetho/fancy/main/LICENSE) — HTTP
  200, 1.069 B.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`simple-marquee`](https://fancycomponents.dev/r/simple-marquee.json) | logos/depoimentos em marquee | 200 · 10.118 B · JSON |
| [`stacking-cards`](https://fancycomponents.dev/r/stacking-cards.json) | cards de features empilhados no scroll | 200 · 2.928 B · JSON |
| [`basic-number-ticker`](https://fancycomponents.dev/r/basic-number-ticker.json) | números de resultados/stats | 200 · 3.228 B · JSON |

### 3.4 UI Layouts

- **Padrão:** `https://www.ui-layouts.com/r/<nome>.json`
- **Índice:** `/r/index.json` e `/registry.json` dão 404/HTML. Liste a árvore em
  [`data.jsdelivr.com/v1/package/gh/ui-layouts/uilayouts@main/flat`](https://data.jsdelivr.com/v1/package/gh/ui-layouts/uilayouts@main/flat)
  e filtre `apps/ui-layout/registry/components/`; foram encontrados 166 TSX.
- **Licença:** [MIT no `LICENSE`](https://raw.githubusercontent.com/ui-layouts/uilayouts/main/LICENSE) —
  HTTP 200, 1.066 B.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`faq-accordion`](https://www.ui-layouts.com/r/faq-accordion.json) | FAQ animado com imagem | 200 · 11.062 B · JSON |
| [`logos-marquee`](https://www.ui-layouts.com/r/logos-marquee.json) | logo cloud contínuo | 200 · 3.311 B · JSON |
| [`timeline-animation`](https://www.ui-layouts.com/r/timeline-animation.json) | entrada sequencial dos passos | 200 · 1.837 B · JSON |

O site omite o `www` em alguns links, mas os dois hosts redirecionam corretamente. Para descobrir o slug
exato, o MDX oficial também é útil: os exemplos usam `<ComponentCodePreview name='...'>`.

### 3.5 Spectrum UI — domínio atual

O candidato `spectrumui.com` não respondeu, mas o projeto oficial ativo está em
[`ui.spectrumhq.in`](https://ui.spectrumhq.in) e no repo
[`arihantcodes/spectrum-ui`](https://github.com/arihantcodes/spectrum-ui).

- **Padrão:** `https://ui.spectrumhq.in/r/<nome>.json`
- **Índice:** [`https://ui.spectrumhq.in/r/registry.json`](https://ui.spectrumhq.in/r/registry.json) — HTTP
  200, 107.347 B, JSON, 182 itens.
- **Licença:** [Apache-2.0 no `LICENSE`](https://raw.githubusercontent.com/arihantcodes/spectrum-ui/main/LICENSE)
  — HTTP 200, 11.357 B.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`animated-testimonials`](https://ui.spectrumhq.in/r/animated-testimonials.json) | depoimentos animados | 200 · 7.034 B · JSON |
| [`bento-grid`](https://ui.spectrumhq.in/r/bento-grid.json) | features em bento | 200 · 9.603 B · JSON |
| [`animated-SVG-chart`](https://ui.spectrumhq.in/r/animated-SVG-chart.json) | visualização de métricas | 200 · 2.797 B · JSON |

### 3.6 React Bits

- **Padrão:** `https://reactbits.dev/r/<Nome>-<JS|TS>-<CSS|TW>.json`; para este projeto, preferir
  `-TS-TW`.
- **Índice:** [`https://reactbits.dev/r/registry.json`](https://reactbits.dev/r/registry.json) — HTTP 200,
  271.289 B, JSON, 660 itens (cerca de 165 componentes em quatro variantes).
- **Licença:** [`LICENSE.md`](https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md) —
  **MIT + Commons Clause**, HTTP 200, 1.303 B. Permite uso inclusive comercial dentro de site/app/produto,
  mas proíbe vender, sublicenciar ou redistribuir os componentes como componentes, bundle ou port.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`LogoLoop-TS-TW`](https://reactbits.dev/r/LogoLoop-TS-TW.json) | logos em loop com pausa no hover | 200 · 17.013 B · JSON |
| [`CountUp-TS-TW`](https://reactbits.dev/r/CountUp-TS-TW.json) | contadores de resultados | 200 · 3.439 B · JSON |
| [`ScrollStack-TS-TW`](https://reactbits.dev/r/ScrollStack-TS-TW.json) | cards de features empilhados no scroll | 200 · 11.503 B · JSON |

### 3.7 Shadcnblocks gratuitos

- **Padrão:** `https://shadcnblocks.com/r/<nome>.json`
- **Índice:** `/r/index.json` devolve 404 JSON e `/registry.json`, 404 HTML. Para listar apenas o acervo
  aberto, use [`/blocks/free`](https://shadcnblocks.com/blocks/free) ou a árvore de
  [`shadcnblocks/shadcn-ui-blocks`](https://data.jsdelivr.com/v1/package/gh/shadcnblocks/shadcn-ui-blocks@master/flat)
  e filtre `src/block/`; foram encontrados 54 blocos TSX.
- **Licença:** [`LICENSE.md`](https://raw.githubusercontent.com/shadcnblocks/shadcn-ui-blocks/master/LICENSE.md)
  — **MIT + Commons Clause**, HTTP 200, 1.299 B. A restrição é a mesma do React Bits: pode integrar a
  site/app comercial, mas não redistribuir ou vender os componentes em si.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`faq1`](https://shadcnblocks.com/r/faq1.json) | FAQ completo | 200 · 3.575 B · JSON |
| [`pricing2`](https://shadcnblocks.com/r/pricing2.json) | pricing completo | 200 · 6.530 B · JSON |
| [`stats8`](https://shadcnblocks.com/r/stats8.json) | métricas/resultados | 200 · 2.438 B · JSON |

Também foram validados `testimonial10` (200 · 2.162 B) e `timeline9` (200 · 3.967 B). É a forma mais
direta de preencher os buracos de pricing/FAQ/stats apontados em `COMPONENTES-API.md`, desde que a Commons
Clause seja aceitável para o produto.

### 3.8 Origin UI atual: usar o repo Coss

O repo solicitado, `origin-space/originui`, foi renomeado/movido para `cosscom/coss`. O host raw **não**
acompanha o redirect do GitHub: por isso a URL antiga dá 404. O caminho atual é:

- **Padrão raw:**
  `https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/public/r/<nome>.json`
- **Índice raw:**
  [`apps/origin/registry.json`](https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/registry.json)
  — HTTP 200, 286.644 B, JSON, 646 itens.
- **Licença:** [MIT em `apps/origin/LICENSE.md`](https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/LICENSE.md)
  — HTTP 200, 1.105 B.

| Componente | Uso | Resultado do teste |
|---|---|---|
| [`timeline`](https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/public/r/timeline.json) | processo/timeline | 200 · 6.178 B · JSON |
| [`accordion`](https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/public/r/accordion.json) | base acessível para FAQ | 200 · 3.236 B · JSON |
| [`progress`](https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/public/r/progress.json) | indicador de resultado/progresso | 200 · 1.089 B · JSON |

## 4. Fontes raw sem registry público completo

### 4.1 Animata

- **Padrão raw:** `https://raw.githubusercontent.com/codse/animata/main/animata/<categoria>/<nome>.tsx`
- **Como listar:** árvore em
  [`data.jsdelivr.com/v1/package/gh/codse/animata@main/flat`](https://data.jsdelivr.com/v1/package/gh/codse/animata@main/flat),
  filtrando `/animata/` e excluindo `*.stories.tsx`; foram encontrados 169 arquivos TSX.
- **Licença:** [MIT no `LICENSE.md`](https://raw.githubusercontent.com/codse/animata/main/LICENSE.md) — HTTP
  200, 1.058 B.

| Componente | Resultado | Uso |
|---|---|---|
| `animata/section/pricing.tsx` | 200 · 7.158 B · TSX | pricing |
| `animata/accordion/faq.tsx` | 200 · 4.746 B · TSX | FAQ em estilo chat |
| `animata/progress/animatedtimeline.tsx` | 200 · 8.445 B · TSX | timeline/processo |

O MDX menciona um instalador interno, mas não foi localizado um endpoint JSON público/estável. Trate como
copy/paste de fonte, não como registry shadcn automatizável.

### 4.2 SyntaxUI

- **Padrão raw:**
  `https://raw.githubusercontent.com/syntaxUI/syntaxui/main/src/showcase/blocks/<categoria>/<arquivo>.tsx`
- **Como listar:** árvore em
  [`data.jsdelivr.com/v1/package/gh/syntaxUI/syntaxui@main/flat`](https://data.jsdelivr.com/v1/package/gh/syntaxUI/syntaxui@main/flat),
  filtrando `src/showcase/blocks/`; foram encontrados 17 blocos TSX.
- **Licença:** [MIT no `LICENSE`](https://raw.githubusercontent.com/syntaxUI/syntaxui/main/LICENSE) — HTTP
  200, 1.065 B.

| Arquivo | Resultado | Uso |
|---|---|---|
| `features/FeaturesGrid.tsx` | 200 · 2.543 B · TSX | features |
| `pricing/Pricing.tsx` | 200 · 5.943 B · TSX | pricing |
| `testimonial/TestimonialCarousel.tsx` | 200 · 3.520 B · TSX | depoimentos |

### 4.3 Skiper UI — somente o repo legado

O domínio atual `skiper-ui.com` não expõe o antigo registry: `/registry/index.json` e
`/registry/skiper-marquee.json` deram 404/HTML, e `/r/skiper-marquee.json` deu 404 JSON. O host
`legacy.skiper-ui.com` nem respondeu. O repo legado ainda é aproveitável:

- **Padrão raw:**
  `https://raw.githubusercontent.com/anshxs/legacy-skiper-ui/main/apps/www/public/registry/<nome>.json`
- **Como listar:** o `index.json` do repo é um array vazio de 2 B, então liste a árvore em
  [`data.jsdelivr.com/v1/package/gh/anshxs/legacy-skiper-ui@main/flat`](https://data.jsdelivr.com/v1/package/gh/anshxs/legacy-skiper-ui@main/flat)
  e filtre `apps/www/public/registry/*.json`; há 27 JSONs de primeiro nível.
- **Licença:** [MIT no `LICENSE.md`](https://raw.githubusercontent.com/anshxs/legacy-skiper-ui/main/LICENSE.md)
  — HTTP 200, 1.071 B.

| Componente raw | Resultado | Uso |
|---|---|---|
| `skiper-marquee.json` | 200 · 7.530 B · JSON | logos/depoimentos |
| `animated-number-counter.json` | 200 · 2.327 B · JSON | stats |
| `card-carousel.json` | 200 · 4.958 B · JSON | cases/features |

### 4.4 Berlix — código acessível, mas sem licença

O site indicado pelo repo, `ui.rechesoares.com`, não respondeu. O código do registry está disponível no
GitHub:

- **Padrão raw:** `https://raw.githubusercontent.com/Reche13/berlix/main/public/registry/<nome>.json`
- **Como listar:** árvore em
  [`data.jsdelivr.com/v1/package/gh/Reche13/berlix@main/flat`](https://data.jsdelivr.com/v1/package/gh/Reche13/berlix@main/flat),
  filtrando `public/registry/`; há 13 JSONs.
- **Licença:** `LICENSE` e `LICENSE.md` retornaram 404, e o repo não declara SPDX. **Não copiar para produto
  de cliente sem autorização do autor.**

| Componente raw | Resultado | Uso |
|---|---|---|
| `flip-card.json` | 200 · 2.921 B · JSON | cards de feature |
| `text-reveal.json` | 200 · 1.932 B · JSON | reveal de narrativa |
| `gradient-bars.json` | 200 · 1.883 B · JSON | fundo/separador de seção |

### 4.5 BG.IBELICK — domínio desativado, repo sem licença

`https://bg.ibelick.com` devolveu **HTTP 402**, 78 B, texto `Payment required / DEPLOYMENT_DISABLED`.
O repo oficial ainda existe em [`ibelick/background-snippets`](https://github.com/ibelick/background-snippets):

- **Fonte raw:**
  [`app/components/background.tsx`](https://raw.githubusercontent.com/ibelick/background-snippets/main/app/components/background.tsx)
  — HTTP 200, 8.992 B, TSX, com 22 opções.
- **Como listar:** o próprio array `BACKGROUND_OPTIONS` no arquivo enumera todas as variantes; a árvore
  completa também está em
  [`data.jsdelivr.com/v1/package/gh/ibelick/background-snippets@main/flat`](https://data.jsdelivr.com/v1/package/gh/ibelick/background-snippets@main/flat).
- **Exemplos relevantes:** `BgDarkGradient1`, `BgDarkGrid1` e `BgDarkGridGradient1`, todos bons pontos de
  partida para trocar o roxo por `#ED3237`.
- **Licença:** não existe `LICENSE` no repo e a API do GitHub não declara SPDX. Use apenas como referência
  visual até obter permissão.

## 5. O que não funciona ou não compensa tentar

| Fonte/URL | Resultado validado | Conclusão prática |
|---|---|---|
| `ui.hover.dev` | HTTP 000, sem corpo; busca do repo oficial não encontrou fonte verificável | Não perder tempo; o antigo `hover.dev/api/components` já era 404 |
| `spectrumui.com` | HTTP 000 | Domínio errado/antigo; usar `ui.spectrumhq.in` |
| `originui.com/r/timeline.json` | HTTP 200, **468.520 B de HTML** | Armadilha de falso 200 continua ativa |
| `raw.githubusercontent.com/origin-space/originui/...` | HTTP 404, 14 B | Repo mudou; usar `cosscom/coss/main/apps/origin/...` |
| `skiper-ui.com/registry/...` | HTTP 404 com 27.746 B de HTML | Usar somente o raw do repo legado |
| `legacy.skiper-ui.com/...` | HTTP 000 | Host fora do ar |
| `ui.rechesoares.com` (Berlix) | HTTP 000 | Host fora do ar; raw funciona, mas não há licença |
| `bg.ibelick.com` | HTTP 402, `DEPLOYMENT_DISABLED` | Host desativado; raw sem licença serve só como referência |
| `eldoraui.site/registry/styles/default/<nome>.json` | HTTP 404 com 494.468 B de HTML | Padrão antigo; o atual é `/r/<nome>.json` |
| `fancycomponents.dev/registry.json` e `/r/index.json` | HTTP 404/HTML | Componentes funcionam, mas o índice deve vir da árvore do repo |
| `ui-layouts.com/r/index.json` | HTTP 404/HTML | Mesma situação; listar repo/MDX |
| `shadcnblocks.com/r/index.json` | HTTP 404 JSON | Usar `/blocks/free` ou o repo público |

### Tailark: nuance importante

O resultado hoje é mais específico que o registrado anteriormente:

- [`tailark.com/r/button.json`](https://tailark.com/r/button.json) funciona: 200, 2.913 B, JSON real;
- porém os blocos de landing testados continuam fechados:
  - `pricing-1.json`: 401, 124 B;
  - `stats-1.json`: 401, 124 B;
  - `testimonials-1.json`: 401, 124 B;
  - corpo: `Sign in with a plan that includes blocks...`;
- `/r/index.json` retorna 404 JSON e não existe repo público dos blocos com `LICENSE` verificável.

Portanto, **Tailark não é uma fonte gratuita de seções de landing**, apesar de alguns primitivos do registry
serem públicos.

## 6. Licenças consolidadas

| Fonte | Licença lida | Pode entrar no site de cliente? |
|---|---|---|
| Eldora UI | MIT | Sim, preservando o aviso |
| SmoothUI | MIT | Sim, preservando o aviso |
| Fancy Components | MIT | Sim, preservando o aviso |
| UI Layouts | MIT | Sim, preservando o aviso |
| Spectrum UI | Apache-2.0 | Sim, cumprindo aviso/atribuição da Apache |
| Coss/Origin UI | MIT | Sim, preservando o aviso |
| Animata | MIT | Sim, preservando o aviso |
| SyntaxUI | MIT | Sim, preservando o aviso |
| Skiper UI legado | MIT | Sim, preservando o aviso |
| React Bits | MIT + Commons Clause | Sim dentro do produto; não revender/redistribuir a biblioteca |
| Shadcnblocks | MIT + Commons Clause | Sim dentro do produto; mesma restrição |
| Berlix | sem arquivo de licença | Não sem permissão |
| BG.IBELICK | sem arquivo de licença | Não sem permissão |
| Tailark blocks | licença do código não verificável e acesso 401 | Não usar como fonte gratuita |

## 7. Prioridade recomendada para o SPX IA

1. **SmoothUI** para preencher pricing, FAQ, stats e depoimentos com seções completas e MIT.
2. **Eldora UI** para `features-01`, `pricing-01` e `testimonal-02`; os três aceitam bem a paleta dark +
   vermelho `#ED3237`.
3. **UI Layouts** para FAQ, logos e timeline, todos pequenos e MIT.
4. **Spectrum UI** para bento, depoimentos e chart; Apache-2.0 é adequada a uso comercial.
5. **Fancy Components** e **React Bits** para movimento complementar (`ScrollStack`, marquees e números),
   observando a Commons Clause do React Bits.
6. **Shadcnblocks** quando a prioridade for velocidade de montagem de blocos completos; a licença permite
   incorporar no site, mas não redistribuir o acervo.
7. **Origin/Coss**, Animata e SyntaxUI como reservas raw. Evitar Berlix e BG.IBELICK enquanto não houver
   licença formal.

Todos os componentes que importam `motion/react` precisam de uma decisão consciente antes da implementação:
trocar o import para `framer-motion` onde a API usada for compatível, ou migrar o template para `motion` de
forma centralizada. Esta pesquisa não instalou nem alterou nenhuma dependência.
