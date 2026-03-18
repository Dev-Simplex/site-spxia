import { useState, useEffect } from 'react'
import Logo from './Logo'
import LangToggle from './LangToggle'
import { useI18n } from '../i18n/context'

export default function Navbar() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  const links = [
    { href: '#sobre', label: t.nav.sobre },
    { href: '#servicos', label: t.nav.servicos },
    { href: '#como-funciona', label: t.nav.comoFunciona },
    { href: '#cases', label: t.nav.cases },
    { href: '#mentoria', label: t.nav.mentoria },
  ]

  return (
    <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          <Logo />
        </a>
        <div className={`nav-links${open ? ' mobile-open' : ''}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
          ))}
          <a href="#contato" className="btn btn-primary btn-sm" onClick={close}>{t.nav.cta}</a>
          <LangToggle />
        </div>
        <button
          className={`nav-toggle${open ? ' active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
