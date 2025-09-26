import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/my-srs/', // <--- set to '/' if repo is username.github.io
  plugins: [react()],
})
