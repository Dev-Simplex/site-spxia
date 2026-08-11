"use client"

import { useEffect, useState } from "react"

import { PermGuard } from "@/app/admin/perm-guard"
import { useAuth } from "@/contexts/auth-context"
import * as asaas from "@/lib/asaas"

/* eslint-disable @typescript-eslint/no-explicit-any */
type Subscription = any
type Payment = any

export default function FinanceiroPage() {
  return (
    <PermGuard perm="financeiro">
      <Financeiro />
    </PermGuard>
  )
}

function Financeiro() {
  const { profile } = useAuth()
  const [tab, setTab] = useState("assinaturas")
  const [subscriptions, setSubs] = useState<Subscription[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Customer Asaas linked to profile
  const [asaasCustomer, setAsaasCustomer] = useState<any>(null)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    setLoading(true)
    setError("")
    try {
      // Try to find customer by CPF/CNPJ or email
      const customers = await asaas.listCustomers({ email: profile?.email || "" })
      if (customers.data?.length > 0) {
        const cust = customers.data[0]
        setAsaasCustomer(cust)

        // Load subscriptions and payments
        const [subs, pays] = await Promise.all([
          asaas.listSubscriptions({ customer: cust.id }),
          asaas.listPayments({ customer: cust.id, limit: "50" }),
        ])
        setSubs(subs.data || [])
        setPayments(pays.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
    setLoading(false)
  }

  // Resumo
  const totalPago = payments
    .filter((p) => ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(p.status))
    .reduce((s, p) => s + Number(p.value), 0)
  const totalPendente = payments
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + Number(p.value), 0)
  const totalVencido = payments
    .filter((p) => p.status === "OVERDUE")
    .reduce((s, p) => s + Number(p.value), 0)
  const subsAtivas = subscriptions.filter((s) => s.status === "ACTIVE").length

  return (
    <div className="admin-page">
      <h1>Financeiro</h1>
      <p className="admin-page-desc">
        Suas assinaturas e cobranças via Asaas.
        {asaasCustomer && <span className="fin-customer-id"> ID: {asaasCustomer.id}</span>}
      </p>

      {error && <div className="login-error">{error}</div>}

      <div className="fin-summary">
        <div className="fin-card">
          <span className="fin-label">Assinaturas Ativas</span>
          <span className="fin-value" style={{ color: "#4ade80" }}>
            {subsAtivas}
          </span>
        </div>
        <div className="fin-card">
          <span className="fin-label">Total Pago</span>
          <span className="fin-value" style={{ color: "#4ade80" }}>
            R$ {totalPago.toFixed(2)}
          </span>
        </div>
        <div className="fin-card">
          <span className="fin-label">Pendente</span>
          <span className="fin-value" style={{ color: "#fbbf24" }}>
            R$ {totalPendente.toFixed(2)}
          </span>
        </div>
        <div className="fin-card">
          <span className="fin-label">Vencido</span>
          <span className="fin-value" style={{ color: "var(--red)" }}>
            R$ {totalVencido.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn${tab === "assinaturas" ? " active" : ""}`}
          onClick={() => setTab("assinaturas")}
        >
          Assinaturas
        </button>
        <button
          className={`filter-btn${tab === "cobrancas" ? " active" : ""}`}
          onClick={() => setTab("cobrancas")}
        >
          Cobranças
        </button>
      </div>

      {loading ? (
        <p className="admin-loading">Carregando dados do Asaas...</p>
      ) : tab === "assinaturas" ? (
        <SubscriptionsList subscriptions={subscriptions} />
      ) : (
        <PaymentsList payments={payments} />
      )}
    </div>
  )
}

function SubscriptionsList({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) return <p className="admin-empty">Nenhuma assinatura encontrada.</p>

  return (
    <div className="sub-list">
      {subscriptions.map((s) => (
        <div key={s.id} className="sub-card">
          <div className="sub-header">
            <h3>{s.description || s.id}</h3>
            <span
              className={`sub-status ${
                s.status === "ACTIVE" ? "ativa" : s.status === "CANCELED" ? "cancelada" : "expirada"
              }`}
            >
              {asaas.SUB_STATUS[s.status] || s.status}
            </span>
          </div>
          <div className="sub-details">
            <span>
              R$ {Number(s.value).toFixed(2)} / {asaas.CYCLES[s.cycle] || s.cycle}
            </span>
            <span>{asaas.BILLING_TYPES[s.billingType] || s.billingType}</span>
            {s.nextDueDate && <span>Próximo: {formatDate(s.nextDueDate)}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function PaymentsList({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) return <p className="admin-empty">Nenhuma cobrança encontrada.</p>

  return (
    <div className="fin-table-wrap">
      <table className="fin-table">
        <thead>
          <tr>
            <th>Vencimento</th>
            <th>Descrição</th>
            <th>Forma</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaymentRow({ payment: p }: { payment: Payment }) {
  const [pixData, setPixData] = useState<any>(null)
  const [loadingPix, setLoadingPix] = useState(false)

  const statusColor: Record<string, string> = {
    PENDING: "#fbbf24",
    RECEIVED: "#4ade80",
    CONFIRMED: "#4ade80",
    OVERDUE: "#F90108",
    REFUNDED: "#888",
    RECEIVED_IN_CASH: "#4ade80",
  }

  async function handlePix() {
    setLoadingPix(true)
    try {
      const data = await asaas.getPixQrCode(p.id)
      setPixData(data)
    } catch (err) {
      alert("Erro ao gerar Pix: " + (err instanceof Error ? err.message : String(err)))
    }
    setLoadingPix(false)
  }

  return (
    <>
      <tr>
        <td>{formatDate(p.dueDate)}</td>
        <td>{p.description || "—"}</td>
        <td>
          <span className="fin-type receita">{asaas.BILLING_TYPES[p.billingType] || p.billingType}</span>
        </td>
        <td className="fin-amount receita">R$ {Number(p.value).toFixed(2)}</td>
        <td>
          <span className="fin-status" style={{ color: statusColor[p.status] || "#888" }}>
            {asaas.PAYMENT_STATUS[p.status] || p.status}
          </span>
        </td>
        <td>
          {p.status === "PENDING" && p.billingType === "PIX" && (
            <button className="btn btn-primary btn-sm" onClick={handlePix} disabled={loadingPix}>
              {loadingPix ? "..." : "Pix QR"}
            </button>
          )}
          {p.status === "PENDING" && p.billingType === "BOLETO" && p.bankSlipUrl && (
            <a
              href={p.bankSlipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Boleto
            </a>
          )}
          {p.invoiceUrl && (
            <a
              href={p.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 4 }}
            >
              Fatura
            </a>
          )}
        </td>
      </tr>
      {pixData && (
        <tr>
          <td colSpan={6}>
            <div className="pix-qr-container">
              {pixData.encodedImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code Pix"
                  className="pix-qr-img"
                />
              )}
              {pixData.payload && (
                <div className="pix-payload">
                  <label>Copia e Cola:</label>
                  <input
                    readOnly
                    value={pixData.payload}
                    onClick={(e) => {
                      e.currentTarget.select()
                      navigator.clipboard.writeText(pixData.payload)
                    }}
                  />
                  <span className="pix-hint">Clique para copiar</span>
                </div>
              )}
              <button className="back-btn" onClick={() => setPixData(null)}>
                Fechar
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}
