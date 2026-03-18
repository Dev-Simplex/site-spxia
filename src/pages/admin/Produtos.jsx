import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const typeLabels = { one_time: 'Pagamento Único', subscription: 'Assinatura' }
const cycleLabels = { MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', SEMIANNUALLY: 'Semestral', YEARLY: 'Anual' }

const emptyProduct = {
  title: '', slug: '', description: '', long_description: '', price: '', original_price: '',
  type: 'one_time', billing_cycle: 'MONTHLY', category: '', thumbnail_url: '',
  features: [], is_published: false, is_featured: false, sort_order: 0, max_installments: 1,
}

export default function Produtos() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' or product obj
  const [form, setForm] = useState(emptyProduct)
  const [featureInput, setFeatureInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('products').select('*').order('sort_order')
    setProducts(data || [])
    setLoading(false)
  }

  function openNew() {
    setForm({ ...emptyProduct })
    setEditing('new')
  }

  function openEdit(p) {
    setForm({
      ...p,
      features: Array.isArray(p.features) ? p.features : [],
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
    })
    setEditing(p)
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addFeature() {
    if (!featureInput.trim()) return
    setForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }))
    setFeatureInput('')
  }

  function removeFeature(idx) {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
  }

  function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      description: form.description,
      long_description: form.long_description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      type: form.type,
      billing_cycle: form.type === 'subscription' ? form.billing_cycle : null,
      category: form.category,
      thumbnail_url: form.thumbnail_url,
      features: form.features,
      is_published: form.is_published,
      is_featured: form.is_featured,
      sort_order: parseInt(form.sort_order) || 0,
      max_installments: parseInt(form.max_installments) || 1,
      updated_at: new Date().toISOString(),
    }

    if (editing === 'new') {
      await supabase.from('products').insert(payload)
    } else {
      await supabase.from('products').update(payload).eq('id', editing.id)
    }

    setSaving(false)
    setEditing(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  async function togglePublish(p) {
    await supabase.from('products').update({ is_published: !p.is_published }).eq('id', p.id)
    load()
  }

  // ---- FORM VIEW ----
  if (editing !== null) {
    return (
      <div className="admin-page">
        <button className="back-btn" onClick={() => setEditing(null)}>← Voltar</button>
        <h1>{editing === 'new' ? 'Novo Produto' : 'Editar Produto'}</h1>

        <form className="admin-form product-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Título *</label>
              <input value={form.title} onChange={e => { updateField('title', e.target.value); if (editing === 'new') updateField('slug', generateSlug(e.target.value)) }} required />
            </div>
            <div className="form-group">
              <label>Slug (URL)</label>
              <input value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="gerado-automatico" />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição curta</label>
            <input value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Resumo em 1 linha" />
          </div>

          <div className="form-group">
            <label>Descrição completa</label>
            <textarea value={form.long_description} onChange={e => updateField('long_description', e.target.value)} rows={4} placeholder="Descrição detalhada do produto..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select value={form.type} onChange={e => updateField('type', e.target.value)}>
                <option value="one_time">Pagamento Único</option>
                <option value="subscription">Assinatura Recorrente</option>
              </select>
            </div>
            {form.type === 'subscription' && (
              <div className="form-group">
                <label>Ciclo</label>
                <select value={form.billing_cycle} onChange={e => updateField('billing_cycle', e.target.value)}>
                  {Object.entries(cycleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Categoria</label>
              <input value={form.category} onChange={e => updateField('category', e.target.value)} placeholder="Ex: Curso, Mentoria, SaaS" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preço (R$) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => updateField('price', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Preço original (riscado)</label>
              <input type="number" step="0.01" value={form.original_price} onChange={e => updateField('original_price', e.target.value)} placeholder="Opcional" />
            </div>
            <div className="form-group">
              <label>Máx. parcelas</label>
              <input type="number" min="1" max="12" value={form.max_installments} onChange={e => updateField('max_installments', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>URL da Thumbnail</label>
            <input value={form.thumbnail_url} onChange={e => updateField('thumbnail_url', e.target.value)} placeholder="https://..." />
          </div>

          <div className="form-group">
            <label>Benefícios / Features</label>
            <div className="feature-input-row">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Ex: Acesso vitalício" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
              <button type="button" className="btn btn-primary btn-sm" onClick={addFeature}>+</button>
            </div>
            <ul className="feature-list">
              {form.features.map((f, i) => (
                <li key={i}>
                  <span>{f}</span>
                  <button type="button" onClick={() => removeFeature(i)}>×</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ordem</label>
              <input type="number" value={form.sort_order} onChange={e => updateField('sort_order', e.target.value)} />
            </div>
            <div className="form-group form-check-group">
              <label><input type="checkbox" checked={form.is_published} onChange={e => updateField('is_published', e.target.checked)} /> Publicado</label>
              <label><input type="checkbox" checked={form.is_featured} onChange={e => updateField('is_featured', e.target.checked)} /> Destaque</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : editing === 'new' ? 'Criar Produto' : 'Salvar Alterações'}
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
          <h1>Produtos</h1>
          <p className="admin-page-desc">Gerencie seus produtos, cursos e assinaturas.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Novo Produto</button>
      </div>

      {loading ? <p className="admin-loading">Carregando...</p> : (
        <div className="product-list">
          {products.length === 0 && <p className="admin-empty">Nenhum produto cadastrado.</p>}
          {products.map(p => (
            <div key={p.id} className={`product-admin-card${!p.is_published ? ' draft' : ''}`}>
              <div className="product-admin-info">
                <div className="product-admin-badges">
                  <span className={`product-badge ${p.is_published ? 'published' : 'draft-badge'}`}>
                    {p.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="product-badge type">{typeLabels[p.type]}</span>
                  {p.is_featured && <span className="product-badge featured">Destaque</span>}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <span className="product-admin-price">
                  R$ {Number(p.price).toFixed(2)}
                  {p.type === 'subscription' && <span> / {cycleLabels[p.billing_cycle] || p.billing_cycle}</span>}
                </span>
              </div>
              <div className="product-admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => togglePublish(p)}>
                  {p.is_published ? 'Despublicar' : 'Publicar'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
