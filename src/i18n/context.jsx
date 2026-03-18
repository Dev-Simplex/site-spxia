import { createContext, useContext, useState, useEffect } from 'react'
import pt from './pt'
import en from './en'

const translations = { pt, en }

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('spxia-lang')
    if (saved && translations[saved]) return saved
    const browserLang = navigator.language?.slice(0, 2)
    return browserLang === 'pt' ? 'pt' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('spxia-lang', locale)
    document.documentElement.lang = translations[locale].lang
  }, [locale])

  const t = translations[locale]
  const toggle = () => setLocale(prev => prev === 'pt' ? 'en' : 'pt')

  return (
    <I18nContext.Provider value={{ t, locale, toggle }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
