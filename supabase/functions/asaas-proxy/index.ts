import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')!
const ASAAS_BASE_URL = 'https://api.asaas.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ message: 'Unauthorized' }, 401)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return json({ message: 'Invalid token' }, 401)

    const { method, path, body } = await req.json()

    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
    }

    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body)
    }

    const asaasRes = await fetch(ASAAS_BASE_URL + path, fetchOptions)
    const data = await asaasRes.json()

    return json(data, asaasRes.status)
  } catch (err) {
    return json({ message: (err as Error).message }, 500)
  }
})
