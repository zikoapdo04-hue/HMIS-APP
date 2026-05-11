import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import i18n from '../i18n'

type Theme = 'light' | 'dark'
type Lang  = 'ar' | 'en'

interface SettingsValue {
  theme:     Theme
  lang:      Lang
  setTheme:  (t: Theme) => void
  setLang:   (l: Lang)  => void
  dir:       'rtl' | 'ltr'
  t:         (ar: string, en: string) => string
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('hmis-theme') as Theme) ?? 'light')
  const [lang,  setLangState]  = useState<Lang>(()  => (localStorage.getItem('hmis-lang')  as Lang)  ?? 'ar')

  const setTheme = (t: Theme) => { setThemeState(t); localStorage.setItem('hmis-theme', t) }
  const setLang  = (l: Lang)  => {
    setLangState(l)
    localStorage.setItem('hmis-lang', l)
    i18n.changeLanguage(l)
  }

  // Sync i18n on first mount (picks up persisted language from localStorage)
  useEffect(() => {
    i18n.changeLanguage(lang)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.lang = lang
  }, [theme, lang])

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en

  return (
    <SettingsContext.Provider value={{ theme, lang, setTheme, setLang, dir: lang === 'ar' ? 'rtl' : 'ltr', t }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be inside <SettingsProvider>')
  return ctx
}
