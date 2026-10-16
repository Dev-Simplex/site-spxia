import { NextResponse } from 'next/server'

import { questionCopy } from '@/app/diagnostico/perguntas'

// As respostas do questionário viram uma linha numa planilha Google, gravada pelo
// App da Web do Apps Script (código em doc/planilha-diagnostico/apps-script.gs).
// A URL fica só no servidor: quem tem essa URL consegue gravar na planilha.
const PLANILHA_URL = process.env.DIAGNOSTICO_PLANILHA_URL
// Com a chave secreta configurada, só grava quem passou pelo reCAPTCHA da página.
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY
const MAX_CHARS = 4000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Campo do formulário → coluna da planilha.
const COLUNAS = {
  name: 'Nome',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  companyName: 'Empresa',
} as const

const texto = (value: unknown) => (typeof value === 'string' ? value.trim().slice(0, MAX_CHARS) : '')
const falha = (status: number) => NextResponse.json({ ok: false }, { status })

async function captchaValido(token: string) {
  if (!RECAPTCHA_SECRET) return true
  if (!token) return false
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
  }).catch(() => null)
  const out: unknown = await res?.json().catch(() => null)
  return (out as { success?: boolean } | null)?.success === true
}

export async function POST(request: Request) {
  if (!PLANILHA_URL) {
    console.error('DIAGNOSTICO_PLANILHA_URL não configurada')
    return falha(500)
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return falha(400)
  const dados = body as Record<string, unknown>
  const answers = dados.answers && typeof dados.answers === 'object' ? (dados.answers as Record<string, unknown>) : {}

  const linha: Record<string, string> = {
    Data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Cuiaba' }),
    ...Object.fromEntries(Object.entries(COLUNAS).map(([campo, coluna]) => [coluna, texto(dados[campo])])),
    Idioma: dados.locale === 'en' ? 'en' : 'pt',
    ...Object.fromEntries(questionCopy.pt.map((q) => [q.label, texto(answers[q.id])])),
  }
  if (!linha.Nome || !EMAIL.test(linha['E-mail'])) return falha(400)
  if (!(await captchaValido(texto(dados.captchaToken)))) return falha(403)

  try {
    // O Apps Script responde com 302 para a resposta final; o fetch segue sozinho.
    const res = await fetch(PLANILHA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linha }),
    })
    const out: unknown = await res.json().catch(() => null)
    if (!res.ok || (out as { ok?: boolean } | null)?.ok !== true) throw new Error(`planilha respondeu ${res.status}`)
  } catch (error) {
    console.error('Falha ao gravar diagnóstico na planilha', error)
    return falha(502)
  }
  return NextResponse.json({ ok: true })
}
