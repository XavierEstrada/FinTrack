import { Component } from 'react'
import { TrendingUp, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-6 max-w-sm">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Algo salió mal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Ocurrió un error inesperado. Puedes intentar recargar la aplicación.
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-3 font-mono bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-2 text-left break-all">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={15} />
            Recargar aplicación
          </button>
        </div>
      </div>
    )
  }
}
