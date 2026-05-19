import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_BASE_URL = 'https://api.asaas.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!ASAAS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required env: ASAAS_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
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
  const cors = req ? corsHeaders(req) : {}
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ message: 'Unauthorized' }, 401, req)

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return json({ message: 'Invalid token' }, 401, req)

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return json({ message: 'Forbidden — admin only' }, 403, req)
    }

    const { method, path, body } = await req.json()

    if (typeof path !== 'string' || !path.startsWith('/v3/')) {
      return json({ message: 'Invalid path' }, 400, req)
    }

    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        'access_token': ASAAS_API_KEY!,
        'Content-Type': 'application/json',
      },
    }

    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body)
    }

    const asaasRes = await fetch(ASAAS_BASE_URL + path, fetchOptions)
    const contentType = asaasRes.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await asaasRes.text()
      console.error('asaas-proxy non-JSON response:', asaasRes.status, text.slice(0, 200))
      return json({ message: 'Gateway returned non-JSON response' }, 502, req)
    }
    const data = await asaasRes.json()
    return json(data, asaasRes.status, req)
  } catch (err) {
    console.error('asaas-proxy error:', err)
    return json({ message: 'Erro interno ao acessar gateway' }, 500, req)
  }
})
