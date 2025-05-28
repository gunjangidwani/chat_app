import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "ws://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
      "/api/user": "http://localhost:5000",
      "/api/chat": "http://localhost:5000",
      "/api/message": "http://localhost:5000",
      "/user": {
        target: "https://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
});
