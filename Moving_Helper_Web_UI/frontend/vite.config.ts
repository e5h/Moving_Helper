import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port for the Vite dev server
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:6969', // Backend API base URL
    //     changeOrigin: true,
    //   },
    // },
  },
});
