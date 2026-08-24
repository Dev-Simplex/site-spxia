import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, DM_Serif_Display } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/context'
import { AuthProvider } from '@/contexts/auth-context'
import { SitePreloader } from '@/components/ui/site-preloader'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const description =
  'SPXIA é a divisão de inteligência e automação da Simplex Soluções. Consultoria, desenvolvimento de sistemas, automações e projetos de IA sob medida. Da estratégia à produção, com resultados mensuráveis.'

export const metadata: Metadata = {
  metadataBase: new URL('https://spx.ia.br'),
  title: {
    default: 'SPXIA | Intelligence and Automation',
    template: 'SPXIA | %s',
  },
  description,
  keywords: [
    'inteligência artificial',
    'IA para negócios',
    'automação',
    'consultoria em IA',
    'agentes de IA',
    'desenvolvimento de sistemas',
    'n8n',
    'chatbots',
    'Mato Grosso',
    'SPXIA',
    'Simplex Soluções',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SPXIA',
    title: 'SPXIA | Intelligence and Automation',
    description,
    locale: 'pt_BR',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SPX IA | Intelligence and Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPXIA | Intelligence and Automation',
    description,
    images: ['/og.png'],
  },
  // O favicon vem de app/favicon.ico, que o Next declara sozinho. Ele carrega
  // três desenhos (16, 32 e 48) e o de 16px é feito na grade de pixel, não
  // escalado: nesse tamanho os vãos do bloco ⟩IA⟨ medem 0,44px, repartem tinta
  // entre pixels vizinhos e o símbolo empasta numa mancha.
  //
  // Não declarar o /icon.svg aqui: navegador que aceita favicon em SVG passa a
  // usá-lo em TODOS os tamanhos, inclusive 16px, e o .ico deixa de valer.
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
        className={`font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}
      >
        <I18nProvider>
          <SitePreloader />
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
