import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/checkout', '/redefinir-senha'],
      },
    ],
    sitemap: 'https://spx.ia.br/sitemap.xml',
  }
}
