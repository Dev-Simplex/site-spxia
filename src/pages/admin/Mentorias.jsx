import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const statusLabels = { agendada: 'Agendada', concluida: 'Concluída', cancelada: 'Cancelada' }
const statusColors = { agendada: '#60a5fa', concluida: '#4ade80', cancelada: '#888' }

export default function Mentorias() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  useEffect(() => { loadSessions() }, [])

  async function loadSessions() {
    const { data } = await supabase
      .from('mentoring_sessions')
      .select('*, profiles!mentoring_sessions_mentor_id_fkey(full_name)')
      .order('scheduled_at', { ascending: true })
    setSessions(data || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    await supabase.from('mentoring_sessions').insert({
      student_id: user.id,
      title,
      description,
      scheduled_at: scheduledAt,
    })
    setTitle('')
    setDescription('')
    setScheduledAt('')
    setShowForm(false)
    loadSessions()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Mentorias</h1>
          <p className="admin-page-desc">Suas sessões de mentoria agendadas e concluídas.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agendar Mentoria'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label>Assunto</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="O que deseja discutir?" />
          </div>
          <div className="form-group">
            <label>Data e Hora</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Detalhes (opcional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Contexto adicional..." />
          </div>
          <button type="submit" className="btn btn-primary">Agendar</button>
        </form>
      )}

      {loading ? <p className="admin-loading">Carregando...</p> : (
        <div className="session-list">
          {sessions.length === 0 && <p className="admin-empty">Nenhuma sessão agendada.</p>}
          {sessions.map(s => (
            <div key={s.id} className="session-card">
              <div className="session-status" style={{ background: statusColors[s.status] }}>
                {statusLabels[s.status]}
              </div>
              <h3>{s.title}</h3>
              <div className="session-meta">
                <span>{new Date(s.scheduled_at).toLocaleString('pt-BR')}</span>
                <span>{s.duration_min} min</span>
                {s.profiles?.full_name && <span>Mentor: {s.profiles.full_name}</span>}
              </div>
              {s.description && <p>{s.description}</p>}
              {s.meeting_url && (
                <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  Entrar na Reunião
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
