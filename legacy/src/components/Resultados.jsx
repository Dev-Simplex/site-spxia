import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Resultados() {
  const { t } = useI18n()
  const fadeHeader = useFadeIn()

  return (
    <section className="section section-dark" id="resultados">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.resultados.number}</span>
          <span className="section-label">{t.resultados.label}</span>
        </div>
        <h2>{t.resultados.title} <em>{t.resultados.titleEm}</em></h2>
        <p className="section-desc">{t.resultados.desc}</p>
        <div className="results-grid results-grid-4">
          {t.resultados.items.map(r => <ResultCard key={r.label} {...r} />)}
        </div>
      </div>
    </section>
  )
}

function ResultCard({ value, label, desc }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`result-card fade-in${fade.visible ? ' visible' : ''}`}>
      <span className="result-value">{value}</span>
      <span className="result-label">{label}</span>
      <span className="result-desc">{desc}</span>
    </div>
  )
}
