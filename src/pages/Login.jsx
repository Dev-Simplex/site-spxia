import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  function switchMode(newMode) {
    setMode(newMode)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'forgot') {
      const { error } = await resetPassword(email)
      if (error) setError(error.message)
      else setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
    } else if (mode === 'signup') {
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

  const titles = {
    login: 'Entrar',
    signup: 'Criar Conta',
    forgot: 'Recuperar Senha'
  }

  const subtitles = {
    login: 'Área de membros SPXIA',
    signup: 'Acesse a área de membros SPXIA',
    forgot: 'Informe seu e-mail para redefinir a senha'
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Logo />
        </div>
        <h2>{titles[mode]}</h2>
        <p className="login-subtitle">{subtitles[mode]}</p>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
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
          {mode !== 'forgot' && (
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
          )}

          {mode === 'login' && (
            <div className="login-forgot">
              <button type="button" onClick={() => switchMode('forgot')}>
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'forgot' ? 'Enviar E-mail' : titles[mode]}
          </button>
        </form>

        <div className="login-toggle">
          {mode === 'forgot' ? (
            <>
              Lembrou a senha?
              <button onClick={() => switchMode('login')}>Fazer login</button>
            </>
          ) : mode === 'signup' ? (
            <>
              Já tem conta?
              <button onClick={() => switchMode('login')}>Fazer login</button>
            </>
          ) : (
            <>
              Não tem conta?
              <button onClick={() => switchMode('signup')}>Criar conta</button>
            </>
          )}
        </div>

        <a href="/" className="login-back">← Voltar ao site</a>
      </div>
    </div>
  )
}
