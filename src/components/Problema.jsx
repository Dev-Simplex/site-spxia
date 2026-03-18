import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Problema() {
  const { t } = useI18n()
  const fadeCal = useFadeIn()
  const fadeLeft = useFadeIn()
  const fadeRight = useFadeIn()

  return (
    <section className="section section-dark" id="problema">
      <div className="container">
        <div ref={fadeCal.ref} className={`callout-block fade-in${fadeCal.visible ? ' visible' : ''}`}>
          <div className="callout-left">
            <span className="callout-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ED3237" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
          </div>
          <div className="callout-right">
            <h2>{t.problema.calloutTitle} <em>{t.problema.calloutTitleEm}</em> {t.problema.calloutTitle2}</h2>
            <p>{t.problema.calloutDesc}</p>
          </div>
        </div>

        <div className="compare-grid">
          <div ref={fadeLeft.ref} className={`compare-card compare-wrong fade-in${fadeLeft.visible ? ' visible' : ''}`}>
            <div className="compare-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ED3237" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>{t.problema.semLabel}</span>
            </div>
            <ul>
              {t.problema.sem.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>

          <div ref={fadeRight.ref} className={`compare-card compare-right fade-in${fadeRight.visible ? ' visible' : ''}`}>
            <div className="compare-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{t.problema.comLabel}</span>
            </div>
            <ul>
              {t.problema.com.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
