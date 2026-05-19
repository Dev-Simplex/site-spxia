import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
const ASAAS_BASE = 'https://api.asaas.com'
const SB_URL = Deno.env.get('SUPABASE_URL')
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!ASAAS_API_KEY || !SB_URL || !SB_KEY) {
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
    'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
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

async function asaasPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(ASAAS_BASE + path, {
    method: 'POST',
    headers: { 'access_token': ASAAS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

async function asaasGet(path: string) {
  const res = await fetch(ASAAS_BASE + path, {
    headers: { 'access_token': ASAAS_API_KEY },
  })
  return res.json()
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) })

  try {
    const { productId, customerName, customerEmail, customerCpfCnpj, customerPhone, billingType } =
      await req.json()

    if (!productId || !customerName || !customerEmail || !customerCpfCnpj || !billingType) {
      return json({ message: 'Campos obrigatórios faltando' }, 400, req)
    }

    const sb = createClient(SB_URL, SB_KEY)

    // 1) Get product
    const { data: product, error: prodErr } = await sb
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_published', true)
      .single()

    if (prodErr || !product) {
      return json({ message: 'Produto não encontrado' }, 404, req)
    }

    // 2) Find or create Asaas customer
    const searchRes = await asaasGet('/v3/customers?cpfCnpj=' + customerCpfCnpj)
    let customer
    if (searchRes.data && searchRes.data.length > 0) {
      customer = searchRes.data[0]
    } else {
      customer = await asaasPost('/v3/customers', {
        name: customerName,
        email: customerEmail,
        cpfCnpj: customerCpfCnpj,
        mobilePhone: customerPhone || undefined,
      })
    }

    if (!customer?.id) {
      console.error('Asaas customer creation failed:', customer)
      return json({ message: 'Erro ao criar cliente no gateway de pagamento' }, 500, req)
    }

    let payment = null
    let subscription = null
    let pixData = null

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 3)
    const dueDateStr = dueDate.toISOString().split('T')[0]

    if (product.type === 'subscription') {
      // 3a) Create subscription
      subscription = await asaasPost('/v3/subscriptions', {
        customer: customer.id,
        billingType,
        value: Number(product.price),
        nextDueDate: dueDateStr,
        cycle: product.billing_cycle || 'MONTHLY',
        description: product.title,
        externalReference: product.id,
      })

      if (subscription?.id) {
        const paymentsRes = await asaasGet('/v3/subscriptions/' + subscription.id + '/payments')
        if (paymentsRes.data && paymentsRes.data.length > 0) {
          payment = paymentsRes.data[0]
        }
      }
    } else {
      // 3b) Create one-time payment
      payment = await asaasPost('/v3/payments', {
        customer: customer.id,
        billingType,
        value: Number(product.price),
        dueDate: dueDateStr,
        description: product.title,
        externalReference: product.id,
      })
    }

    // 4) Get Pix QR if applicable
    if (billingType === 'PIX' && payment?.id) {
      try {
        pixData = await asaasGet('/v3/payments/' + payment.id + '/pixQrCode')
      } catch (_e) {
        // ignore pix error
      }
    }

    // 5) Save order
    await sb.from('orders').insert({
      product_id: product.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_cpf_cnpj: customerCpfCnpj,
      customer_phone: customerPhone,
      asaas_customer_id: customer.id,
      asaas_payment_id: payment?.id || null,
      asaas_subscription_id: subscription?.id || null,
      billing_type: billingType,
      amount: Number(product.price),
      status: 'PENDING',
    })

    return json({
      success: true,
      paymentId: payment?.id,
      subscriptionId: subscription?.id,
      invoiceUrl: payment?.invoiceUrl || null,
      bankSlipUrl: payment?.bankSlipUrl || null,
      pixData: pixData || null,
      status: payment?.status || 'PENDING',
    }, 200, req)
  } catch (err) {
    console.error('asaas-checkout error:', err)
    return json({ message: 'Erro interno ao processar checkout' }, 500, req)
  }
})
