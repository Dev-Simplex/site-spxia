# Preloader cinematográfico — relatório de execução

Tarefa: elevar `components/ui/site-preloader.tsx` a nível de motion graphics
("algo bem bonito de entrada, deixar cinematográfico"), sem regredir MIN_MS,
failsafes e prefers-reduced-motion, + pendências da tarefa anterior (flags de
reversibilidade e teste do failsafe com chunk bloqueado).

## O que mudou

### site-preloader.tsx — timeline com beats (não é mais um spinner)

| Beat | Janela | O que acontece |
|------|--------|----------------|
| Entrada | ~0–0,9s (CSS puro) | malha assenta (scale 1.06→1), vinheta fecha de fora para dentro, símbolo sobe, texto sobe por último — roda ANTES da hidratação (keyframes inline no HTML do servidor) |
| Desenho | ~0,35–1,85s | traço percorre o símbolo com **ponto de luz na ponta** (offset-path com o mesmo path do símbolo, dentro do SVG, transição idêntica ao dash) |
| Acende | ~1,85–2,35s | flash bloom (0,5s) + anel de choque (0,9s) + pulso forte do halo no instante em que o traço fecha; preenchimento acende em 0,45s; contorno esfria para brasa |
| Respiro | até MIN_MS | halo em respiração 3,6s, facho percorrendo o contorno |
| Saída fase 1 | 0,38s | conteúdo recua com peso: scale 0.9 + blur 8px + fade (expo-in) — vinheta e grão saem juntos |
| Saída fase 2 | 0,72s | SÓ ENTÃO as cortinas abrem (expo-in-out 0.87/0/0.13/1) com **parallax**: a malha desliza 14% mais devagar que a metade (overflow-hidden contém); costura vermelha acende no início e apaga antes do fim ([0,1,0]) |

Textura: vinheta radial + grão SVG estático (feTurbulence em data-URI, 4% de
opacidade, custo zero de runtime). 60fps: só transform/opacity/filter/
strokeDashoffset/offsetDistance animam.

O que NÃO mudou: MIN_MS=2400, MAX_MS=5000, CSS_FAILSAFE_S=8 (conta: pior
caminho = MAX 5s + saída 1,1s ≈ 6,1s < 8s), progresso por marcos reais,
prefers-reduced-motion = fade curto (entrada CSS desligada por media query,
beats desligados pelo estado `reduce`).

### spline-scene.tsx — flags de reversibilidade (1 linha cada)

- `WAIT_FOR_SCENE` (false) → true: cena 3D volta a segurar a cortina via
  lib/page-ready. Bloqueio registrado NO RENDER (exigência do registry) e
  liberado em todos os caminhos: onLoad, erro (boundary `componentDidCatch`),
  timeout, cena desabilitada, desmontagem. Teto continua MAX_MS=5s.
- `USE_POSTER` (true) → false: desliga o poster do hero (comportamento antigo).
- `DISABLE_3D_ON_MOBILE` (true) → false: monta o runtime 3D também no <768px.

### Fix de performance descoberto na captura

Frame a frame (CDP screencast) mostrou a coreografia CONGELADA ~600ms no
desktop entre o desenho e o acendimento — o parse/compile do runtime Spline
trava o main thread na hidratação. Correção: o preloader dispara
`spx:preloader-done` ao desmontar e a cena 3D só monta então (fallback 10s;
com WAIT_FOR_SCENE monta imediato para não criar deadlock). O poster cobre o
hero até lá. Mobile (sem Spline) já rodava a cascata perfeita.

### Fix de CSS descoberto na captura

Grão renderizava a 100% de opacidade (tela cinza): animação CSS de entrada
com `fill:both` terminando em `opacity:1` vence a classe `opacity-[0.04]`.
Keyframe agora termina em 0.04. Regra geral aplicada no arquivo: elemento com
entrada CSS nunca é o mesmo que o Motion anima (wrappers separados).

## Evidências (esta pasta, capturadas no build final)

- `desktop-1440-*ms.png` — sequência 1440×900 via CDP screencast (~300ms de
  intervalo). Pós-defer: frames consecutivos todos distintos (sem
  congelamento); traço em andamento com ponto de luz na borda em 3694ms.
- `mobile-375-*ms.png` — sequência 375×812; cascata completa (desenho →
  acendimento → saída).
- `reduced-*.png` — prefers-reduced-motion: sem coreografia, fade curto.
- `*-final.png` — site revelado após a saída; overlay removido do DOM nas
  três variantes (verificação por page.evaluate).
- `failsafe-12s-*.png` — TESTE OBRIGATÓRIO do failsafe: rota
  `**/_next/static/chunks/webpack-*.js` abortada (1 request bloqueado,
  hidratação morta). Medido por amostragem: opacity 1 até os 8s, 0.555 aos
  9s (fade em andamento), `visibility:hidden` + `body overflow:visible` aos
  10s, `scrollY=900` após wheel — o site abre e rola por CSS puro, sem
  nenhum JS. O overlay permanece no DOM (ninguém o remove), escondido pelo
  keyframe inline `spx-preloader-failsafe`.

## Validação final

- `tsc --noEmit` limpo ✓
- `pnpm build` verde ✓ (build final com todos os fixes)
- Sequência desktop/mobile/reduced capturada no build final ✓
- Teste failsafe com chunk bloqueado ✓ (aprovado, ver acima)
- Cliente aprovou a animação em teste manual ("tá muito legal") ✓
- Nada commitado (working tree apenas) ✓
