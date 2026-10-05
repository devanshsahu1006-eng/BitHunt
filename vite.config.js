import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // -------------------------------------------------------------------------
  // Local Dev Proxy:
  // Forwards /api/* requests to the Flask backend on http://localhost:5000
  // when developing locally. In production on Vercel, requests use VITE_API_BASE_URL.
  // -------------------------------------------------------------------------
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
        },
      },
    },
  },
});
