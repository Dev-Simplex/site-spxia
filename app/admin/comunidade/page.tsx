"use client"

import { useEffect, useState, type FormEvent } from "react"

import { PermGuard } from "@/app/admin/perm-guard"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

const categories = ["geral", "duvida", "insight", "showcase"]
const catLabels: Record<string, string> = {
  geral: "Geral",
  duvida: "Dúvida",
  insight: "Insight",
  showcase: "Showcase",
}

interface Post {
  id: string
  title: string
  content: string
  category: string
  pinned: boolean
  created_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

export default function ComunidadePage() {
  return (
    <PermGuard perm="comunidade">
      <Comunidade />
    </PermGuard>
  )
}

function Comunidade() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("geral")
  const [filter, setFilter] = useState("todos")

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    const { data } = await supabase
      .from("community_posts")
      .select("*, profiles(full_name, avatar_url)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
    setPosts((data as Post[]) || [])
    setLoading(false)
  }

  async function handlePost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await supabase.from("community_posts").insert({
      author_id: user?.id,
      title,
      content,
      category,
    })
    setTitle("")
    setContent("")
    setShowForm(false)
    loadPosts()
  }

  const filtered = filter === "todos" ? posts : posts.filter((p) => p.category === filter)

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Comunidade</h1>
          <p className="admin-page-desc">Troque ideias, tire dúvidas e compartilhe resultados.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Novo Post"}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handlePost}>
          <div className="form-group">
            <label>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título do post" />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {catLabels[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              placeholder="Escreva seu post..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Publicar
          </button>
        </form>
      )}

      <div className="filter-bar">
        <button
          className={`filter-btn${filter === "todos" ? " active" : ""}`}
          onClick={() => setFilter("todos")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn${filter === c ? " active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {catLabels[c]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin-loading">Carregando...</p>
      ) : (
        <div className="post-list">
          {filtered.length === 0 && <p className="admin-empty">Nenhum post encontrado.</p>}
          {filtered.map((post) => (
            <div key={post.id} className={`post-card${post.pinned ? " pinned" : ""}`}>
              <div className="post-meta">
                <span className="post-author">{post.profiles?.full_name || "Anônimo"}</span>
                <span className="post-cat">{catLabels[post.category]}</span>
                <span className="post-date">{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
                {post.pinned && <span className="post-pin">Fixado</span>}
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
