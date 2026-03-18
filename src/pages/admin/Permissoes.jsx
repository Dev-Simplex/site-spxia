import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const allPermissions = [
  { key: 'dashboard', label: 'Dashboard', desc: 'Ver painel principal' },
  { key: 'comunidade', label: 'Comunidade', desc: 'Acessar posts e comentários' },
  { key: 'mentorias', label: 'Mentorias', desc: 'Agendar e ver mentorias' },
  { key: 'formacoes', label: 'Formações', desc: 'Acessar cursos gravados' },
  { key: 'suporte', label: 'Suporte', desc: 'Abrir e gerenciar tickets' },
  { key: 'financeiro', label: 'Financeiro', desc: 'Ver cobranças e assinaturas' },
  { key: 'produtos', label: 'Produtos', desc: 'Criar e editar produtos (admin)' },
  { key: 'usuarios', label: 'Usuários', desc: 'Gerenciar usuários (admin)' },
  { key: 'permissoes', label: 'Permissões', desc: 'Gerenciar grupos de permissão (admin)' },
]

const emptyGroup = { name: '', description: '', permissions: {}, is_system: false }

export default function Permissoes() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyGroup)
  const [saving, setSaving] = useState(false)
  const [memberCount, setMemberCount] = useState({})

  useEffect(() => { load() }, [])

  async function load() {
    const { data: g } = await supabase.from('permission_groups').select('*').order('name')
    setGroups(g || [])

    // Count members per group
    const { data: profiles } = await supabase.from('profiles').select('group_id')
    const counts = {}
    profiles?.forEach(p => { if (p.group_id) counts[p.group_id] = (counts[p.group_id] || 0) + 1 })
    setMemberCount(counts)
    setLoading(false)
  }

  function openNew() {
    setForm({ ...emptyGroup, permissions: {} })
    setEditing('new')
  }

  function openEdit(g) {
    setForm({ ...g, permissions: g.permissions || {} })
    setEditing(g)
  }

  function togglePerm(key) {
    setForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] }
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, description: form.description, permissions: form.permissions }

    if (editing === 'new') {
      await supabase.from('permission_groups').insert(payload)
    } else {
      await supabase.from('permission_groups').update(payload).eq('id', editing.id)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function handleDelete(g) {
    if (g.is_system) return alert('Grupos do sistema não podem ser excluídos.')
    if (!confirm(`Excluir grupo "${g.name}"? Membros ficarão sem grupo.`)) return
    await supabase.from('permission_groups').delete().eq('id', g.id)
    load()
  }

  // ---- EDIT VIEW ----
  if (editing !== null) {
    return (
      <div className="admin-page">
        <button className="back-btn" onClick={() => setEditing(null)}>← Voltar</button>
        <h1>{editing === 'new' ? 'Novo Grupo' : `Editar: ${form.name}`}</h1>

        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome do grupo *</label>
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required placeholder="Ex: Aluno Premium" />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Breve descrição do grupo" />
            </div>
          </div>

          <div className="form-group">
            <label>Permissões</label>
            <div className="perm-grid">
              {allPermissions.map(p => (
                <label key={p.key} className={`perm-item${form.permissions[p.key] ? ' active' : ''}`}>
                  <input type="checkbox" checked={!!form.permissions[p.key]} onChange={() => togglePerm(p.key)} />
                  <div className="perm-info">
                    <span className="perm-label">{p.label}</span>
                    <span className="perm-desc">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="perm-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
              const all = {}; allPermissions.forEach(p => all[p.key] = true)
              setForm(prev => ({ ...prev, permissions: all }))
            }}>Marcar Todas</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setForm(prev => ({ ...prev, permissions: {} }))}>Desmarcar Todas</button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Salvando...' : editing === 'new' ? 'Criar Grupo' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Grupos de Permissões</h1>
          <p className="admin-page-desc">Defina o que cada tipo de usuário pode acessar.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Novo Grupo</button>
      </div>

      {loading ? <p className="admin-loading">Carregando...</p> : (
        <div className="perm-group-list">
          {groups.map(g => {
            const permCount = Object.values(g.permissions || {}).filter(Boolean).length
            return (
              <div key={g.id} className={`perm-group-card${g.is_system ? ' system' : ''}`}>
                <div className="perm-group-info">
                  <div className="perm-group-header">
                    <h3>{g.name}</h3>
                    {g.is_system && <span className="perm-system-badge">SISTEMA</span>}
                  </div>
                  <p>{g.description || 'Sem descrição'}</p>
                  <div className="perm-group-meta">
                    <span>{permCount}/{allPermissions.length} permissões</span>
                    <span>{memberCount[g.id] || 0} membro{(memberCount[g.id] || 0) !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="perm-tags">
                    {allPermissions.map(p => (
                      <span key={p.key} className={`perm-tag${g.permissions?.[p.key] ? ' on' : ' off'}`}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="perm-group-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => openEdit(g)}>Editar</button>
                  {!g.is_system && (
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(g)}>Excluir</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
