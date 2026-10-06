import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/luma': {
        target: 'https://api.lu.ma',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/luma/, ''),
      },
    },
  },
})
