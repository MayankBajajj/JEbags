import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Build into server/public (not a sibling dist/) so the frontend ships
    // inside the same subtree as the backend — required for hosts (like
    // Hostinger's Node.js app) that deploy only the configured "Root
    // directory" in isolation, cutting off access to sibling folders.
    outDir: 'server/public',
    emptyOutDir: true,
  },
})
