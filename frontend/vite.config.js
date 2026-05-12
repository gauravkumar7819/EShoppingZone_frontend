import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api-gateway.bluetree-541edc58.centralindia.azurecontainerapps.io',
        changeOrigin: true,
      }
    }
  }
})