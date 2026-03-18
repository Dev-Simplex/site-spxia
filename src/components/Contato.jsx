import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Contato() {
  const { t } = useI18n()
  const fade = useFadeIn()

  return (
    <section className="section" id="contato">
      <div ref={fade.ref} className={`container cta-section fade-in${fade.visible ? ' visible' : ''}`}>
        <h2>{t.contato.title} <em>{t.contato.titleEm}</em></h2>
        <p>{t.contato.desc}</p>
        <div className="cta-actions">
          <a href="/diagnostico" className="btn btn-primary btn-lg">
            {t.contato.cta}
          </a>
        </div>
        <div className="cta-channels">
          <span className="cta-channel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {t.contato.email}
          </span>
          <span className="cta-channel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t.contato.location}
          </span>
        </div>
      </div>
    </section>
  )
}
