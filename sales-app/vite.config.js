import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Isso garante que os caminhos dos arquivos no index.html 
  // sejam gerados corretamente para o ambiente de produção
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})