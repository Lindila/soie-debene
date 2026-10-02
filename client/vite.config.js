import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    // Échoue si le site tourne déjà, au lieu d'en lancer un second sur 5174.
    strictPort: true,
    proxy: { '/api': 'http://localhost:5050' },
  },
})
