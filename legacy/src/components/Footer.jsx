import Logo from './Logo'
import { useI18n } from '../i18n/context'

export default function Footer() {
  const { t } = useI18n()

  const links = [
    { href: '#sobre', label: t.nav.sobre },
    { href: '#servicos', label: t.nav.servicos },
    { href: '#como-funciona', label: t.nav.comoFunciona },
    { href: '#cases', label: t.nav.cases },
    { href: '#mentoria', label: t.nav.mentoria },
    { href: '#contato', label: t.nav.cta },
  ]

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo width={80} height={28} />
          <span className="footer-tagline">Intelligence and Automation</span>
        </div>
        <div className="footer-links">
          {links.map(l => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <div className="footer-copy">
          <span>{t.footer.copy}</span>
        </div>
      </div>
    </footer>
  )
}
