import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

const icons = [
  <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
]

export default function Servicos() {
  const { t } = useI18n()
  const fadeHeader = useFadeIn()

  return (
    <section className="section" id="servicos">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.servicos.number}</span>
          <span className="section-label">{t.servicos.label}</span>
        </div>
        <h2>{t.servicos.title} <em>{t.servicos.titleEm}</em></h2>
        <p className="section-desc">{t.servicos.desc}</p>
        <div className="services-grid services-grid-3">
          {t.servicos.items.map((s, i) => (
            <ServiceCard key={s.title} icon={icons[i]} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon, tag, title, desc }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`service-card fade-in${fade.visible ? ' visible' : ''}`}>
      <div className="service-tag">{tag}</div>
      <div className="service-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ED3237" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
