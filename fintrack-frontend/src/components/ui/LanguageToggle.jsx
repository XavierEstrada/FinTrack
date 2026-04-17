import { useTranslation } from 'react-i18next'

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <button
      onClick={toggle}
      title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      className={`text-xs font-bold transition-colors ${className}`}
    >
      {i18n.language === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
