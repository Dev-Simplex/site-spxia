# Kit de marca SPX IA

Gerado a partir de `SPX IA BRANCA.svg` (kit oficial, export do CorelDRAW).
Os `<text>` do arquivo original dependiam de SVG fonts — um recurso que Chrome e
Firefox removeram —, então os glifos foram convertidos em contornos usando os
`<glyph>` embutidos no próprio arquivo. O desenho é o do kit, não uma
aproximação com fonte parecida.

Para regerar: `node ~/.spxia-tools/gerar-kit.mjs`.

## Arquivos

Cada nome existe em `svg/` (vetor) e na raiz desta pasta em `.png` (2000px de
largura, **com transparência**, exceto `sobre-vermelho`).

| Arquivo | O que é | Quando usar |
| --- | --- | --- |
| `spxia-logo-dark` | spx branco + bloco vermelho + assinatura | Assinatura padrão sobre **fundo escuro** (é o caso deste site) |
| `spxia-logo-light` | spx quase-preto + bloco vermelho + assinatura | Assinatura padrão sobre **fundo claro** |
| `spxia-logo-dark-sem-assinatura` | Idem, sem "Intelligence and Automation" | Fundo escuro em peça pequena (veja o limite abaixo) |
| `spxia-logo-light-sem-assinatura` | Idem, sem assinatura | Fundo claro em peça pequena |
| `spxia-logo-preto` | Monocromático preto | Impressão 1 cor, documento, gravação |
| `spxia-logo-branco` | Monocromático branco | Sobre foto escura ou fundo colorido |
| `spxia-logo-vermelho` | Monocromático vermelho da marca | Peça onde só o vermelho é permitido |
| `spxia-logo-cinza` | Monocromático cinza | Marca secundária, rodapé discreto, "usado por" |
| `spxia-logo-sobre-vermelho` | Branco sobre chapado vermelho, com respiro | Banner, brinde, selo |
| `spxia-logo-contorno` (só SVG) | Contorno, sem preenchimento | Vinil, corte a laser, marca d'água |
| `spxia-simbolo-vermelho` | Só o bloco ⟩IA⟨ | Avatar, favicon, selo, app icon |
| `spxia-wordmark-preto` / `-branco` | Só "spx" | Quando o bloco já aparece perto |

## Limite de tamanho da assinatura

A linha "Intelligence and Automation" tem cerca de 1/10 da altura da marca. A
partir de **90px de altura total** ela fica com ~9px de letra e se lê; abaixo
disso vira mancha. Para header, favicon e assinaturas de e-mail, use as versões
`-sem-assinatura`.

## Uso na interface

A interface **não consome estes arquivos**: usa o SVG inline de
`components/logo.tsx`, que herda a cor do tema (`currentColor` no "spx") e não
precisa de um arquivo por fundo. Estes aqui servem para material de divulgação,
apresentações e envio a terceiros.

## Cor

O vermelho aplicado é `#F90108`, o token `--primary` do site. O arquivo original
do kit traz `#ED3237` — um vermelho mais claro e rosado. A troca é deliberada:
a paleta inteira do site (sombras, brilhos, bordas) já está calibrada em
`#F90108`. Para voltar ao vermelho do arquivo, mude `VERMELHO` em
`~/.spxia-tools/gerar-kit.mjs` e o `--primary` em `app/globals.css` juntos.
