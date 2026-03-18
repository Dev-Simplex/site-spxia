import { useI18n } from '../i18n/context'

export default function LangToggle() {
  const { locale, toggle } = useI18n()

  return (
    <button className="lang-toggle" onClick={toggle} aria-label="Toggle language">
      {locale === 'pt' ? 'EN' : 'PT'}
    </button>
  )
}
