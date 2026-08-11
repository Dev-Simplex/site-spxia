import { supabase } from './supabase'

// Todas as chamadas ao Asaas passam pela Database Function do Supabase (RPC).
// A API key fica guardada com segurança dentro da função Postgres.

/** Resposta crua da API do Asaas, repassada pela RPC `asaas_request`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsaasResponse = any

async function callAsaas(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: Record<string, unknown> | null = null
): Promise<AsaasResponse> {
  const { data, error } = await supabase.rpc('asaas_request', {
    p_method: method,
    p_path: path,
    p_body: body,
  })
  if (error) throw new Error(error.message)
  return data
}

// ---- CLIENTES ----

export interface CreateCustomerInput {
  name: string
  cpfCnpj: string
  email?: string
  phone?: string
  mobilePhone?: string
  address?: string
  addressNumber?: string
  postalCode?: string
  externalReference?: string
}

export async function createCustomer({
  name,
  cpfCnpj,
  email,
  phone,
  mobilePhone,
  address,
  addressNumber,
  postalCode,
  externalReference,
}: CreateCustomerInput): Promise<AsaasResponse> {
  return callAsaas('POST', '/v3/customers', {
    name,
    cpfCnpj,
    email,
    phone,
    mobilePhone,
    address,
    addressNumber,
    postalCode,
    externalReference,
  })
}

export async function listCustomers(
  params: Record<string, string> = {}
): Promise<AsaasResponse> {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/customers${query ? '?' + query : ''}`)
}

export async function getCustomer(id: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/customers/${id}`)
}

// ---- COBRANÇAS ----

export interface CreatePaymentInput {
  customer: string
  billingType: string
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}

export async function createPayment({
  customer,
  billingType,
  value,
  dueDate,
  description,
  externalReference,
}: CreatePaymentInput): Promise<AsaasResponse> {
  return callAsaas('POST', '/v3/payments', {
    customer,
    billingType,
    value,
    dueDate,
    description,
    externalReference,
  })
}

export async function listPayments(
  params: Record<string, string> = {}
): Promise<AsaasResponse> {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/payments${query ? '?' + query : ''}`)
}

export async function getPayment(id: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/payments/${id}`)
}

export async function getPixQrCode(paymentId: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/payments/${paymentId}/pixQrCode`)
}

export async function getPaymentBankSlip(paymentId: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/payments/${paymentId}/identificationField`)
}

// ---- ASSINATURAS ----

export interface CreateSubscriptionInput {
  customer: string
  billingType: string
  value: number
  nextDueDate: string
  cycle: string
  description?: string
  externalReference?: string
}

export async function createSubscription({
  customer,
  billingType,
  value,
  nextDueDate,
  cycle,
  description,
  externalReference,
}: CreateSubscriptionInput): Promise<AsaasResponse> {
  return callAsaas('POST', '/v3/subscriptions', {
    customer,
    billingType,
    value,
    nextDueDate,
    cycle,
    description,
    externalReference,
  })
}

export async function listSubscriptions(
  params: Record<string, string> = {}
): Promise<AsaasResponse> {
  const query = new URLSearchParams(params).toString()
  return callAsaas('GET', `/v3/subscriptions${query ? '?' + query : ''}`)
}

export async function getSubscription(id: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/subscriptions/${id}`)
}

export async function updateSubscription(
  id: string,
  data: Record<string, unknown>
): Promise<AsaasResponse> {
  return callAsaas('PUT', `/v3/subscriptions/${id}`, data)
}

export async function deleteSubscription(id: string): Promise<AsaasResponse> {
  return callAsaas('DELETE', `/v3/subscriptions/${id}`)
}

export async function getSubscriptionPayments(id: string): Promise<AsaasResponse> {
  return callAsaas('GET', `/v3/subscriptions/${id}/payments`)
}

// ---- CONSTANTES ----

export const BILLING_TYPES: Record<string, string> = {
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão de Crédito',
  PIX: 'Pix',
  UNDEFINED: 'A definir',
}

export const CYCLES: Record<string, string> = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  BIMONTHLY: 'Bimestral',
  QUARTERLY: 'Trimestral',
  SEMIANNUALLY: 'Semestral',
  YEARLY: 'Anual',
}

export const SUB_STATUS: Record<string, string> = {
  ACTIVE: 'Ativa',
  PENDING: 'Pendente',
  PAUSED: 'Pausada',
  CANCELED: 'Cancelada',
  EXPIRED: 'Expirada',
}

export const PAYMENT_STATUS: Record<string, string> = {
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
