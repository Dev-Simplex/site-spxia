import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import usePermissions from '../../hooks/usePermissions'

export default function Dashboard() {
  const { profile } = useAuth()
  const { isPending, isActive, isAdmin, can, userProducts } = usePermissions()
  const [stats, setStats] = useState({ posts: 0, sessions: 0, tickets: 0, courses: 0 })

  useEffect(() => {
    if (!isActive() && !isAdmin()) return
    async function load() {
      const [posts, sessions, tickets, courses] = await Promise.all([
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('mentoring_sessions').select('id', { count: 'exact', head: true }),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        posts: posts.count || 0,
        sessions: sessions.count || 0,
        tickets: tickets.count || 0,
        courses: courses.count || 0,
      })
    }
    load()
  }, [profile])

  // ---- PENDENTE ----
  if (isPending()) {
    return (
      <div className="admin-page">
        <div className="pending-banner">
          <div className="pending-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1>Conta <em>pendente</em></h1>
          <p>Sua conta está aguardando a confirmação do pagamento para liberar o acesso completo à plataforma.</p>
          <div className="pending-steps">
            <div className="pending-step done">
              <span className="pending-step-num">1</span>
              <span>Conta criada</span>
            </div>
            <div className="pending-step waiting">
              <span className="pending-step-num">2</span>
              <span>Pagamento pendente</span>
            </div>
            <div className="pending-step">
              <span className="pending-step-num">3</span>
              <span>Acesso liberado</span>
            </div>
          </div>
          <p className="pending-info">
            Se você já realizou o pagamento, aguarde alguns minutos para a confirmação automática.
            Caso precise de ajuda, entre em contato: <strong>contato@simplexsolucoes.com.br</strong>
          </p>
          <a href="/" className="btn btn-secondary" style={{ marginTop: 16 }}>Voltar ao site</a>
        </div>
      </div>
    )
  }

  // ---- ATIVO ----
  return (
    <div className="admin-page">
      <h1>Olá, <em>{profile?.full_name || 'Membro'}</em></h1>
      <p className="admin-page-desc">Bem-vindo à área de membros SPXIA.</p>

      {userProducts.length > 0 && (
        <div className="dash-my-products">
          <h3>Meus Produtos</h3>
          <div className="dash-products-grid">
            {userProducts.map(up => (
              <div key={up.id} className="dash-product-card">
                <span className="dash-product-status active">Ativo</span>
                <h4>{up.products?.title || 'Produto'}</h4>
                <span className="dash-product-cat">{up.products?.category || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dash-stats">
        <DashCard value={stats.posts} label="Posts na Comunidade" color="var(--red)" />
        <DashCard value={stats.sessions} label="Sessões de Mentoria" color="#4ade80" />
        <DashCard value={stats.courses} label="Formações Disponíveis" color="#60a5fa" />
        <DashCard value={stats.tickets} label="Tickets de Suporte" color="#fbbf24" />
      </div>

      <div className="dash-quick">
        <h3>Acesso Rápido</h3>
        <div className="dash-quick-grid">
          {can('comunidade') && <a href="/admin/comunidade" className="dash-quick-item"><span>Comunidade</span><span className="dash-quick-arrow">→</span></a>}
          {can('mentorias') && <a href="/admin/mentorias" className="dash-quick-item"><span>Agendar Mentoria</span><span className="dash-quick-arrow">→</span></a>}
          {can('formacoes') && <a href="/admin/formacoes" className="dash-quick-item"><span>Minhas Formações</span><span className="dash-quick-arrow">→</span></a>}
          {can('suporte') && <a href="/admin/suporte" className="dash-quick-item"><span>Abrir Ticket</span><span className="dash-quick-arrow">→</span></a>}
        </div>
      </div>
    </div>
  )
}

function DashCard({ value, label, color }) {
  return (
    <div className="dash-stat-card">
      <span className="dash-stat-value" style={{ color }}>{value}</span>
      <span className="dash-stat-label">{label}</span>
    </div>
  )
}
