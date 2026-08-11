import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Mentoria() {
  const { t } = useI18n()
  const fadeHeader = useFadeIn()

  return (
    <section className="section" id="mentoria">
      <div className="container">
        <div ref={fadeHeader.ref} className={`section-header fade-in${fadeHeader.visible ? ' visible' : ''}`}>
          <span className="section-number">{t.mentoria.number}</span>
          <span className="section-label">{t.mentoria.label}</span>
        </div>
        <h2>{t.mentoria.title} <em>{t.mentoria.titleEm}</em></h2>
        <p className="section-desc">{t.mentoria.desc}</p>
        <div className="mentoria-grid">
          {t.mentoria.programs.map(p => <ProgramCard key={p.title} {...p} />)}
        </div>
      </div>
    </section>
  )
}

function ProgramCard({ title, audience, desc, topics }) {
  const fade = useFadeIn()
  return (
    <div ref={fade.ref} className={`mentoria-card fade-in${fade.visible ? ' visible' : ''}`}>
      <div className="mentoria-audience">{audience}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul className="mentoria-topics">
        {topics.map(t => (
          <li key={t}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ED3237" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
