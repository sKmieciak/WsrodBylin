import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7116',
        changeOrigin: true,
        secure: false, // bo to lokalny https bez certyfikatu
      },
    },
  },
})
