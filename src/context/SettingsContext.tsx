import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
  const setLang  = (l: Lang)  => { setLangState(l);  localStorage.setItem('hmis-lang',  l) }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  }, [theme, lang])

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en

  return (
    <SettingsContext.Provider value={{ theme, lang, setTheme, setLang, dir: lang === 'ar' ? 'rtl' : 'ltr', t }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be inside <SettingsProvider>')
  return ctx
}
