import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/app/chat": "http://localhost:5000",
      "/app": {
        target: "https://localhost:5000",
          changeOrigin: true,
          secure: false,
          ws: true,
      
      },
    },
  },
  plugins: [react()],
});
