import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

const cycleLabels = {
  pt: { MONTHLY: '/mês', QUARTERLY: '/trim', SEMIANNUALLY: '/sem', YEARLY: '/ano' },
  en: { MONTHLY: '/mo', QUARTERLY: '/qtr', SEMIANNUALLY: '/half', YEARLY: '/yr' },
}

export default function Produtos() {
  const { locale } = useI18n()
  const fadeHeader = useFadeIn()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').eq('is_published', true).order('sort_order')
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  if (loading || products.length === 0) return null

  const featured = products.filter(p => p.is_featured)
  const others = products.filter(p => !p.is_featured)

  return (
    <section className="section section-dark" id="produtos">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">07</span>
          <span className="section-label">{locale === 'pt' ? 'PRODUTOS' : 'PRODUCTS'}</span>
        </div>
        <h2>{locale === 'pt' ? 'Invista no seu ' : 'Invest in your '}<em>{locale === 'pt' ? 'crescimento.' : 'growth.'}</em></h2>
        <p className="section-desc">
          {locale === 'pt'
            ? 'Cursos, mentorias e ferramentas para transformar seu negócio com IA.'
            : 'Courses, mentoring and tools to transform your business with AI.'}
        </p>

        {featured.length > 0 && (
          <div className="products-featured">
            {featured.map(p => <ProductCard key={p.id} product={p} locale={locale} featured />)}
          </div>
        )}

        {others.length > 0 && (
          <div className="products-grid">
            {others.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product: p, locale, featured }) {
  const fade = useFadeIn()
  const cycles = cycleLabels[locale] || cycleLabels.pt

  return (
    <div ref={fade.ref} className={`product-card fade-in${fade.visible ? ' visible' : ''}${featured ? ' product-featured' : ''}`}>
      {p.thumbnail_url && <img src={p.thumbnail_url} alt={p.title} className="product-thumb" />}
      <div className="product-body">
        {p.category && <span className="product-cat">{p.category}</span>}
        <h3>{p.title}</h3>
        <p className="product-desc">{p.description}</p>

        {Array.isArray(p.features) && p.features.length > 0 && (
          <ul className="product-features">
            {p.features.slice(0, 5).map((f, i) => (
              <li key={i}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="product-price-row">
          {p.original_price && (
            <span className="product-original">R$ {Number(p.original_price).toFixed(2)}</span>
          )}
          <span className="product-price">
            R$ {Number(p.price).toFixed(2)}
            {p.type === 'subscription' && <span className="product-cycle">{cycles[p.billing_cycle] || ''}</span>}
          </span>
          {p.max_installments > 1 && p.type === 'one_time' && (
            <span className="product-installments">
              {locale === 'pt' ? 'ou' : 'or'} {p.max_installments}x R$ {(Number(p.price) / p.max_installments).toFixed(2)}
            </span>
          )}
        </div>

        <a href={`/checkout/${p.slug}`} className="btn btn-primary product-cta">
          {p.type === 'subscription'
            ? (locale === 'pt' ? 'Assinar Agora' : 'Subscribe Now')
            : (locale === 'pt' ? 'Comprar Agora' : 'Buy Now')}
        </a>
      </div>
    </div>
  )
}
