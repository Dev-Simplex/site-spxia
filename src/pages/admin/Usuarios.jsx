import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const roleLabels = { admin: 'Administrador', mentor: 'Mentor', member: 'Membro' }
const roleColors = { admin: '#ED3237', mentor: '#60a5fa', member: '#4ade80' }

export default function Usuarios() {
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  // Edit form
  const [formRole, setFormRole] = useState('member')
  const [formGroup, setFormGroup] = useState('')
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: u }, { data: g }] = await Promise.all([
      supabase.from('profiles').select('*, permission_groups(name)').order('created_at', { ascending: false }),
      supabase.from('permission_groups').select('*').order('name'),
    ])
    setUsers(u || [])
    setGroups(g || [])
    setLoading(false)
  }

  function openEdit(user) {
    setEditing(user)
    setFormRole(user.role || 'member')
    setFormGroup(user.group_id || '')
    setFormName(user.full_name || '')
    setFormPhone(user.phone || '')
    setFormCompany(user.company || '')
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({
      role: formRole,
      group_id: formGroup || null,
      full_name: formName,
      phone: formPhone,
      company: formCompany,
      updated_at: new Date().toISOString(),
    }).eq('id', editing.id)
    setSaving(false)
    setEditing(null)
    load()
  }

  const filtered = users.filter(u => {
    if (!search) return true
    const s = search.toLowerCase()
    return (u.full_name || '').toLowerCase().includes(s)
      || (u.company || '').toLowerCase().includes(s)
      || (u.role || '').toLowerCase().includes(s)
  })

  if (editing) {
    return (
      <div className="admin-page">
        <button className="back-btn" onClick={() => setEditing(null)}>← Voltar</button>
        <h1>Editar Usuário</h1>
        <p className="admin-page-desc">ID: {editing.id}</p>

        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome completo</label>
              <input value={formName} onChange={e => setFormName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input value={formPhone} onChange={e => setFormPhone(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Empresa</label>
              <input value={formCompany} onChange={e => setFormCompany(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Role (Tipo)</label>
              <select value={formRole} onChange={e => setFormRole(e.target.value)}>
                <option value="member">Membro</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Grupo de Permissões</label>
            <select value={formGroup} onChange={e => setFormGroup(e.target.value)}>
              <option value="">— Sem grupo (usa padrão do role) —</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>

        <div className="user-detail-section">
          <h3>Informações</h3>
          <div className="user-detail-grid">
            <div><span className="user-detail-label">Criado em</span><span>{new Date(editing.created_at).toLocaleDateString('pt-BR')}</span></div>
            <div><span className="user-detail-label">Último update</span><span>{editing.updated_at ? new Date(editing.updated_at).toLocaleDateString('pt-BR') : '—'}</span></div>
            <div><span className="user-detail-label">Bio</span><span>{editing.bio || '—'}</span></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Usuários</h1>
          <p className="admin-page-desc">{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="user-search">
        <input
          placeholder="Buscar por nome, empresa ou role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <p className="admin-loading">Carregando...</p> : (
        <div className="user-list">
          {filtered.length === 0 && <p className="admin-empty">Nenhum usuário encontrado.</p>}
          {filtered.map(u => (
            <div key={u.id} className="user-card" onClick={() => openEdit(u)}>
              <div className="user-avatar-col">
                <div className="sidebar-avatar" style={{ background: roleColors[u.role] || '#888' }}>
                  {(u.full_name || '?').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="user-info-col">
                <span className="user-name">{u.full_name || 'Sem nome'}</span>
                <span className="user-meta">
                  {u.company && <span>{u.company} · </span>}
                  {u.permission_groups?.name || 'Sem grupo'}
                </span>
              </div>
              <div className="user-role-col">
                <span className="user-role-badge" style={{ color: roleColors[u.role], borderColor: roleColors[u.role] }}>
                  {roleLabels[u.role] || u.role}
                </span>
              </div>
              <div className="user-date-col">
                {new Date(u.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
