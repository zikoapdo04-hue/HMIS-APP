import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/HMIS-APP/',   // ← must match your GitHub repo name exactly
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
