"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { PermGuard } from "@/app/admin/perm-guard"
import { supabase } from "@/lib/supabase"

const statusLabels: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em Contato",
  agendado: "Agendado",
  concluido: "Concluído",
  descartado: "Descartado",
}
const statusColors: Record<string, string> = {
  novo: "var(--accent-brand-text)",
  em_contato: "#fbbf24",
  agendado: "#60a5fa",
  concluido: "#4ade80",
  descartado: "#888",
}

const questionLabels: Record<string, string> = {
  q1: "Objetivo ao investir em IA",
  q2: "Resultados abaixo do esperado",
  q3: "Processos repetitivos e manuais",
  q4: "Áreas com gargalos",
  q5: "Tarefas que dependem de pessoas",
  q6: "Onde a empresa perde dinheiro",
  q7: "Indicadores a melhorar com IA",
  q8: "Dados organizados?",
  q9: "Onde estão os dados",
  q10: "Qualidade dos dados",
  q11: "Sistemas integráveis",
  q12: "Decisões por feeling",
  q13: "Volume de demanda",
  q14: "Atividades que precisam de velocidade",
  q15: "Áreas que precisam de padronização",
  q16: "Equipe preparada para IA?",
  q17: "Responsáveis internos",
  q18: "Riscos a controlar",
  q19: "Orçamento e expectativa de retorno",
  q20: "IA em 90 dias: o que muda?",
}

interface Diagnostic {
  id: string
  name: string
  email: string
  whatsapp: string | null
  company_name: string | null
  cnpj: string | null
  industry: string | null
  business_description: string | null
  answers: Record<string, string> | null
  status: string
  notes: string | null
  ai_analysis: string | null
  created_at: string
}

export default function DiagnosticosPage() {
  return (
    <PermGuard perm="diagnosticos">
      <Diagnosticos />
    </PermGuard>
  )
}

function Diagnosticos() {
  const [items, setItems] = useState<Diagnostic[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Diagnostic | null>(null)
  const [notes, setNotes] = useState("")
  const [filter, setFilter] = useState("todos")
  const [tab, setTab] = useState("info") // info | respostas | analise
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from("diagnostics")
      .select("*")
      .order("created_at", { ascending: false })
    setItems((data as Diagnostic[]) || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("diagnostics")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : prev))
    load()
  }

  async function saveNotes() {
    if (!selected) return
    await supabase
      .from("diagnostics")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", selected.id)
    load()
  }

  async function generateAnalysis() {
    if (!selected) return
    setAnalyzing(true)
    const analysis = buildLocalAnalysis(selected)
    await supabase
      .from("diagnostics")
      .update({ ai_analysis: analysis, updated_at: new Date().toISOString() })
      .eq("id", selected.id)
    setSelected((prev) => (prev ? { ...prev, ai_analysis: analysis } : prev))
    setAnalyzing(false)
  }

  function openDetail(item: Diagnostic) {
    setSelected(item)
    setNotes(item.notes || "")
    setTab("info")
  }

  const filtered = filter === "todos" ? items : items.filter((i) => i.status === filter)
  const counts: Record<string, number> = {}
  items.forEach((i) => {
    counts[i.status] = (counts[i.status] || 0) + 1
  })
  const answeredCount = selected?.answers ? Object.values(selected.answers).filter(Boolean).length : 0

  // ---- DETAIL ----
  if (selected) {
    return (
      <div className="admin-page">
        <button className="back-btn" onClick={() => setSelected(null)}>
          ← Voltar
        </button>

        <div className="diag-detail-header">
          <div>
            <h1>{selected.name}</h1>
            <span className="diag-detail-company">
              {selected.company_name && <strong>{selected.company_name}</strong>}
              {selected.industry && <span> · {selected.industry}</span>}
              {selected.cnpj && <span> · {selected.cnpj}</span>}
            </span>
            <span className="diag-detail-date">
              {new Date(selected.created_at).toLocaleString("pt-BR")}
            </span>
          </div>
          <span
            className="diag-status-badge"
            style={{
              background: selected.status === "novo" ? "var(--accent-brand)" : statusColors[selected.status],
              color: selected.status === "novo" ? "#fff" : "#000",
            }}
          >
            {statusLabels[selected.status]}
          </span>
        </div>

        {/* Tabs */}
        <div className="filter-bar" style={{ marginBottom: 20 }}>
          <button
            className={`filter-btn${tab === "info" ? " active" : ""}`}
            onClick={() => setTab("info")}
          >
            Contato
          </button>
          <button
            className={`filter-btn${tab === "respostas" ? " active" : ""}`}
            onClick={() => setTab("respostas")}
          >
            Respostas ({answeredCount}/20)
          </button>
          <button
            className={`filter-btn${tab === "analise" ? " active" : ""}`}
            onClick={() => setTab("analise")}
          >
            Análise IA {selected.ai_analysis ? "✓" : ""}
          </button>
        </div>

        {/* TAB: INFO */}
        {tab === "info" && (
          <>
            <div className="diag-detail-grid">
              <div className="diag-detail-card">
                <h3>Contato</h3>
                <div className="diag-detail-row">
                  <span className="diag-detail-label">E-mail</span>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <div className="diag-detail-row">
                  <span className="diag-detail-label">WhatsApp</span>
                  <a
                    href={`https://wa.me/55${selected.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.whatsapp || "Não informado"}
                  </a>
                </div>
                <div className="diag-detail-row">
                  <span className="diag-detail-label">Empresa</span>
                  <span>{selected.company_name || "Não informado"}</span>
                </div>
                <div className="diag-detail-row">
                  <span className="diag-detail-label">CNPJ</span>
                  <span>{selected.cnpj || "Não informado"}</span>
                </div>
                <div className="diag-detail-row">
                  <span className="diag-detail-label">Ramo</span>
                  <span>{selected.industry || "Não informado"}</span>
                </div>
              </div>
              <div className="diag-detail-card">
                <h3>Descrição do Negócio</h3>
                <p className="diag-detail-business">{selected.business_description}</p>
              </div>
            </div>

            <div className="diag-detail-card" style={{ marginTop: 16 }}>
              <h3>Status</h3>
              <div className="diag-status-actions">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`diag-status-btn${selected.status === key ? " active" : ""}`}
                    style={{ "--sc": statusColors[key] } as CSSProperties}
                    onClick={() => updateStatus(selected.id, key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="diag-detail-card" style={{ marginTop: 16 }}>
              <h3>Anotações Internas</h3>
              <textarea
                className="diag-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Observações sobre o contato..."
              />
              <button className="btn btn-primary btn-sm" onClick={saveNotes} style={{ marginTop: 8 }}>
                Salvar
              </button>
            </div>
          </>
        )}

        {/* TAB: RESPOSTAS */}
        {tab === "respostas" && (
          <div className="diag-answers">
            {Object.entries(questionLabels).map(([key, label]) => {
              const answer = selected.answers?.[key]
              return (
                <div key={key} className={`diag-answer-item${answer ? "" : " empty"}`}>
                  <div className="diag-answer-header">
                    <span className="diag-answer-num">{key.replace("q", "")}</span>
                    <span className="diag-answer-label">{label}</span>
                    {answer && <span className="diag-answer-check">✓</span>}
                  </div>
                  <p className="diag-answer-text">{answer || "Não respondida"}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* TAB: ANÁLISE IA */}
        {tab === "analise" && (
          <div className="diag-analysis">
            {!selected.ai_analysis ? (
              <div className="diag-analysis-empty">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-brand-text)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <h3>Análise ainda não gerada</h3>
                <p>Clique no botão abaixo para gerar uma pré-análise baseada nas respostas do diagnóstico.</p>
                <button className="btn btn-primary" onClick={generateAnalysis} disabled={analyzing}>
                  {analyzing ? "Analisando..." : "Gerar Pré-Análise com IA"}
                </button>
              </div>
            ) : (
              <div className="diag-analysis-content">
                <div className="diag-analysis-header">
                  <h3>Pré-análise: {selected.company_name || selected.name}</h3>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={generateAnalysis}
                    disabled={analyzing}
                  >
                    {analyzing ? "Regenerando..." : "Regenerar"}
                  </button>
                </div>
                <div className="diag-analysis-body">
                  {selected.ai_analysis.split("\n").map((line, i) => {
                    if (line.startsWith("## "))
                      return (
                        <h3 key={i} className="analysis-h3">
                          {line.replace("## ", "")}
                        </h3>
                      )
                    if (line.startsWith("### "))
                      return (
                        <h4 key={i} className="analysis-h4">
                          {line.replace("### ", "")}
                        </h4>
                      )
                    if (line.startsWith("- "))
                      return (
                        <li key={i} className="analysis-li">
                          {line.replace("- ", "")}
                        </li>
                      )
                    if (line.startsWith("**") && line.endsWith("**"))
                      return (
                        <strong key={i} className="analysis-bold">
                          {line.replace(/\*\*/g, "")}
                        </strong>
                      )
                    if (line.trim() === "") return <br key={i} />
                    return (
                      <p key={i} className="analysis-p">
                        {line}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // ---- LIST ----
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Diagnósticos</h1>
          <p className="admin-page-desc">
            {items.length} solicitação{items.length !== 1 ? "ões" : ""}
          </p>
        </div>
      </div>

      <div className="diag-counters">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="diag-counter" style={{ borderColor: statusColors[key] }}>
            <span className="diag-counter-value" style={{ color: statusColors[key] }}>
              {counts[key] || 0}
            </span>
            <span className="diag-counter-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn${filter === "todos" ? " active" : ""}`}
          onClick={() => setFilter("todos")}
        >
          Todos ({items.length})
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn${filter === key ? " active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin-loading">Carregando...</p>
      ) : (
        <div className="diag-list">
          {filtered.length === 0 && <p className="admin-empty">Nenhuma solicitação.</p>}
          {filtered.map((item) => {
            const answered = item.answers ? Object.values(item.answers).filter(Boolean).length : 0
            return (
              <div key={item.id} className="diag-card" onClick={() => openDetail(item)}>
                <div className="diag-card-header">
                  <div className="diag-card-info">
                    <span className="diag-card-name">{item.name}</span>
                    <span className="diag-card-email">
                      {item.company_name ? `${item.company_name} · ` : ""}
                      {item.email}
                    </span>
                  </div>
                  <div className="diag-card-right">
                    <span
                      className="diag-card-status"
                      style={{
                        background: item.status === "novo" ? "var(--accent-brand)" : statusColors[item.status],
                        color: item.status === "novo" ? "#fff" : "#000",
                      }}
                    >
                      {statusLabels[item.status]}
                    </span>
                    {item.ai_analysis && <span className="diag-card-ai">IA ✓</span>}
                    <span className="diag-card-date">{timeAgo(item.created_at)}</span>
                  </div>
                </div>
                <p className="diag-card-desc">
                  {item.business_description?.slice(0, 150)}
                  {(item.business_description?.length || 0) > 150 ? "..." : ""}
                </p>
                <div className="diag-card-footer">
                  {item.industry && <span className="diag-card-industry">{item.industry}</span>}
                  <span className="diag-card-answered">{answered}/20 respostas</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---- PRÉ-ANÁLISE LOCAL (baseada em regras) ----
function buildLocalAnalysis(diag: Diagnostic) {
  const a: Record<string, string> = diag.answers || {}
  const name = diag.company_name || diag.name
  const industry = diag.industry || "não informado"

  let analysis = `## Pré-análise de diagnóstico: ${name}\n`
  analysis += `**Ramo:** ${industry} | **Contato:** ${diag.name} (${diag.email})\n\n`

  // Resumo
  analysis += `### RESUMO EXECUTIVO\n`
  analysis += `A empresa ${name} do ramo de ${industry} busca implementar IA com foco em: ${a.q1 || "não especificado"}. `
  analysis += `Os principais desafios atuais incluem: ${a.q2 || "não detalhados"}. `
  const dataReady = (a.q8 || "").toLowerCase()
  if (dataReady.includes("sim") || dataReady.includes("organiz")) {
    analysis += `A empresa demonstra maturidade em dados, o que facilita a implementação.\n\n`
  } else {
    analysis += `Há necessidade de estruturar dados antes de avançar com projetos complexos de IA.\n\n`
  }

  // Oportunidades
  analysis += `### OPORTUNIDADES DE IA IDENTIFICADAS\n`
  if (a.q3) analysis += `- **Alta prioridade (automação de processos):** ${a.q3}\n`
  if (a.q5) analysis += `- **Alta prioridade (decisões assistidas):** ${a.q5}\n`
  if (a.q14) analysis += `- **Média prioridade (velocidade operacional):** ${a.q14}\n`
  if (a.q15) analysis += `- **Média prioridade (padronização):** ${a.q15}\n`
  if (a.q12) analysis += `- **Média prioridade (decisões baseadas em dados):** ${a.q12}\n`
  analysis += "\n"

  // Quick wins
  analysis += `### PROCESSOS PARA AUTOMAÇÃO IMEDIATA (30 dias)\n`
  if (a.q3) analysis += `- Automatizar processos repetitivos: ${a.q3}\n`
  if (a.q6) analysis += `- Atacar desperdício: ${a.q6}\n`
  if (a.q4) analysis += `- Resolver gargalos em: ${a.q4}\n`
  analysis += "\n"

  // Riscos
  analysis += `### RISCOS E ALERTAS\n`
  if (a.q18) analysis += `- Riscos identificados pela empresa: ${a.q18}\n`
  if (a.q10) analysis += `- Qualidade dos dados: ${a.q10}\n`
  if (a.q16) {
    const ready = (a.q16 || "").toLowerCase()
    if (ready.includes("não") || ready.includes("pouco") || ready.includes("resistência")) {
      analysis += `- **ALERTA:** Equipe pode não estar preparada; considerar programa de treinamento.\n`
    }
  }
  if (!a.q17 || a.q17.toLowerCase().includes("não")) {
    analysis += `- **ALERTA:** Sem responsável interno definido; o projeto corre o risco de perder força.\n`
  }
  analysis += "\n"

  // ROI
  analysis += `### ROI ESTIMADO (90 dias)\n`
  if (a.q7) analysis += `- Indicadores-alvo: ${a.q7}\n`
  if (a.q19) analysis += `- Orçamento/expectativa: ${a.q19}\n`
  if (a.q20) analysis += `- Visão de sucesso em 90 dias: ${a.q20}\n`
  analysis += "\n"

  // Plano
  analysis += `### PLANO DE AÇÃO SUGERIDO\n`
  analysis += `1. **Semana 1:** Reunião de alinhamento com ${a.q17 || "responsáveis internos"}\n`
  analysis += `2. **Semana 2:** Mapeamento detalhado dos processos em ${a.q4 || "áreas críticas"}\n`
  analysis += `3. **Semana 3-4:** Implementação de quick wins em automação\n`
  analysis += `4. **Mês 2:** Integração com sistemas existentes (${a.q11 || "a mapear"})\n`
  analysis += `5. **Mês 3:** Monitoramento de resultados e expansão\n`

  return analysis
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
