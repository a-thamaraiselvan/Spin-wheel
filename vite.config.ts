import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || 'http://localhost:3001'),
    'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(process.env.FRONTEND_URL || 'http://localhost:5173'),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
