// Gera os assets raster da marca (og.png, apple-icon.png, icon-32.png) a partir de SVG.
// Uso: node scripts/generate-brand-assets.mjs
// Reutiliza o sharp que acompanha o Next (não é dependência direta do projeto).
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const nextDir = path.dirname(require.resolve('next/package.json'))
const sharp = require(require.resolve('sharp', { paths: [nextDir] }))

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => path.join(root, 'public', f)

// librsvg usa fontes do sistema: Segoe UI/Arial (Windows) no lugar de Inter aqui.
const LOGO_FONT = 'Segoe UI, Arial, sans-serif'
const MONO_FONT = 'Consolas, Courier New, monospace'

const og = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1A1A1A"/>
  <text x="600" y="340" text-anchor="middle" font-family="${LOGO_FONT}" font-weight="800" font-size="170"><tspan fill="#FEFEFE">SPX</tspan><tspan fill="#ED3237">(IA)</tspan></text>
  <rect x="510" y="390" width="180" height="10" rx="5" fill="#ED3237"/>
  <text x="600" y="465" text-anchor="middle" font-family="${MONO_FONT}" font-size="32" letter-spacing="10" fill="#888888">INTELLIGENCE AND AUTOMATION</text>
</svg>`

const icon = (size, rx, fontSize, textY, barY, barH) => `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#1A1A1A"/>
  <text x="${size / 2}" y="${textY}" text-anchor="middle" font-family="${LOGO_FONT}" font-weight="800" font-size="${fontSize}" fill="#FEFEFE">SPX</text>
  <rect x="${size / 4}" y="${barY}" width="${size / 2}" height="${barH}" rx="${barH / 2}" fill="#ED3237"/>
</svg>`

await sharp(Buffer.from(og)).png().toFile(pub('og.png'))
await sharp(Buffer.from(icon(180, 40, 64, 105, 128, 14))).png().toFile(pub('apple-icon.png'))
await sharp(Buffer.from(icon(64, 14, 24, 38, 46, 5))).resize(32, 32).png().toFile(pub('icon-32.png'))

console.log('ok: og.png, apple-icon.png, icon-32.png')
