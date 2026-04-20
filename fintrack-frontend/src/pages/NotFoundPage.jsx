import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 max-w-sm"
      >
        {/* Logo */}
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <TrendingUp size={22} className="text-white" />
        </div>

        {/* 404 */}
        <div>
          <p className="text-7xl font-bold text-slate-200 dark:text-slate-800 select-none leading-none">404</p>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-3">
            {t('notFound.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t('notFound.message')}
          </p>
        </div>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Home size={15} />
          {t('notFound.backHome')}
        </Link>
      </motion.div>
    </div>
  )
}
