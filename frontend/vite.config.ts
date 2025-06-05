import { defineConfig } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react";

dns.setDefaultResultOrder("verbatim");
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: "ws://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
      // "/api": "http://localhost:5000",
      // "/chat": "http://localhost:5000",
      // "/message": "http://localhost:5000",
      "/api": {
        target: "https://localhost:5000",
        // changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
