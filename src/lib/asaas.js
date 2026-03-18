import { supabase } from './supabase'

// All Asaas calls go through Supabase Database Function (RPC)
// API key is stored securely inside the Postgres function

async function callAsaas(method, path, body = null) {
  const { data, error } = await supabase.rpc('asaas_request', {
    p_method: method,
    p_path: path,
    p_body: body,
  })
  if (error) throw new Error(error.message)
  return data
}

// ---- CLIENTES ----

export async function createCustomer({ name, cpfCnpj, email, phone, mobilePhone, address, addressNumber, postalCode, externalReference }) {
  return callAsaas('POST', '/v3/customers', {
    name, cpfCnpj, email, phone, mobilePhone, address, addressNumber, postalCode, externalReference,
  })
}

export async function listCustomers(params = {}) {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/customers${query ? '?' + query : ''}`)
}

export async function getCustomer(id) {
  return callAsaas('GET', `/v3/customers/${id}`)
}

// ---- COBRANÇAS ----

export async function createPayment({ customer, billingType, value, dueDate, description, externalReference }) {
  return callAsaas('POST', '/v3/payments', {
    customer, billingType, value, dueDate, description, externalReference,
  })
}

export async function listPayments(params = {}) {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/payments${query ? '?' + query : ''}`)
}

export async function getPayment(id) {
  return callAsaas('GET', `/v3/payments/${id}`)
}

export async function getPixQrCode(paymentId) {
  return callAsaas('GET', `/v3/payments/${paymentId}/pixQrCode`)
}

export async function getPaymentBankSlip(paymentId) {
  return callAsaas('GET', `/v3/payments/${paymentId}/identificationField`)
}

// ---- ASSINATURAS ----

export async function createSubscription({ customer, billingType, value, nextDueDate, cycle, description, externalReference }) {
  return callAsaas('POST', '/v3/subscriptions', {
    customer, billingType, value, nextDueDate, cycle, description, externalReference,
  })
}

export async function listSubscriptions(params = {}) {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/subscriptions${query ? '?' + query : ''}`)
}

export async function getSubscription(id) {
  return callAsaas('GET', `/v3/subscriptions/${id}`)
}

export async function updateSubscription(id, data) {
  return callAsaas('PUT', `/v3/subscriptions/${id}`, data)
}

export async function deleteSubscription(id) {
  return callAsaas('DELETE', `/v3/subscriptions/${id}`)
}

export async function getSubscriptionPayments(id) {
  return callAsaas('GET', `/v3/subscriptions/${id}/payments`)
}

// ---- CONSTANTES ----

export const BILLING_TYPES = {
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão de Crédito',
  PIX: 'Pix',
  UNDEFINED: 'A definir',
}

export const CYCLES = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  BIMONTHLY: 'Bimestral',
  QUARTERLY: 'Trimestral',
  SEMIANNUALLY: 'Semestral',
  YEARLY: 'Anual',
}

export const SUB_STATUS = {
  ACTIVE: 'Ativa',
  PENDING: 'Pendente',
  PAUSED: 'Pausada',
  CANCELED: 'Cancelada',
  EXPIRED: 'Expirada',
}

export const PAYMENT_STATUS = {
  PENDING: 'Pendente',
  RECEIVED: 'Recebido',
  CONFIRMED: 'Confirmado',
  OVERDUE: 'Vencido',
  REFUNDED: 'Estornado',
  RECEIVED_IN_CASH: 'Recebido em dinheiro',
  REFUND_REQUESTED: 'Estorno solicitado',
  REFUND_IN_PROGRESS: 'Estorno em progresso',
  CHARGEBACK_REQUESTED: 'Chargeback solicitado',
  CHARGEBACK_DISPUTE: 'Em disputa',
  AWAITING_CHARGEBACK_REVERSAL: 'Aguardando reversão',
  DUNNING_REQUESTED: 'Negativação solicitada',
  DUNNING_RECEIVED: 'Recuperado via negativação',
  AWAITING_RISK_ANALYSIS: 'Análise de risco',
}
