"use client"

import { useEffect, useState, type FormEvent } from "react"

import { PermGuard } from "@/app/admin/perm-guard"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

const prioLabels: Record<string, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
  urgente: "Urgente",
}
const prioColors: Record<string, string> = {
  baixa: "#4ade80",
  normal: "#60a5fa",
  alta: "#fbbf24",
  urgente: "#F90108",
}
const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
  fechado: "Fechado",
}

interface Ticket {
  id: string
  subject: string
  description: string | null
  priority: string
  status: string
  created_at: string
}

interface Message {
  id: string
  author_id: string
  content: string
  created_at: string
  profiles: { full_name: string | null } | null
}

export default function SuportePage() {
  return (
    <PermGuard perm="suporte">
      <Suporte />
    </PermGuard>
  )
}

function Suporte() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("normal")

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false })
    setTickets((data as Ticket[]) || [])
    setLoading(false)
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await supabase.from("support_tickets").insert({
      user_id: user?.id,
      subject,
      description,
      priority,
    })
    setSubject("")
    setDescription("")
    setShowForm(false)
    loadTickets()
  }

  async function openTicket(ticket: Ticket) {
    setSelected(ticket)
    const { data } = await supabase
      .from("support_messages")
      .select("*, profiles(full_name)")
      .eq("ticket_id", ticket.id)
      .order("created_at")
    setMessages((data as Message[]) || [])
  }

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!newMsg.trim() || !selected) return
    await supabase.from("support_messages").insert({
      ticket_id: selected.id,
      author_id: user?.id,
      content: newMsg,
    })
    setNewMsg("")
    openTicket(selected)
  }

  if (selected) {
    return (
      <div className="admin-page">
        <button className="back-btn" onClick={() => setSelected(null)}>
          ← Voltar
        </button>
        <div className="ticket-detail-header">
          <h1>{selected.subject}</h1>
          <span className="ticket-status-badge" style={{ background: prioColors[selected.priority] }}>
            {prioLabels[selected.priority]}
          </span>
          <span className="ticket-status-text">{statusLabels[selected.status]}</span>
        </div>
        <p className="ticket-desc">{selected.description}</p>

        <div className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`message-item${m.author_id === user?.id ? " own" : ""}`}>
              <span className="message-author">{m.profiles?.full_name || "Anônimo"}</span>
              <p>{m.content}</p>
              <span className="message-date">{new Date(m.created_at).toLocaleString("pt-BR")}</span>
            </div>
          ))}
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Enviar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Suporte</h1>
          <p className="admin-page-desc">Precisa de ajuda? Abra um ticket.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Novo Ticket"}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label>Assunto</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Resumo do problema"
            />
          </div>
          <div className="form-group">
            <label>Prioridade</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {Object.entries(prioLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Descreva o problema em detalhes..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Abrir Ticket
          </button>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">Carregando...</p>
      ) : (
        <div className="ticket-list">
          {tickets.length === 0 && <p className="admin-empty">Nenhum ticket encontrado.</p>}
          {tickets.map((t) => (
            <div key={t.id} className="ticket-card" onClick={() => openTicket(t)}>
              <div className="ticket-row">
                <span className="ticket-prio" style={{ background: prioColors[t.priority] }}>
                  {prioLabels[t.priority]}
                </span>
                <span className="ticket-status">{statusLabels[t.status]}</span>
                <span className="ticket-date">{new Date(t.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <h3>{t.subject}</h3>
              <p>{t.description?.slice(0, 120)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
