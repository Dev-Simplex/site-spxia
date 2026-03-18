import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Cases() {
  const { t } = useI18n()
  const fadeHeader = useFadeIn()

  return (
    <section className="section" id="cases">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.cases.number}</span>
          <span className="section-label">{t.cases.label}</span>
        </div>
        <h2>{t.cases.title} <em>{t.cases.titleEm}</em></h2>
        <p className="section-desc">{t.cases.desc}</p>
        <div className="cases-grid">
          {t.cases.items.map(c => (
            <CaseCard key={c.title} aiBadge={t.cases.aiBadge} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseCard({ sector, title, desc, metrics, link, aiBadge }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`case-card fade-in${fade.visible ? ' visible' : ''}`}>
      <div className="case-header-row">
        <div className="case-sector">{sector}</div>
        <div className="case-ai-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {aiBadge}
        </div>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul className="case-metrics">
        {metrics.map(m => (
          <li key={m}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {m}
          </li>
        ))}
      </ul>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="case-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {link.replace('https://', '').replace('www.', '').replace(/\/$/, '')}
        </a>
      )}
    </div>
  )
}
