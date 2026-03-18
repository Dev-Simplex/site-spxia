import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const cycleLabels = { MONTHLY: '/mês', QUARTERLY: '/trim', SEMIANNUALLY: '/sem', YEARLY: '/ano' }

export default function Checkout() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('form') // form | processing | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [paymentData, setPaymentData] = useState(null)

  // Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [phone, setPhone] = useState('')
  const [billingType, setBillingType] = useState('PIX')

  useEffect(() => {
    supabase.from('products').select('*').eq('slug', slug).eq('is_published', true).single()
      .then(({ data, error }) => {
        if (error || !data) navigate('/')
        else setProduct(data)
        setLoading(false)
      })
  }, [slug])

  async function handleSubmit(e) {
    e.preventDefault()
    setStep('processing')
    setErrorMsg('')

    try {
      const { data, error } = await supabase.rpc('checkout', {
        p_product_id: product.id,
        p_customer_name: name,
        p_customer_email: email,
        p_customer_cpf_cnpj: cpfCnpj.replace(/\D/g, ''),
        p_customer_phone: phone.replace(/\D/g, ''),
        p_billing_type: billingType,
      })

      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.message || 'Erro ao processar pagamento')

      setPaymentData(data)
      setStep('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStep('error')
    }
  }

  if (loading) return <div className="checkout-page"><div className="admin-loading-full">Carregando...</div></div>
  if (!product) return null

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT: Product Summary */}
        <div className="checkout-summary">
          <a href="/" className="checkout-logo"><Logo /></a>
          <div className="checkout-product">
            {product.thumbnail_url && <img src={product.thumbnail_url} alt={product.title} className="checkout-thumb" />}
            <h2>{product.title}</h2>
            <p>{product.description}</p>

            {Array.isArray(product.features) && product.features.length > 0 && (
              <ul className="checkout-features">
                {product.features.map((f, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="checkout-price-block">
              {product.original_price && (
                <span className="checkout-original">R$ {Number(product.original_price).toFixed(2)}</span>
              )}
              <span className="checkout-price">
                R$ {Number(product.price).toFixed(2)}
                {product.type === 'subscription' && <span className="checkout-cycle">{cycleLabels[product.billing_cycle] || ''}</span>}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Form or Result */}
        <div className="checkout-form-area">
          {step === 'form' && (
            <>
              <h2>Dados para pagamento</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome completo *</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome" />
                </div>
                <div className="form-group">
                  <label>E-mail *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
                </div>
                <div className="form-group">
                  <label>CPF ou CNPJ *</label>
                  <input value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} required placeholder="000.000.000-00" />
                </div>
                <div className="form-group">
                  <label>WhatsApp</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group">
                  <label>Forma de pagamento *</label>
                  <div className="billing-options">
                    {['PIX', 'BOLETO', 'CREDIT_CARD'].map(bt => (
                      <label key={bt} className={`billing-option${billingType === bt ? ' selected' : ''}`}>
                        <input type="radio" name="billingType" value={bt} checked={billingType === bt} onChange={() => setBillingType(bt)} />
                        <span className="billing-icon">
                          {bt === 'PIX' && '⚡'}
                          {bt === 'BOLETO' && '📄'}
                          {bt === 'CREDIT_CARD' && '💳'}
                        </span>
                        <span>{bt === 'PIX' ? 'Pix' : bt === 'BOLETO' ? 'Boleto' : 'Cartão'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary checkout-submit">
                  {product.type === 'subscription' ? 'Assinar' : 'Pagar'} R$ {Number(product.price).toFixed(2)}
                </button>

                <p className="checkout-secure">Pagamento processado com segurança via Asaas</p>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="checkout-status">
              <div className="checkout-spinner" />
              <h2>Processando pagamento...</h2>
              <p>Aguarde, estamos gerando sua cobrança.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="checkout-status">
              <div className="checkout-success-icon">✓</div>
              <h2>Cobrança gerada!</h2>

              {paymentData?.pixData && (
                <div className="checkout-pix">
                  {paymentData.pixData.encodedImage && (
                    <img src={`data:image/png;base64,${paymentData.pixData.encodedImage}`} alt="QR Pix" className="pix-qr-img" />
                  )}
                  {paymentData.pixData.payload && (
                    <div className="pix-payload">
                      <label>Pix Copia e Cola:</label>
                      <input readOnly value={paymentData.pixData.payload} onClick={e => { e.target.select(); navigator.clipboard.writeText(paymentData.pixData.payload) }} />
                      <span className="pix-hint">Clique para copiar</span>
                    </div>
                  )}
                </div>
              )}

              {paymentData?.bankSlipUrl && (
                <a href={paymentData.bankSlipUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 16 }}>
                  Abrir Boleto
                </a>
              )}

              {paymentData?.invoiceUrl && (
                <a href={paymentData.invoiceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginTop: 8 }}>
                  Ver Fatura
                </a>
              )}

              <div className="checkout-account-info">
                <p>Após a confirmação do pagamento, seu acesso será liberado automaticamente.</p>
                <p>Use o e-mail <strong>{email}</strong> para acessar a plataforma.</p>
                <a href="/login" className="btn btn-secondary" style={{ marginTop: 12 }}>Acessar Plataforma</a>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="checkout-status">
              <div className="checkout-error-icon">✕</div>
              <h2>Erro no pagamento</h2>
              <p>{errorMsg}</p>
              <button className="btn btn-primary" onClick={() => setStep('form')}>Tentar novamente</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
