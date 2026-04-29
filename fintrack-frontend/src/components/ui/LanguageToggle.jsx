import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'es', label: 'Español', flagSrc: 'https://flagcdn.com/w20/es.png' },
  { code: 'en', label: 'English', flagSrc: 'https://flagcdn.com/w20/us.png' },
]

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0]

  const select = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 ${className}`}
      >
        <img src={current.flagSrc} alt={current.code} className="w-5 h-auto rounded-sm" />
        <span className="text-xs font-bold">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50 min-w-[130px]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                lang.code === i18n.language
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <img src={lang.flagSrc} alt={lang.code} className="w-5 h-auto rounded-sm" />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
