import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Hero() {
  const { t } = useI18n()
  const fade = useFadeIn()

  return (
    <section className="hero" id="hero">
      <div className="hero-grid" />
      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge">{t.hero.badge}</span>
        </div>
        <h1>{t.hero.title1} <em>{t.hero.titleEm1}</em><br />{t.hero.title2}</h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <a href="#servicos" className="btn btn-primary">{t.hero.cta1}</a>
          <a href="/diagnostico" className="btn btn-secondary">{t.hero.cta2}</a>
        </div>
        <div ref={fade.ref} className={`hero-stats fade-in${fade.visible ? ' visible' : ''}`}>
          {t.hero.stats.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
