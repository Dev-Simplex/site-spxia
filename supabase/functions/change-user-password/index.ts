// Admin-only edge function: change another user's password via Supabase Admin API.
// Replaces the raw `UPDATE auth.users SET encrypted_password = ...` SQL approach,
// which bypassed Supabase Auth's session/audit hooks.
//
// Deploy: supabase functions deploy change-user-password
// Caller must be authenticated admin (role='admin' in profiles).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
}

const ALLOWED_ORIGINS = new Set([
  'https://spx.ia.br',
  'https://www.spx.ia.br',
  'http://localhost:5173',
  'http://localhost:3000',
])

function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || ''
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://spx.ia.br',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function json(data: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...(req ? corsHeaders(req) : {}), 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401, req)

    const admin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: authErr } = await admin.auth.getUser(token)
    if (authErr || !caller) return json({ error: 'Invalid token' }, 401, req)

    const { data: callerProfile, error: profErr } = await admin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (profErr || callerProfile?.role !== 'admin') {
      return json({ error: 'Apenas administradores podem alterar senhas.' }, 403, req)
    }

    const body = await req.json()
    const targetUserId: string | undefined = body?.target_user_id
    const newPassword: string | undefined = body?.new_password

    if (!targetUserId || typeof targetUserId !== 'string') {
      return json({ error: 'target_user_id obrigatório' }, 400, req)
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, 400, req)
    }

    const { error: updateErr } = await admin.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
    })

    if (updateErr) {
      console.error('updateUserById failed:', updateErr)
      return json({ error: updateErr.message || 'Erro ao alterar senha' }, 500, req)
    }

    return json({ success: true }, 200, req)
  } catch (err) {
    console.error('change-user-password error:', err)
    return json({ error: 'Erro interno' }, 500, req)
  }
})
