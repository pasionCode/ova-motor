import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Motor OVA — LEXUM
// Configuración mínima de Vite con soporte React
export default defineConfig({
  plugins: [react()],
  // base: '/ova-motor/' // Descomentar si se despliega en subcarpeta del servidor
})
