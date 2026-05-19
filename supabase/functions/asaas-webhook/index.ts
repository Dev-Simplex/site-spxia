// Asaas webhook receiver — validates token from `asaas-access-token` header
// against ASAAS_WEBHOOK_TOKEN env (which must match the vault secret of same name)
// and dispatches to public.asaas_webhook() via service role.
//
// Deploy: supabase functions deploy asaas-webhook --no-verify-jwt
// (--no-verify-jwt because Asaas does not send a Supabase JWT)
//
// Configure in Asaas dashboard:
//   URL: https://tdthuluyohqtmdhegjhf.functions.supabase.co/asaas-webhook
//   Token header: asaas-access-token = <ASAAS_WEBHOOK_TOKEN value>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const WEBHOOK_TOKEN = Deno.env.get('ASAAS_WEBHOOK_TOKEN')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !WEBHOOK_TOKEN) {
  throw new Error('Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ASAAS_WEBHOOK_TOKEN')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const token = req.headers.get('asaas-access-token') || ''
  if (!timingSafeEqual(token, WEBHOOK_TOKEN!)) {
    console.warn('asaas-webhook rejected: invalid token')
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let payload: { event?: string; payment?: { id?: string } }
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const event = payload?.event
  const paymentId = payload?.payment?.id
  if (!event || !paymentId) {
    return new Response(JSON.stringify({ error: 'Missing event or payment.id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const sb = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await sb.rpc('asaas_webhook', {
    p_token: WEBHOOK_TOKEN,
    p_event: event,
    p_payment_id: paymentId,
  })

  if (error) {
    console.error('asaas_webhook RPC error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
