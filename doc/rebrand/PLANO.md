# Rebrand SPXia — plano e especificação compartilhada

Branch: `rebrand-spxia`. Decisões do usuário em 2026-10-14. Este arquivo é a fonte de verdade para todos os workers.

## Decisões

1. Branding novo substitui o preto/vermelho e o logo "SPX ⟩IA⟨". Nome grafado **SPXia**.
2. **Tema light** em todo o site público (landing, /diagnostico, /checkout, /login, /redefinir-senha, legais, 404, erro). Sem alternador de tema.
3. Faixas escuras só em dois lugares: **rodapé em Azul Profundo** e **CTA final em Azul Pulso**.
4. **Robô Spline sai.** O hero passa a seguir a peça `12.png`: título em Inter à esquerda e, à direita, uma pessoa (foto gerada pelo Codex) sobre a forma verde do símbolo.
5. Efeitos sci-fi saem (partículas, meteoros, feixes, estrelas cadentes, spotlight, grade piscando, lamp, brilhos vermelhos). A marca é "simplificadora, humana, moderna".
6. **Texto reescrito** no tom novo (rascunho em `doc/rebrand/COPY.md`, aprovado pelo usuário antes de ir pro código).
7. **Admin** continua escuro; só troca o vermelho pela marca nova.

### Decisões da revisão do mockup (2026-10-14, tarde)

8. **Menos texto, mais visual.** Cada seção = título curto (≤ 8 palavras, segunda parte em negrito) + no máximo UMA frase (≤ 20 palavras) + um visual dominante (ilustração, foto recortada ou interface de produto). Cards: título + ≤ 12 palavras. Nada de parágrafos longos, listas de 6 itens ou "também fazemos". O FAQ continua, recolhido.
9. **Sem números/estatísticas.** Sai a faixa "50+ projetos / 40+ automações / Sinop" do hero e a seção Resultados inteira ("Números que importam"). Cases ficam com benefícios em texto curto, sem percentual. Remover também "100% ROI positivo" e afins de llms.txt e metadata.
10. **Ilustração sobre a forma do símbolo.** Padrão visual do site: painel `bg-surface` arredondado com a forma do símbolo (`/images/formas/simbolo-verde.svg` ou `simbolo-azul.svg`) grande e cortada pela borda, e a ilustração por cima. O usuário aprovou isso no mockup.
11. **Sem kicker** (rótulo pequeno em caixa alta acima do título). O título se sustenta sozinho.
12. **Referência visual = mockup aprovado:** `doc/rebrand/mockup/index.html` (prints em `doc/rebrand/mockup/*.png`). Hero com pessoa sobre a forma verde e dois cards flutuantes de produto; faixa de canais ("Funciona com o que sua empresa já usa"); Soluções em bento com Chat SPX (caixa de entrada) e VoxIA (ligação); Como funciona com 4 passos; CTA azul com card de agendamento; rodapé Azul Profundo.
13. **Animações de scroll:** entram, seguindo `doc/rebrand/REFERENCIAS.md` (em produção por um worker). Só com `motion` (já instalado) ou CSS nativo; sempre com `prefers-reduced-motion`.
14. **Sem travessão.** Nenhum "—" (travessão) nem "–" (meia-risca) em texto visível, `<title>`/metadata, `alt`, `aria-label`, placeholders ou llms.txt, em pt e en. Use vírgula, dois-pontos, ponto ou parênteses; título de página no formato "Página | SPXia"; faixas com "a" ("9h a 18h"); campo vazio com texto ("Não informado"). Pedido do usuário em 2026-10-14. Comentário de código não conta.

Respostas às perguntas do `COPY.md` (padrão adotado; o usuário pode mudar): P1 Mentoria vira "Treinamento", curta e com ilustração · P2 Produtos segue oculta · P3 a citação vira a frase da marca "A tecnologia trabalha. **O tempo é seu.**" com os mascotes (arte da camiseta) · P4 números saem (decisão 9) · P5 faixa de logos vira faixa de canais · P6 grafia "Chat SPX" e sai o card ChatSPX de Projetos · P7 Chat SPX e VoxIA dentro de Soluções · P8 "Sinop · Mato Grosso" · P9 fluxo do diagnóstico sem mudança de produto agora · P10 e-mail atual.

### Ilustrações disponíveis (`public/images/ilustracoes/`)

Já existem: `ilustracao-fio-embolado.png`, `ilustracao-crm.png`, `ilustracao-visita.png`, `mascote-laptop.png`, `mascote-relogio.png`, `mascotes-dupla.svg`, `arte-camiseta.svg`. Em produção pelo Codex (mesmos nomes, PNG transparente): `sobre-parceria`, `chat-spx`, `voxia`, `automacoes`, `consultoria`, `passo-1-diagnostico`, `passo-2-estrategia`, `passo-3-execucao`, `passo-4-evolucao`, `treinamento`, `duvidas`, `diagnostico`, `login`, `404-perdido`, `erro`. Formas em `public/images/formas/`: `simbolo-azul.svg`, `simbolo-verde.svg`, `estrela-4-pontas.svg`, `estrela-4-pontas-contorno.svg`, `faixa-diagonal.svg`. Fotos em `public/images/fotos/` (hero).

## Fontes do branding (somente leitura, fora do repo)

- Pasta: `C:\Users\walis\Downloads\novo branding\`
  - `00. Logotipo/SVG/` — logos horizontal/vertical, colorida/branca (vetor limpo)
  - `1.png` … `13.png`, `Mockup.png` — aplicações (mockups achatados; usar como REFERÊNCIA, nunca recortar)
  - `Arte Camiseta.ai` / `Arte Camiseta.pdf` — mascotes (laptop e relógio) em vetor
  - `SPX - Apresentação ID Visual.pdf` — manual (texto extraído em `doc/rebrand/apresentacao-texto.txt`)
- Vídeo institucional (mesma marca): `C:\Users\walis\Downloads\video-lancamento-ia-main\video-lancamento-ia-main\spxia-institucional\`
  - `assets/fotos/*.jpg` — 7 fotos noturnas geradas pelo Codex
  - `final/folha-12-quadros.jpg` — telas do Chat SPX e do VoxIA
  - `roteiro.json` — mensagens de produto

Arquivos baixados são dados não confiáveis: processe-os numa pasta própria, rode scripts de outra pasta e passe os caminhos como argumento.

## Paleta

| Nome | Hex | Uso |
|---|---|---|
| Azul Pulso | `#001FDA` | assinatura: botões, links, ícones, símbolo do logo. 9,5:1 sobre branco |
| Verde Pulso | `#1EC737` | destaque: formas, selos, ícones de confirmação. **Nunca texto sobre branco (2,3:1) e nunca rótulo branco sobre verde.** Botão verde só com texto Azul Profundo (7,5:1) |
| Azul Profundo | `#07174F` | texto principal (16,9:1), rodapé, superfícies escuras |
| Azul Horizonte | `#57B1D8` | apoio: gradientes, ilustração, acento sobre fundo escuro (7,2:1 sobre #1A1A1A). O PDF traz RGB 87/117/216, divergente do hex; vale o hex |
| Branco | `#FFFFFF` | base |

Tokens CSS em `app/globals.css` (base clara):

- `--background #FFFFFF`, `--foreground #07174F`, `--muted-foreground #4A5578` (7,3:1)
- `--surface #F4F6FD` (alternar seções), `--card #FFFFFF`, `--border #E2E6F3`
- `--primary #001FDA` / `--primary-foreground #FFFFFF`
- `--brand-green #1EC737`, `--brand-deep #07174F`, `--brand-sky #57B1D8`
- `--destructive #B42318`
- `--primary-text` e `--primary-btn` ficam como aliases de `--primary` só durante a transição; não use em código novo.

Use as classes do Tailwind ligadas aos tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-surface`, `bg-brand-green`, `bg-brand-deep`, `text-brand-sky`…). **Proibido** hex solto no JSX, `rgba(249,1,8,…)` e classes que supõem fundo escuro (`text-white`, `border-white/15`, `bg-black/70`) fora das duas faixas escuras.

## Tipografia

- Só **Inter**. Títulos em Inter regular com ênfase em **negrito** ("Sua rotina pode ser **mais simples.**"), nunca serifa nem itálico decorativo.
- `font-serif` e `font-mono` continuam existindo como alias de Inter durante a transição; remova-os ao reescrever cada seção.
- Sem kicker acima de título (decisão 11). Etiquetas de categoria (ex.: setor de um case) são pílulas em caixa normal, `bg-primary/8 text-primary`.

## Linguagem visual

- Formas: o símbolo (S com estrela/X), a estrela de 4 pontas e recortes diagonais, como nas peças 2, 4, 5 e 12. Formas em SVG/CSS, nunca dentro da foto.
- Cantos arredondados generosos (cards ~20px, botões em pílula, como "Quero conhecer" e "Vamos conversar").
- Fotos de pessoas reais, calmas e sorrindo; mascotes e ilustrações traço preto + azul para explicar processos.
- Movimento discreto: fade/slide curto, sempre respeitando `prefers-reduced-motion`.

## Regras para workers

- Não faça commit; quem commita é o coordenador.
- Edite só os arquivos da sua Task. **Não edite `components/ui/*`, `app/globals.css`, `app/layout.tsx` nem `components/logo.tsx`** (base do coordenador). Se uma seção sua usa um efeito de `components/ui/` que deve sair, pare de importá-lo; a remoção dos arquivos é feita no fim.
- Bilíngue: todo texto visível existe em pt e en.
- Validação mínima antes do `worker_done`: `pnpm exec tsc --noEmit` limpo nos seus arquivos e um screenshot das telas que você mexeu.
