import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName)
      if (error) setError(error.message)
      else setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Logo />
        </div>
        <h2>{isSignUp ? 'Criar Conta' : 'Entrar'}</h2>
        <p className="login-subtitle">
          {isSignUp ? 'Acesse a área de membros SPXIA' : 'Área de membros SPXIA'}
        </p>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Seu nome"
              />
            </div>
          )}
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="login-toggle">
          {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}>
            {isSignUp ? 'Fazer login' : 'Criar conta'}
          </button>
        </div>

        <a href="/" className="login-back">← Voltar ao site</a>
      </div>
    </div>
  )
}
