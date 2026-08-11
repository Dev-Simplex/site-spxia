import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

const icons = [
  <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
]

export default function Sobre() {
  const { t } = useI18n()
  const fade = useFadeIn()

  return (
    <section className="section" id="sobre">
      <div className="container">
        <div ref={fade.ref} className={`section-header fade-in${fade.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.sobre.number}</span>
          <span className="section-label">{t.sobre.label}</span>
        </div>
        <div className="section-grid two-col">
          <div>
            <h2>{t.sobre.title} <em>{t.sobre.titleEm}</em></h2>
            <p>{t.sobre.p1}</p>
            <p>{t.sobre.p2}</p>
          </div>
          <div className="values-grid">
            {t.sobre.values.map((v, i) => (
              <ValueCard key={v.title} icon={icons[i]} title={v.title} desc={v.desc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueCard({ icon, title, desc }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`value-card fade-in${fade.visible ? ' visible' : ''}`}>
      <div className="value-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
