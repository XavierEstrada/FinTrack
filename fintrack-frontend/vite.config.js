import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion'))        return 'motion'
            if (id.includes('@supabase'))            return 'supabase'
            if (id.includes('@tanstack'))            return 'query'
            if (id.includes('recharts') ||
                id.includes('d3-') ||
                id.includes('victory'))              return 'charts'
            if (id.includes('react-hook-form') ||
                id.includes('@hookform') ||
                id.includes('/zod/'))               return 'forms'
            if (id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('/react/'))             return 'vendor'
          }
        },
      },
    },
  },
})
