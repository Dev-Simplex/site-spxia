import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function ComoFunciona() {
  const { t } = useI18n()
  const fadeHeader = useFadeIn()

  return (
    <section className="section section-dark" id="como-funciona">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.comoFunciona.number}</span>
          <span className="section-label">{t.comoFunciona.label}</span>
        </div>
        <h2>{t.comoFunciona.title} <em>{t.comoFunciona.titleEm}</em></h2>
        <p className="section-desc">{t.comoFunciona.desc}</p>
        <div className="pillars-grid">
          {t.comoFunciona.steps.map(s => <StepCard key={s.num} {...s} />)}
        </div>
      </div>
    </section>
  )
}

function StepCard({ num, title, desc, detail }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`pillar-card fade-in${fade.visible ? ' visible' : ''}`}>
      <div className="pillar-number">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="pillar-tag"><code>{detail}</code></div>
    </div>
  )
}
