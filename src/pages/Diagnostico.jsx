import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

// Troque pela sua Site Key de produção
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

const questions = [
  { id: 'q1', label: 'Qual é o principal objetivo da empresa ao investir em IA?', placeholder: 'Ex.: aumentar vendas, reduzir custos, ganhar produtividade, melhorar atendimento, automatizar processos.' },
  { id: 'q2', label: 'Quais resultados hoje estão abaixo do esperado e precisam melhorar com urgência?', placeholder: 'Descreva as dores mais críticas do negócio.' },
  { id: 'q3', label: 'Quais processos da empresa são mais repetitivos, manuais e demorados?', placeholder: 'Esses são os primeiros candidatos para automação com IA.' },
  { id: 'q4', label: 'Quais áreas da empresa mais sofrem com gargalos?', placeholder: 'Ex.: Comercial, atendimento, financeiro, jurídico, RH, operações, marketing.' },
  { id: 'q5', label: 'Quais tarefas dependem muito de pessoas para analisar, responder, classificar ou decidir?', placeholder: 'Esses pontos costumam ter alto potencial para IA.' },
  { id: 'q6', label: 'Hoje a empresa perde dinheiro onde?', placeholder: 'Ex.: retrabalho, demora no atendimento, erros humanos, baixa conversão, falta de follow-up.' },
  { id: 'q7', label: 'Quais indicadores a empresa quer melhorar com IA?', placeholder: 'Ex.: faturamento, margem, NPS, tempo de resposta, taxa de conversão, produtividade.' },
  { id: 'q8', label: 'A empresa possui dados organizados para apoiar decisões?', placeholder: 'Sem dados minimamente estruturados, projetos de IA ficam limitados.' },
  { id: 'q9', label: 'Onde esses dados estão hoje?', placeholder: 'Ex.: ERP, CRM, planilhas, WhatsApp, e-mail, sistema financeiro, banco de dados.' },
  { id: 'q10', label: 'A qualidade dos dados atuais é confiável?', placeholder: 'Dados duplicados, incompletos ou desatualizados comprometem o resultado.' },
  { id: 'q11', label: 'A empresa já possui sistemas integráveis?', placeholder: 'Ex.: APIs, ERP, CRM, automações, banco de dados, plataformas de atendimento.' },
  { id: 'q12', label: 'Quais decisões hoje são tomadas mais por feeling do que por informação?', placeholder: 'A IA pode apoiar com previsões, análises e recomendações.' },
  { id: 'q13', label: 'Existe volume suficiente de demanda para justificar automação com IA?', placeholder: 'Ex.: grande número de leads, atendimentos, documentos, chamados, contratos.' },
  { id: 'q14', label: 'Quais atividades precisam acontecer com mais velocidade?', placeholder: 'Ex.: atendimento, orçamento, proposta, triagem, cobrança, suporte.' },
  { id: 'q15', label: 'Quais áreas precisam de maior padronização?', placeholder: 'IA funciona muito bem para manter padrão em comunicação, análise e execução.' },
  { id: 'q16', label: 'A equipe está preparada para usar IA no dia a dia?', placeholder: 'Maturidade digital, resistência cultural e necessidade de treinamento.' },
  { id: 'q17', label: 'Quem serão os responsáveis internos pelo projeto de IA?', placeholder: 'Sem dono do projeto, a implantação tende a perder força.' },
  { id: 'q18', label: 'Quais riscos a empresa precisa controlar ao usar IA?', placeholder: 'Ex.: segurança da informação, privacidade, erros, LGPD, impacto operacional.' },
  { id: 'q19', label: 'Qual orçamento e expectativa de retorno para a implantação?', placeholder: 'Define prioridade, escopo e velocidade do projeto.' },
  { id: 'q20', label: 'Se a IA desse certo em 90 dias, o que teria mudado na prática?', placeholder: 'Transforme intenção em meta objetiva e mensurável.' },
]

const QUESTIONS_PER_PAGE = 5
const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)

export default function Diagnostico() {
  const [step, setStep] = useState('contact')
  const [qPage, setQPage] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [captchaToken, setCaptchaToken] = useState(null)
  const captchaRef = useRef(null)

  // Contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [business, setBusiness] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [industry, setIndustry] = useState('')

  // Answers
  const [answers, setAnswers] = useState({})

  function setAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }))
    setValidationErrors(prev => prev.filter(e => e !== id))
  }

  function handleContactSubmit(e) {
    e.preventDefault()
    setStep('questions')
    setQPage(0)
  }

  function validateCurrentPage() {
    const pageQuestions = questions.slice(qPage * QUESTIONS_PER_PAGE, (qPage + 1) * QUESTIONS_PER_PAGE)
    const missing = pageQuestions.filter(q => !answers[q.id]?.trim()).map(q => q.id)
    setValidationErrors(missing)
    return missing.length === 0
  }

  function nextPage() {
    if (!validateCurrentPage()) return

    if (qPage < totalPages - 1) {
      setQPage(qPage + 1)
      window.scrollTo(0, 0)
    } else {
      // Last page — show captcha step
      setStep('captcha')
    }
  }

  function prevPage() {
    setValidationErrors([])
    if (qPage > 0) { setQPage(qPage - 1); window.scrollTo(0, 0) }
    else setStep('contact')
  }

  async function submitAll() {
    if (!captchaToken) {
      setErrorMsg('Complete o reCAPTCHA para enviar.')
      return
    }

    setStep('sending')
    setErrorMsg('')

    const { error } = await supabase.from('diagnostics').insert({
      name,
      email,
      whatsapp: whatsapp.replace(/\D/g, ''),
      business_description: business,
      company_name: companyName,
      cnpj: cnpj.replace(/\D/g, ''),
      industry,
      answers,
    })

    if (error) { setErrorMsg(error.message); setStep('error') }
    else setStep('success')
  }

  const currentQuestions = questions.slice(qPage * QUESTIONS_PER_PAGE, (qPage + 1) * QUESTIONS_PER_PAGE)
  const totalSteps = totalPages + 2 // contact + question pages + captcha
  const currentStep = step === 'contact' ? 1 : step === 'questions' ? qPage + 2 : step === 'captcha' ? totalSteps : totalSteps
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="diag-page">
      <div className="diag-wrapper">
        {/* Header */}
        <div className="diag-top-bar">
          <a href="/" className="diag-logo"><Logo /></a>
          {['contact', 'questions', 'captcha'].includes(step) && (
            <div className="diag-progress-bar">
              <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* STEP 1: CONTACT */}
        {step === 'contact' && (
          <div className="diag-step">
            <div className="diag-step-header">
              <span className="diag-step-label">ETAPA 1 DE {totalSteps}</span>
              <h1>Seus <em>dados</em></h1>
              <p>Primeiro, nos conte sobre você e sua empresa.</p>
            </div>
            <form onSubmit={handleContactSubmit} className="diag-form">
              <div className="diag-form-row">
                <div className="form-group"><label>Seu nome *</label><input value={name} onChange={e => setName(e.target.value)} required placeholder="Nome completo" /></div>
                <div className="form-group"><label>E-mail *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" /></div>
              </div>
              <div className="diag-form-row">
                <div className="form-group"><label>WhatsApp *</label><input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required placeholder="(00) 00000-0000" /></div>
                <div className="form-group"><label>Nome da empresa *</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="Empresa LTDA" /></div>
              </div>
              <div className="diag-form-row">
                <div className="form-group"><label>CNPJ</label><input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" /></div>
                <div className="form-group"><label>Ramo de atuação *</label><input value={industry} onChange={e => setIndustry(e.target.value)} required placeholder="Ex.: Tecnologia, Varejo, Saúde, Indústria" /></div>
              </div>
              <div className="form-group">
                <label>Descreva brevemente seu negócio *</label>
                <textarea value={business} onChange={e => setBusiness(e.target.value)} required rows={3} placeholder="O que sua empresa faz? Quantos funcionários? Quais os principais desafios?" />
              </div>
              <div className="diag-nav-btns">
                <a href="/" className="btn btn-secondary">Cancelar</a>
                <button type="submit" className="btn btn-primary">Próximo →</button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2+: QUESTIONS */}
        {step === 'questions' && (
          <div className="diag-step">
            <div className="diag-step-header">
              <span className="diag-step-label">ETAPA {qPage + 2} DE {totalSteps}</span>
              <h1>Diagnóstico <em>estratégico</em></h1>
              <p>Todas as perguntas são obrigatórias. Responda com o máximo de detalhes.</p>
            </div>
            <div className="diag-form">
              {currentQuestions.map((q, i) => {
                const hasError = validationErrors.includes(q.id)
                return (
                  <div key={q.id} className={`diag-question${hasError ? ' diag-question-error' : ''}`}>
                    <label className="diag-question-label">
                      <span className="diag-question-num">{qPage * QUESTIONS_PER_PAGE + i + 1}.</span>
                      {q.label}
                      <span className="diag-required">*</span>
                    </label>
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={e => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      rows={3}
                      className={hasError ? 'input-error' : ''}
                    />
                    {hasError && <span className="diag-error-msg">Esta pergunta é obrigatória</span>}
                  </div>
                )
              })}
              {validationErrors.length > 0 && (
                <div className="diag-validation-banner">
                  Preencha todas as perguntas antes de avançar.
                </div>
              )}
              <div className="diag-nav-btns">
                <button type="button" className="btn btn-secondary" onClick={prevPage}>← Voltar</button>
                <button type="button" className="btn btn-primary" onClick={nextPage}>
                  {qPage < totalPages - 1 ? 'Próximo →' : 'Revisar e Enviar →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP CAPTCHA: Final confirmation */}
        {step === 'captcha' && (
          <div className="diag-step">
            <div className="diag-step-header">
              <span className="diag-step-label">ETAPA FINAL</span>
              <h1>Confirmar <em>envio</em></h1>
              <p>Revise seus dados e complete a verificação para enviar o diagnóstico.</p>
            </div>

            <div className="diag-review">
              <div className="diag-review-card">
                <h3>Seus Dados</h3>
                <div className="diag-review-row"><strong>Nome:</strong> {name}</div>
                <div className="diag-review-row"><strong>E-mail:</strong> {email}</div>
                <div className="diag-review-row"><strong>WhatsApp:</strong> {whatsapp}</div>
                <div className="diag-review-row"><strong>Empresa:</strong> {companyName}</div>
                <div className="diag-review-row"><strong>Ramo:</strong> {industry}</div>
              </div>
              <div className="diag-review-card">
                <h3>Respostas</h3>
                <p className="diag-review-summary">{Object.values(answers).filter(Boolean).length} de {questions.length} perguntas respondidas</p>
              </div>
            </div>

            <div className="diag-captcha-wrapper">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={token => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>

            {errorMsg && <div className="diag-validation-banner">{errorMsg}</div>}

            <div className="diag-nav-btns">
              <button type="button" className="btn btn-secondary" onClick={() => { setStep('questions'); setQPage(totalPages - 1) }}>← Voltar</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitAll}
                disabled={!captchaToken}
              >
                Enviar Diagnóstico
              </button>
            </div>
          </div>
        )}

        {/* SENDING */}
        {step === 'sending' && (
          <div className="diag-step diag-center">
            <div className="checkout-spinner" />
            <h2>Enviando diagnóstico...</h2>
            <p>Estamos salvando suas respostas.</p>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="diag-step diag-center">
            <div className="checkout-success-icon">✓</div>
            <h1>Diagnóstico <em>enviado!</em></h1>
            <p>Recebemos suas respostas e vamos analisar com IA antes de entrar em contato. Você receberá uma pré-análise pelo e-mail e WhatsApp em até 24h.</p>
            <div className="diag-success-steps">
              <div className="diag-success-step done"><span>1</span>Dados coletados</div>
              <div className="diag-success-step active"><span>2</span>Análise com IA</div>
              <div className="diag-success-step"><span>3</span>Contato da equipe</div>
            </div>
            <a href="/" className="btn btn-secondary" style={{ marginTop: 24 }}>Voltar ao site</a>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div className="diag-step diag-center">
            <div className="checkout-error-icon">✕</div>
            <h2>Erro ao enviar</h2>
            <p>{errorMsg}</p>
            <button className="btn btn-primary" onClick={() => { setStep('captcha'); setCaptchaToken(null); captchaRef.current?.reset() }}>Tentar novamente</button>
          </div>
        )}
      </div>
    </div>
  )
}
