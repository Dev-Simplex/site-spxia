import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://spx.ia.br'

  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/privacidade`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/termos`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
