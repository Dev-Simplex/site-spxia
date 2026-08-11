# Kit de marca SPXIA

Arquivos originais gerados em 10/08/2026, renomeados por caso de uso. Os originais
continuam em `~/Downloads` (foram copiados, não movidos).

| Arquivo | O que é | Quando usar |
| --- | --- | --- |
| `spxia-symbol-red.png` | Símbolo isolado, vermelho (1254×1254, quadrado) | Avatar de redes sociais, favicon de origem, selo, app icon |
| `spxia-logo-horizontal-light.png` | Símbolo vermelho + wordmark preto | Assinatura padrão sobre **fundo claro** |
| `spxia-logo-horizontal-dark.png` | Símbolo e wordmark brancos sobre preto | Assinatura padrão sobre **fundo escuro** (é o caso deste site) |
| `spxia-logo-stacked-light.png` | Versão empilhada: símbolo acima, wordmark abaixo | Espaços verticais/quadrados — story, capa, crachá, camiseta |
| `spxia-wordmark-black.png` | Só a tipografia, sem símbolo | Quando o símbolo já aparece perto, ou em faixas muito largas |
| `spxia-logo-horizontal-black.png` | Monocromático preto (símbolo + texto) | Impressão 1 cor, documento, fax, gravação |
| `spxia-logo-horizontal-red.png` | Monocromático vermelho | Peças onde só o vermelho da marca é permitido |
| `spxia-logo-horizontal-gray.png` | Monocromático cinza | Marca secundária, rodapé discreto, "usado por" |
| `spxia-logo-horizontal-on-red.png` | Branco sobre fundo vermelho da marca | Peça com fundo vermelho chapado, banner, brinde |
| `spxia-logo-horizontal-outline.png` | Contorno, sem preenchimento | Vinil, corte a laser, gravação, marca d'água |

## Atenção antes de usar no site

**Todos os PNGs têm fundo sólido — não são transparentes** (color type RGB, sem canal alpha).
Isso significa que colocar `spxia-logo-horizontal-dark.png` sobre o fundo `#1A1A1A` do site
deixaria um retângulo preto visível ao redor da marca.

Para uso na interface, o site continua usando o SVG inline em `components/logo.tsx`, que é
vetorial, acompanha a cor do tema e não tem esse problema. Estes PNGs servem para material
de divulgação, apresentações e envio a terceiros.

Se for preciso usar algum deles na interface, peça antes a versão **SVG** ou **PNG com fundo
transparente** de quem gerou a arte.
