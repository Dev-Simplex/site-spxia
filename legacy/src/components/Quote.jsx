import useFadeIn from '../hooks/useFadeIn'
import { useI18n } from '../i18n/context'

export default function Quote() {
  const { t } = useI18n()
  const fade = useFadeIn()

  return (
    <section className="section section-dark">
      <div className="container">
        <blockquote ref={fade.ref} className={`brand-quote fade-in${fade.visible ? ' visible' : ''}`}>
          <p>
            &quot;{t.quote.text} <em>{t.quote.textEm}</em> {t.quote.text2}&quot;
          </p>
          <footer>{t.quote.author}</footer>
        </blockquote>
      </div>
    </section>
  )
}
