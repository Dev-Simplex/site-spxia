import type { Metadata } from 'next'

// Rota transacional: funcional, mas fora do sitemap e sem indexação
export const metadata: Metadata = {
  title: 'Pagamento',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
