# Onde pegar componente de graça, por comando

**O que é este documento.** Um mapa das fontes de componente, CSS, ícone e padrão visual que um agente de
terminal — Claude Code, Codex, qualquer um — consegue baixar **sozinho**: sem conta, sem chave de API, sem
navegador logado, com um `curl`.

**Data dos testes:** 2026-08-07. Cada URL desta página foi executada. Onde não foi, está dito.

---

## 0. O teste que decide se uma fonte entra

Status HTTP **não prova nada sozinho**. A armadilha que encontrei hoje:

```
https://originui.com/r/button.json   ->  HTTP 200, 468.520 bytes ... de HTML
```

Um `200` com uma página de erro renderizada em React passa por qualquer verificação ingênua. O teste correto
tem três passos:

```bash
# 1. baixa e guarda o status
code=$(curl -sL -o corpo.txt -w '%{http_code}' "$URL")

# 2. confere que o CORPO é o que se espera, e não HTML
head -c 40 corpo.txt | grep -qi "<!DOCTYPE\|<html" && echo "É HTML — não serve"

# 3. confere o tamanho: um JSON de componente tem 1–10 KB. 400 KB é página.
wc -c < corpo.txt
```

E, antes de usar em produto de cliente, **leia o arquivo de licença** (`LICENSE`, `LICENSE.md`) no
repositório. Não confie no README nem no rodapé do site.

---

## 1. Resumo — o que funciona hoje

| Fonte | Padrão de URL | Formato | Precisa React? | Testado |
|---|---|---|---|---|
| **shadcn/ui** | `ui.shadcn.com/r/styles/new-york/<nome>.json` | JSON + TSX | Sim | 2.336 B |
| **Magic UI** | `magicui.design/r/<nome>.json` | JSON + TSX | Sim | 2.997 B |
| **cult-ui** | `raw.githubusercontent.com/nolly-studio/cult-ui/main/apps/www/public/r/<nome>.json` | JSON + TSX | Sim | 4.902 B |
| **KokonutUI** | `kokonutui.com/r/<nome>.json` | JSON + TSX | Sim | 8.869 B |
| **Aceternity** | `ui.aceternity.com/registry/<nome>.json` | JSON + TSX | Sim | 3.367 B |
| **motion-primitives** | `raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/<nome>.json` | JSON + TSX | Sim | 7.894 B |
| **daisyUI** | `raw.githubusercontent.com/saadeghi/daisyui/master/packages/daisyui/src/components/<nome>.css` | **CSS puro** | **Não** | 9.106 B |
| **Radix Themes** | `raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/<nome>.css` | **CSS puro** | **Não** | 3.450 B |
| **Open Props** | `unpkg.com/open-props@1/<nome>.min.css` | **CSS puro** | **Não** | 3.100 B |
| **USWDS** | `raw.githubusercontent.com/uswds/uswds/develop/packages/<comp>/src/styles/_<comp>.scss` | SCSS | **Não** | 5.551 B |
| **GOV.UK** | `raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/<comp>/_index.scss` | SCSS | **Não** | 339 B |
| **Qualquer pacote npm** | `cdn.jsdelivr.net/npm/<pacote>@<versão>/<caminho>` | qualquer | depende | vários |
| **Qualquer arquivo do GitHub** | `raw.githubusercontent.com/<org>/<repo>/<branch>/<caminho>` | qualquer | depende | vários |
| **Iconify (API)** | `api.iconify.design/<coleção>/<ícone>.svg` | SVG | **Não** | 414 B |

CSS puro testado via jsDelivr, todos com HTTP 200 e corpo real: **Pico** 83 KB · **Bulma** 678 KB ·
**Flowbite** 182 KB · **Preline** 432 KB · **Beer** 89 KB · **Shoelace** 20 KB · **Spectrum** 80 KB ·
**PatternFly** 346 KB · **Carbon** 816 KB · **Fluent** 375 KB · **Material Web** 3,8 KB ·
**animate.css** 72 KB · **Open Props completo** 29,6 KB.

Ícones testados, todos SVG cru abaixo de 500 B: **Heroicons** 278 B · **Iconify/Lucide** 414 B ·
**SuperTinyIcons** 435 B · **Tabler** 444 B.

---

## 2. Como descobrir os nomes disponíveis

Esta é a parte que falta na maioria das listas de registries — sem ela, só dá para pegar componente cujo
nome já se sabe. Todos os índices abaixo foram testados hoje.

```bash
# shadcn/ui — o índice completo do registry
curl -s https://ui.shadcn.com/r/index.json            # 200, 58.072 B

# Magic UI — tem os dois; o registry.json é o completo
curl -s https://magicui.design/r/index.json           # 200,    315 B
curl -s https://magicui.design/registry.json          # 200, 108.443 B

# Qualquer registry hospedado no GitHub: liste o diretório pela API
curl -s https://api.github.com/repos/nolly-studio/cult-ui/contents/apps/www/public/r      # 165.674 B
curl -s https://api.github.com/repos/saadeghi/daisyui/contents/packages/daisyui/src/components   # 62.683 B
curl -s https://api.github.com/repos/radix-ui/themes/contents/packages/radix-ui-themes/src/components  # 178.214 B

# Iconify — 200 mil ícones, com índice de coleções
curl -s https://api.iconify.design/collections                 #  95.341 B
curl -s "https://api.iconify.design/collection?prefix=lucide"  #  33.243 B

# Qualquer pacote npm — a árvore de arquivos, sem baixar o pacote
curl -s https://data.jsdelivr.com/v1/packages/npm/open-props   #  41.499 B
curl -s https://registry.npmjs.org/open-props/latest           #  19.646 B
```

A API do GitHub sem token dá **60 requisições por hora por IP**. Para varredura grande, é o limite que
aparece primeiro — não a falta de acesso.

---

## 3. As fontes, por utilidade

### 3.1 Para projeto SEM React — CSS puro, o que mais importa aqui

Estes são os que servem a um site Astro, Eleventy, Hugo ou HTML puro. O componente vem como CSS e se
adapta copiando as regras.

**daisyUI** — MIT. Componentes em CSS puro sobre Tailwind, um arquivo por componente. É a fonte mais direta
de "receita de material": o `btn.css` traz a cadeia inteira de sombra, bisel e estado.
```bash
curl -s https://raw.githubusercontent.com/saadeghi/daisyui/master/packages/daisyui/src/components/button.css
```

**Radix Themes** — MIT. CSS puro, e a melhor referência de *fio que não é borda*: usa `box-shadow: inset 0 0 0 1px`
em vez de `border`, que é exatamente o padrão que evita mexer no layout.
```bash
curl -s https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/badge.css
```

**Open Props** — MIT. Não é componente: é a escada de tokens (sombra, easing, tamanho, cor). A escada de
sombra dele é a referência para "sombra de duas camadas".
```bash
curl -s https://unpkg.com/open-props@1/shadows.min.css      # 3.100 B
curl -s https://cdn.jsdelivr.net/npm/open-props@1/open-props.min.css   # 29.566 B (tudo)
```

**GOV.UK Design System** e **USWDS** — licença aberta (MIT/domínio público). São governo, então a
acessibilidade é levada a sério de verdade — a melhor fonte para **anel de foco** e alvo de toque.
```bash
curl -s https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/button/_index.scss
curl -s https://raw.githubusercontent.com/uswds/uswds/develop/packages/usa-button/src/styles/_usa-button.scss
```

**Pico, Bulma, Beer, Shoelace, Spectrum, PatternFly, Carbon, Fluent, Material Web** — todos servidos por
jsDelivr, todos testados. Úteis como *referência de valores* (raio, espaçamento, escala de sombra), não para
adotar inteiros.

### 3.2 Para projeto COM React — registries no formato shadcn

Todos devolvem o mesmo formato de JSON (`$schema: ui.shadcn.com/schema/registry-item.json`), com o código
dentro do campo `files[].content`. Mesmo sem React no projeto, **o CSS e a estrutura dentro do TSX são
aproveitáveis**. O site antigo usou assim efeitos do cult-ui e do Magic UI (border-beam, texture-card, sparkles
e afins); o rebrand de 2026-10 removeu todos de `components/ui/`, então os exemplos abaixo valem só como
formato de URL.

```bash
curl -s https://ui.shadcn.com/r/styles/new-york/button.json
curl -s https://magicui.design/r/border-beam.json
curl -s https://raw.githubusercontent.com/nolly-studio/cult-ui/main/apps/www/public/r/texture-card.json
curl -s https://kokonutui.com/r/background-paths.json
curl -s https://ui.aceternity.com/registry/aurora-background.json
curl -s https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/text-effect.json
```

**Ressalva de licença:** cult-ui, Magic UI e KokonutUI têm MIT confirmado lendo o arquivo. **Aceternity não
tem licença SPDX** — não existe `LICENSE` no repositório e `/license` dá 404. Os componentes gratuitos são
liberados na prática, mas não há licença formal. Vale saber antes de basear o produto de um cliente neles.

### 3.3 Ícones — todos SVG cru, sem build

```bash
# Iconify: ~200 mil ícones de 150+ coleções, uma API só
curl -s https://api.iconify.design/lucide/phone.svg          # 414 B
curl -s https://api.iconify.design/tabler/phone.svg
curl -s https://api.iconify.design/simple-icons/whatsapp.svg

# Direto da fonte, quando se quer o arquivo original
curl -s https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/outline/bolt.svg
curl -s https://cdn.jsdelivr.net/npm/@tabler/icons@3/icons/outline/phone.svg
curl -s https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/whatsapp.svg
```

**SuperTinyIcons** merece nota: logos de marca em ~400 B cada, feitos à mão para serem minúsculos. Para
rodapé com redes sociais, é a escolha certa.

### 3.4 Os dois curingas

Estes dois padrões cobrem quase tudo que não está na lista:

```bash
# 1. Qualquer arquivo de qualquer repositório público
https://raw.githubusercontent.com/<org>/<repo>/<branch>/<caminho>

# 2. Qualquer arquivo de qualquer pacote npm publicado
https://cdn.jsdelivr.net/npm/<pacote>@<versão>/<caminho>
https://unpkg.com/<pacote>@<versão>/<caminho>
```

Se um projeto de UI existe no GitHub ou no npm, o código dele é acessível — mesmo que o site dele exija
login. Foi assim que este documento pegou daisyUI e Radix, cujos sites não expõem registry.

---

## 4. O que NÃO funciona — testado hoje, para não tentar de novo

| Fonte | O que acontece |
|---|---|
| `originui.com/r/<nome>.json` | **HTTP 200 com 468 KB de HTML.** O 200 engana; o corpo é página |
| `tailark.com/r/<nome>.json` | **HTTP 401** — `{"error":"Sign in with a plan that includes blocks"}`. Pago |
| `hover.dev/api/components` | HTTP 404 |
| `api.uiverse.io/api/v1/elements` | Não respondeu (código 000) |
| `21st.dev/api/components` | HTTP 404. O site tem API, mas exige `api_key` |
| `tremor.so/api/registry` | HTTP 404 |
| `api.github.com/repos/aceternity/ui` | HTTP 404 — o repositório é `manuarora700/ui.aceternity` |

**Nota histórica deste projeto:** a pesquisa de `.21st/PESQUISA-HERO-ANIMADO.md` (2026-07-30) já tinha
mapeado que os blocos **Pro do Aceternity dão HTTP 401** e que o **21st.dev dá 403 sem `api_key`**, com
limite de 2 recuperações por dia. Continua valendo.

---

## 5. Regras de uso, para não se enganar

1. **Status 200 não é prova.** Confira o corpo. A armadilha do originui custa dez minutos se passar batido.
2. **Leia o `LICENSE` do repositório**, não o README. Ausência de SPDX é um dado, não um detalhe —
   registre quando não houver.
3. **Componente React em projeto sem React não se instala: se adapta.** O valor está no CSS e na estrutura,
   e é preciso reescrever como HTML+CSS. Vale o trabalho quando o componente resolve algo específico.
4. **Peso importa mais que aparência.** Carbon são 816 KB de CSS; serve como referência de valores, não
   para adotar. Este projeto rejeitou sete bibliotecas de animação por peso — a conta está em
   `.21st/veredito-libs.md`.
5. **A API do GitHub sem token são 60 requisições/hora por IP.** Em varredura grande, é o teto que aparece
   primeiro.

---

## 6. O que este documento ainda não cobre

- Não testei **CodePen, Uiverse e CSS-Pattern** por API — os três têm acervo grande de CSS puro e mereciam
  entrar. O Uiverse não respondeu no endpoint que tentei.
- Não testei **fontes** (Google Fonts API, Fontsource, Bunny) nem **ilustrações** (unDraw, Storyset,
  Open Doodles, Lorem Picsum).
- Não verifiquei licença de todas as fontes da tabela — confirmei MIT lendo o arquivo para cult-ui,
  Magic UI, KokonutUI, daisyUI, Radix e Open Props; as demais estão marcadas como não verificadas.
- Uma varredura exaustiva está em andamento (worker `WF`, tarefa `task_9b8de5c28eeb`) cobrindo ~30 fontes
  a mais, incluindo os registries shadcn-compatíveis menores e os design systems institucionais. O
  resultado sai em `.21st/registries-api.md` e deve ser fundido aqui.

---

## Anexos

- `.21st/PESQUISA-HERO-ANIMADO.md` — a primeira varredura deste projeto (2026-07-30), com 70 componentes
  do 21st.dev e as licenças conferidas uma a uma
- `.21st/componentes-prontos.md` — 15 componentes de daisyUI, cult-ui, Magic UI, Radix, shadcn e Open Props
  **já adaptados para CSS puro**, com custo medido em bytes
- `.21st/adaptado/componentes-adaptados.css` — os blocos prontos para colar
- `.21st/veredito-libs.md` — por que nenhuma das 7 bibliotecas de animação entrou
