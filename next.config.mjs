/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    // As páginas legais passaram a viver em português, assinadas pela SPX
    // Inteligência. Os endereços antigos continuam válidos como redirecionamento
    // permanente para não quebrar links já publicados.
    return [
      { source: '/privacy', destination: '/privacidade', permanent: true },
      { source: '/terms', destination: '/termos', permanent: true },
    ]
  },
}

export default nextConfig
