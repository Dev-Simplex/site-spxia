# Marca SPXia

Cópias dos SVGs oficiais do kit de outubro de 2026
(`Downloads/novo branding/00. Logotipo/SVG/`), sem edição. Se o kit mudar,
copie os arquivos novos por cima, com os mesmos nomes.

## Arquivos

| Arquivo | Tamanho | O que é | Quando usar |
| --- | --- | --- | --- |
| `spxia-horizontal-colorida.svg` | 512×120 | Símbolo Azul Pulso (`#001FDA`) + "SPXia" preto | Fundo claro. É a assinatura padrão |
| `spxia-horizontal-branca.svg` | 512×120 | Símbolo e "SPXia" brancos | Fundo Azul Pulso, Azul Profundo ou foto escura |
| `spxia-vertical-colorida.svg` | 360×268 | Símbolo em cima, "SPXia" embaixo, cores da colorida | Peça quadrada ou alta em fundo claro (avatar, cartaz) |
| `spxia-vertical-branca.svg` | 360×268 | Idem, tudo branco | Peça quadrada ou alta em fundo escuro |

## Quem usa

- A interface **não** carrega estes arquivos: `components/logo.tsx` desenha a
  marca inline com os contornos de `components/brand-paths.ts` (extraídos de
  `spxia-horizontal-colorida.svg`), nas variantes `full`/`symbol` e
  `color`/`white`.
- `spxia-horizontal-branca.svg` aparece no PDF da calculadora
  (`app/admin/calculadora/page.tsx`).
- `spxia-horizontal-colorida.svg` aparece em `scripts/og.html`, a fonte de
  `public/og.png`.
- Favicon, `public/icon.svg` e `public/apple-icon.png` saem de
  `scripts/generate-brand-assets.mjs`.

Os demais usos (apresentações, material de divulgação, envio a terceiros) pegam
o arquivo daqui.
