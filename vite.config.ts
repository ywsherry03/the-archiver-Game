import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from a GitHub Pages *project* site (username.github.io/the-archiver/),
// so asset URLs need that subpath in CI. Local dev/build stays at "/".
// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/the-archiver/' : '/',
  plugins: [react()],
})
