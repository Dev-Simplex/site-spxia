import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import usePermissions from '../../hooks/usePermissions'

const STORAGE_URL = 'https://tdthuluyohqtmdhegjhf.supabase.co/storage/v1/object/public/course-files'
const levelLabels = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' }

export default function Formacoes() {
  const { user } = useAuth()
  const { isAdmin } = usePermissions()
  const [courses, setCourses] = useState([])
  const [view, setView] = useState('list') // list | manage | player
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCourses() }, [])

  async function loadCourses() {
    const { data } = await supabase.from('courses').select('*').order('sort_order')
    setCourses(data || [])
    setLoading(false)
  }

  function openPlayer(course) { setSelectedCourse(course); setView('player') }
  function openManage(course) { setSelectedCourse(course); setView('manage') }
  function backToList() { setView('list'); setSelectedCourse(null); loadCourses() }

  if (view === 'manage' && isAdmin()) return <CourseManager course={selectedCourse} onBack={backToList} />
  if (view === 'player') return <CoursePlayer courseId={selectedCourse.id} userId={user.id} onBack={backToList} />

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Formações</h1>
          <p className="admin-page-desc">Cursos e treinamentos gravados. Aprenda no seu ritmo.</p>
        </div>
        {isAdmin() && <button className="btn btn-primary" onClick={() => { setSelectedCourse(null); setView('manage') }}>+ Nova Formação</button>}
      </div>

      {loading ? <p className="admin-loading">Carregando...</p> : (
        <div className="course-catalog">
          {courses.length === 0 && <p className="admin-empty">Nenhuma formação disponível.</p>}
          {courses.map(c => (
            <div key={c.id} className="course-catalog-card">
              {c.thumbnail_url && <img src={c.thumbnail_url} alt={c.title} className="course-catalog-thumb" />}
              <div className="course-catalog-body">
                <div className="course-catalog-meta">
                  {c.category && <span className="course-catalog-cat">{c.category}</span>}
                  <span className="course-catalog-level">{levelLabels[c.level] || c.level}</span>
                  {c.total_hours && <span className="course-catalog-hours">{c.total_hours}h</span>}
                </div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                {c.instructor_name && <span className="course-catalog-instructor">Por {c.instructor_name}</span>}
                <div className="course-catalog-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => openPlayer(c)}>Acessar Curso</button>
                  {isAdmin() && <button className="btn btn-secondary btn-sm" onClick={() => openManage(c)}>Gerenciar</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// COURSE MANAGER (Admin) — estilo Udemy backend
// ==========================================
function CourseManager({ course, onBack }) {
  const [form, setForm] = useState(() => {
    const defaults = {
      title: '', description: '', category: '', level: 'iniciante', instructor_name: '',
      instructor_bio: '', total_hours: '', thumbnail_url: '', is_published: false,
      requirements: [], what_you_learn: [],
    }
    if (!course) return defaults
    return {
      ...defaults,
      ...course,
      total_hours: course.total_hours != null ? String(course.total_hours) : '',
      requirements: Array.isArray(course.requirements) ? course.requirements : [],
      what_you_learn: Array.isArray(course.what_you_learn) ? course.what_you_learn : [],
    }
  })
  const [modules, setModules] = useState([])
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('info') // info | curriculum
  const [courseId, setCourseId] = useState(course?.id || null)

  useEffect(() => { if (courseId) loadModules() }, [courseId])

  async function loadModules() {
    const { data } = await supabase
      .from('course_modules')
      .select('*, lessons(*, lesson_materials(*))')
      .eq('course_id', courseId)
      .order('sort_order')
    setModules((data || []).map(m => ({
      ...m,
      lessons: (m.lessons || []).sort((a, b) => a.sort_order - b.sort_order)
    })))
  }

  async function saveCourse(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title, description: form.description, category: form.category,
      level: form.level, instructor_name: form.instructor_name, instructor_bio: form.instructor_bio,
      total_hours: form.total_hours ? parseFloat(form.total_hours) : null,
      thumbnail_url: form.thumbnail_url, is_published: form.is_published,
      requirements: form.requirements || [], what_you_learn: form.what_you_learn || [],
      updated_at: new Date().toISOString(),
    }
    try {
      if (courseId) {
        const { error } = await supabase.from('courses').update(payload).eq('id', courseId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('courses').insert(payload).select().single()
        if (error) throw error
        if (data) setCourseId(data.id)
      }
      alert('Formação salva com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar:', err)
      alert('Erro ao salvar: ' + (err.message || JSON.stringify(err)))
    }
    setSaving(false)
  }

  // ---- MODULE CRUD ----
  async function addModule() {
    const title = prompt('Nome do módulo:')
    if (!title) return
    await supabase.from('course_modules').insert({ course_id: courseId, title, sort_order: modules.length })
    loadModules()
  }

  async function renameModule(mod) {
    const title = prompt('Novo nome:', mod.title)
    if (!title) return
    await supabase.from('course_modules').update({ title }).eq('id', mod.id)
    loadModules()
  }

  async function deleteModule(mod) {
    if (!confirm(`Excluir módulo "${mod.title}" e todas as aulas?`)) return
    await supabase.from('course_modules').delete().eq('id', mod.id)
    loadModules()
  }

  // ---- LESSON CRUD ----
  async function addLesson(moduleId) {
    const title = prompt('Título da aula:')
    if (!title) return
    const count = modules.find(m => m.id === moduleId)?.lessons?.length || 0
    await supabase.from('lessons').insert({ module_id: moduleId, title, sort_order: count })
    loadModules()
  }

  async function deleteLesson(lessonId) {
    if (!confirm('Excluir esta aula?')) return
    await supabase.from('lessons').delete().eq('id', lessonId)
    loadModules()
  }

  return (
    <div className="admin-page">
      <button className="back-btn" onClick={onBack}>← Voltar para Formações</button>
      <h1>{courseId ? 'Gerenciar Formação' : 'Nova Formação'}</h1>

      <div className="filter-bar" style={{ marginBottom: 24 }}>
        <button className={`filter-btn${tab === 'info' ? ' active' : ''}`} onClick={() => setTab('info')}>Informações</button>
        {courseId && <button className={`filter-btn${tab === 'curriculum' ? ' active' : ''}`} onClick={() => setTab('curriculum')}>Currículo</button>}
      </div>

      {tab === 'info' && (
        <form className="admin-form" onSubmit={saveCourse}>
          <div className="form-row">
            <div className="form-group"><label>Título *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
            <div className="form-group"><label>Categoria</label><input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Ex: IA, Automação" /></div>
          </div>
          <div className="form-group"><label>Descrição</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
          <div className="form-row">
            <div className="form-group"><label>Nível</label>
              <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                {Object.entries(levelLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Carga Horária</label><input type="number" step="0.5" value={form.total_hours} onChange={e => setForm(p => ({ ...p, total_hours: e.target.value }))} placeholder="Ex: 12.5" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Instrutor</label><input value={form.instructor_name} onChange={e => setForm(p => ({ ...p, instructor_name: e.target.value }))} /></div>
            <div className="form-group"><label>Bio do Instrutor</label><input value={form.instructor_bio} onChange={e => setForm(p => ({ ...p, instructor_bio: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label>URL Thumbnail</label><input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} /></div>
          <ListEditor label="O que você vai aprender" items={form.what_you_learn || []} onChange={items => setForm(p => ({ ...p, what_you_learn: items }))} />
          <ListEditor label="Requisitos" items={form.requirements || []} onChange={items => setForm(p => ({ ...p, requirements: items }))} />
          <div className="form-check-group" style={{ marginTop: 12 }}>
            <label><input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} /> Publicado</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 16 }}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </form>
      )}

      {tab === 'curriculum' && courseId && (
        <div className="curriculum-editor">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="curriculum-module">
              <div className="curriculum-module-header">
                <div className="curriculum-module-title">
                  <span className="curriculum-module-num">Módulo {mi + 1}</span>
                  <h3>{mod.title}</h3>
                </div>
                <div className="curriculum-module-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => addLesson(mod.id)}>+ Aula</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => renameModule(mod)}>Renomear</button>
                  <button className="btn-danger btn-sm" onClick={() => deleteModule(mod)}>Excluir</button>
                </div>
              </div>
              <div className="curriculum-lessons">
                {mod.lessons.map((lesson, li) => (
                  <LessonEditor key={lesson.id} lesson={lesson} index={li} onUpdate={loadModules} />
                ))}
                {mod.lessons.length === 0 && <p className="admin-empty" style={{ padding: '12px 16px' }}>Nenhuma aula. Clique em "+ Aula".</p>}
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={addModule} style={{ marginTop: 16 }}>+ Novo Módulo</button>
        </div>
      )}
    </div>
  )
}

// ---- LESSON EDITOR (inline) ----
function LessonEditor({ lesson, index, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState(lesson)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const materialRef = useRef(null)

  async function save() {
    setSaving(true)
    await supabase.from('lessons').update({
      title: form.title, description: form.description, video_url: form.video_url,
      duration_sec: form.duration_sec ? parseInt(form.duration_sec) : null,
      is_free: form.is_free, content_type: form.content_type, text_content: form.text_content,
    }).eq('id', lesson.id)
    setSaving(false)
    onUpdate()
  }

  async function uploadVideo(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `videos/${lesson.id}/${file.name}`
    await supabase.storage.from('course-files').upload(path, file, { upsert: true })
    const url = `${STORAGE_URL}/${path}`
    setForm(p => ({ ...p, video_url: url }))
    await supabase.from('lessons').update({ video_url: url }).eq('id', lesson.id)
    setUploading(false)
    onUpdate()
  }

  async function uploadMaterial(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `materials/${lesson.id}/${file.name}`
    await supabase.storage.from('course-files').upload(path, file, { upsert: true })
    const url = `${STORAGE_URL}/${path}`
    await supabase.from('lesson_materials').insert({
      lesson_id: lesson.id, title: file.name, file_url: url,
      file_type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
      file_size_bytes: file.size,
    })
    setUploading(false)
    onUpdate()
  }

  async function deleteMaterial(matId) {
    await supabase.from('lesson_materials').delete().eq('id', matId)
    onUpdate()
  }

  async function deleteLesson() {
    if (!confirm('Excluir esta aula?')) return
    await supabase.from('lessons').delete().eq('id', lesson.id)
    onUpdate()
  }

  return (
    <div className={`curriculum-lesson${expanded ? ' expanded' : ''}`}>
      <div className="curriculum-lesson-header" onClick={() => setExpanded(!expanded)}>
        <div className="curriculum-lesson-info">
          <span className="curriculum-lesson-icon">
            {form.content_type === 'video' ? '▶' : form.content_type === 'text' ? '📄' : '❓'}
          </span>
          <span className="curriculum-lesson-num">{index + 1}.</span>
          <span className="curriculum-lesson-title">{form.title}</span>
          {form.is_free && <span className="curriculum-free-badge">GRÁTIS</span>}
          {form.duration_sec && <span className="curriculum-duration">{Math.ceil(form.duration_sec / 60)} min</span>}
        </div>
        <span className="curriculum-expand">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="curriculum-lesson-body">
          <div className="form-row">
            <div className="form-group"><label>Título</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="form-group"><label>Tipo</label>
              <select value={form.content_type} onChange={e => setForm(p => ({ ...p, content_type: e.target.value }))}>
                <option value="video">Vídeo</option><option value="text">Texto</option><option value="quiz">Quiz</option>
              </select>
            </div>
            <div className="form-group"><label>Duração (seg)</label><input type="number" value={form.duration_sec || ''} onChange={e => setForm(p => ({ ...p, duration_sec: e.target.value }))} /></div>
          </div>

          <div className="form-group"><label>Descrição</label><textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>

          {form.content_type === 'video' && (
            <div className="form-group">
              <label>Vídeo</label>
              <div className="upload-row">
                <input value={form.video_url || ''} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} placeholder="URL do vídeo ou faça upload" />
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? '...' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={uploadVideo} />
              </div>
              {form.video_url && (
                <video src={form.video_url} controls className="lesson-video-preview" />
              )}
            </div>
          )}

          {form.content_type === 'text' && (
            <div className="form-group"><label>Conteúdo</label><textarea value={form.text_content || ''} onChange={e => setForm(p => ({ ...p, text_content: e.target.value }))} rows={8} /></div>
          )}

          <div className="form-group">
            <label>Materiais e Anexos</label>
            <div className="materials-list">
              {(lesson.lesson_materials || []).map(mat => (
                <div key={mat.id} className="material-item">
                  <a href={mat.file_url} target="_blank" rel="noopener noreferrer">{mat.title}</a>
                  <span className="material-size">{mat.file_size_bytes ? (mat.file_size_bytes / 1024 / 1024).toFixed(1) + ' MB' : ''}</span>
                  <button onClick={() => deleteMaterial(mat.id)} className="material-delete">×</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => materialRef.current?.click()} disabled={uploading} style={{ marginTop: 8 }}>
              + Anexar Material
            </button>
            <input ref={materialRef} type="file" style={{ display: 'none' }} onChange={uploadMaterial} />
          </div>

          <div className="form-check-group"><label><input type="checkbox" checked={form.is_free} onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))} /> Aula gratuita (preview)</label></div>

          <div className="curriculum-lesson-actions">
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Aula'}</button>
            <button className="btn-danger btn-sm" onClick={deleteLesson}>Excluir</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// COURSE PLAYER — estilo Udemy (sidebar + player)
// ==========================================
function CoursePlayer({ courseId, userId, onBack }) {
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [progress, setProgress] = useState({})
  const [activeLesson, setActiveLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: c }, { data: mods }, { data: prog }] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('course_modules').select('*, lessons(*, lesson_materials(*))').eq('course_id', courseId).order('sort_order'),
      supabase.from('lesson_progress').select('lesson_id, completed, watched_sec').eq('user_id', userId),
    ])
    setCourse(c)
    const sorted = (mods || []).map(m => ({ ...m, lessons: (m.lessons || []).sort((a, b) => a.sort_order - b.sort_order) }))
    setModules(sorted)
    const map = {}
    prog?.forEach(p => { map[p.lesson_id] = p })
    setProgress(map)
    // Auto-select first incomplete or first lesson
    const allLessons = sorted.flatMap(m => m.lessons)
    const first = allLessons.find(l => !map[l.id]?.completed) || allLessons[0]
    if (first) setActiveLesson(first)
    setLoading(false)
  }

  async function toggleComplete(lessonId) {
    const current = progress[lessonId]?.completed
    const completed = !current
    setProgress(prev => ({ ...prev, [lessonId]: { ...prev[lessonId], completed } }))
    await supabase.from('lesson_progress').upsert({
      user_id: userId, lesson_id: lessonId, completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
  }

  if (loading) return <div className="admin-loading-full">Carregando...</div>

  const allLessons = modules.flatMap(m => m.lessons)
  const completedCount = allLessons.filter(l => progress[l.id]?.completed).length
  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

  return (
    <div className="player-layout">
      {/* Sidebar */}
      <div className="player-sidebar">
        <div className="player-sidebar-header">
          <button className="back-btn" onClick={onBack}>← Voltar</button>
          <h3>{course?.title}</h3>
          <div className="player-progress">
            <div className="player-progress-bar"><div className="player-progress-fill" style={{ width: `${pct}%` }} /></div>
            <span className="player-progress-text">{pct}% ({completedCount}/{allLessons.length})</span>
          </div>
        </div>
        <div className="player-modules">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="player-module">
              <div className="player-module-title">Módulo {mi + 1}: {mod.title}</div>
              {mod.lessons.map((l, li) => (
                <button
                  key={l.id}
                  className={`player-lesson-btn${activeLesson?.id === l.id ? ' active' : ''}${progress[l.id]?.completed ? ' completed' : ''}`}
                  onClick={() => setActiveLesson(l)}
                >
                  <span className="player-lesson-check" onClick={e => { e.stopPropagation(); toggleComplete(l.id) }}>
                    {progress[l.id]?.completed ? '✓' : '○'}
                  </span>
                  <span className="player-lesson-title">{li + 1}. {l.title}</span>
                  {l.duration_sec && <span className="player-lesson-dur">{Math.ceil(l.duration_sec / 60)}m</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="player-main">
        {activeLesson ? (
          <>
            {activeLesson.content_type === 'video' && activeLesson.video_url && (
              <div className="player-video-container">
                <video src={activeLesson.video_url} controls className="player-video" controlsList="nodownload" />
              </div>
            )}
            <div className="player-content">
              <h2>{activeLesson.title}</h2>
              {activeLesson.description && <p className="player-desc">{activeLesson.description}</p>}
              {activeLesson.content_type === 'text' && activeLesson.text_content && (
                <div className="player-text-content">{activeLesson.text_content}</div>
              )}
              {activeLesson.lesson_materials?.length > 0 && (
                <div className="player-materials">
                  <h4>Materiais</h4>
                  {activeLesson.lesson_materials.map(mat => (
                    <a key={mat.id} href={mat.file_url} target="_blank" rel="noopener noreferrer" className="player-material-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      {mat.title}
                    </a>
                  ))}
                </div>
              )}
              <button className={`btn ${progress[activeLesson.id]?.completed ? 'btn-secondary' : 'btn-primary'}`} onClick={() => toggleComplete(activeLesson.id)} style={{ marginTop: 20 }}>
                {progress[activeLesson.id]?.completed ? 'Desmarcar como concluída' : 'Marcar como concluída'}
              </button>
            </div>
          </>
        ) : (
          <div className="player-empty"><p>Selecione uma aula para começar.</p></div>
        )}
      </div>
    </div>
  )
}

// ---- Helper: editable list (requirements, what_you_learn) ----
function ListEditor({ label, items, onChange }) {
  const [input, setInput] = useState('')
  function add() { if (!input.trim()) return; onChange([...items, input.trim()]); setInput('') }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)) }
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="feature-input-row">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Adicionar item..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button type="button" className="btn btn-primary btn-sm" onClick={add}>+</button>
      </div>
      <ul className="feature-list">{items.map((f, i) => <li key={i}><span>{f}</span><button type="button" onClick={() => remove(i)}>×</button></li>)}</ul>
    </div>
  )
}
