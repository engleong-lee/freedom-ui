import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // This exposes the server to all network interfaces
    port: 5173, // Optional: explicitly set the port
    proxy: {
      '/accountinfo': {
        target: 'http://100.117.35.53:8000',
        changeOrigin: true,
      },
      '/allpositions': {
        target: 'http://100.117.35.53:8000',
        changeOrigin: true,
      }
    }
  }
});
