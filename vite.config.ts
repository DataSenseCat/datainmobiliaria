// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const origin = env.VITE_API_ORIGIN || 'http://localhost:3000'

  return {
    plugins: [react()],

    server: {
      port: 5173,
      proxy: {
        '/api': { target: origin, changeOrigin: true }
      }
    },

    // Sugerimos a Vite que pre-optimice el paquete del SDK de Blob
    optimizeDeps: {
      include: ['@vercel/blob/client'],
    },

    build: {
      sourcemap: true,
    },
  }
})
