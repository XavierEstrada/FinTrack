import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { router } from './router'
import './store/themeStore' // inicializa dark mode desde localStorage

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100',
          },
        }}
        richColors
      />
    </QueryClientProvider>
  )
}
