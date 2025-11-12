import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', //AI: Sonnet 4.5 - Windows 11 localhost 버그 회피
    port: 5173,
  },
})
