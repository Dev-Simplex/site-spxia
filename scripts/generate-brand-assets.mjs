// Gera os ícones da marca SPXia a partir dos contornos oficiais.
// Uso: node scripts/generate-brand-assets.mjs
// Reutiliza o sharp que acompanha o Next (não é dependência direta do projeto).
// A imagem de compartilhamento (public/og.png) sai de scripts/og.html: abra-a
// servida por http, num viewport de 1200x630, e salve o screenshot.
import { createRequire } from 'node:module'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BRAND_VIEWBOX, SYMBOL_STANDALONE } from '../components/brand-paths.ts'

const require = createRequire(import.meta.url)
const nextDir = path.dirname(require.resolve('next/package.json'))
const sharp = require(require.resolve('sharp', { paths: [nextDir] }))

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const BLUE = '#001FDA'
const [, , vbW, vbH] = BRAND_VIEWBOX.symbol.split(' ').map(Number)

// Quadrado Azul Pulso com o símbolo branco no centro. `scale` = largura do
// símbolo em relação ao lado do quadrado.
function tile(size, { radius, scale }) {
  const k = (size * scale) / vbW
  const x = (size - vbW * k) / 2
  const y = (size - vbH * k) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BLUE}"/>
  <path transform="translate(${x} ${y}) scale(${k})" d="${SYMBOL_STANDALONE}" fill="#FFFFFF"/>
</svg>`
}

const png = (svg) => sharp(Buffer.from(svg)).png().toBuffer()

// ICO com PNG embutido, formato que todo navegador atual aceita.
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i
    header.writeUInt8(size, entry)
    header.writeUInt8(size, entry + 1)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((image) => image.data)])
}

// No 16 px o símbolo ocupa mais do quadrado para a estrela vazada não sumir.
const favicon = await Promise.all(
  [
    [16, 0.8],
    [32, 0.7],
    [48, 0.66],
  ].map(async ([size, scale]) => ({ size, data: await png(tile(size, { radius: size * 0.22, scale })) })),
)
await writeFile(path.join(root, 'app', 'favicon.ico'), ico(favicon))
await writeFile(path.join(root, 'public', 'icon.svg'), tile(512, { radius: 112, scale: 0.62 }))
// O iOS aplica a própria máscara arredondada: o apple-icon vai com cantos retos.
await sharp(Buffer.from(tile(180, { radius: 0, scale: 0.6 })))
  .png()
  .toFile(path.join(root, 'public', 'apple-icon.png'))

console.log('ok: app/favicon.ico, public/icon.svg, public/apple-icon.png')
