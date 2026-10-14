import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/contexts/auth-context'
import { SitePreloader } from '@/components/ui/site-preloader'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const description =
  'A SPXia conecta a IA ao atendimento e aos processos da sua empresa para reduzir tarefas repetitivas. IA de atendimento integrada ao CRM imobiliário.'

export const metadata: Metadata = {
  metadataBase: new URL('https://spx.ia.br'),
  title: {
    default: 'SPXia | Sua rotina pode ser mais simples',
    template: '%s | SPXia',
  },
  description,
  keywords: [
    'inteligência artificial',
    'IA para empresas',
    'IA de atendimento',
    'atendimento com IA',
    'CRM imobiliário',
    'IA para imobiliárias',
    'IA para incorporadoras',
    'automação de atendimento',
    'Chat SPX',
    'VoxIA',
    'consultoria em IA',
    'Mato Grosso',
    'SPXia',
    'Simplex Soluções',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SPXia',
    title: 'SPXia | Sua rotina pode ser mais simples',
    description,
    locale: 'pt_BR',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SPXia: sua rotina pode ser mais simples.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPXia | Sua rotina pode ser mais simples',
    description,
    images: ['/og.png'],
  },
  // O favicon vem de app/favicon.ico (16, 32 e 48 px), que o Next declara
  // sozinho. Não declarar o /icon.svg aqui: navegador que aceita favicon em SVG
  // passa a usá-lo em todos os tamanhos e o .ico deixa de valer.
  icons: {
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`font-sans antialiased ${inter.variable}`}
      >
        <I18nProvider>
          <SitePreloader />
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
