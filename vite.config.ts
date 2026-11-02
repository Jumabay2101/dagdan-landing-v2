import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served by nginx under /landingv2/ on the server.
export default defineConfig({
  base: '/landingv2/',
  plugins: [react()],
})
