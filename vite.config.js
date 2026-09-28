import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        work: new URL('./work/index.html', import.meta.url).pathname,
        workB: new URL('./work-b/index.html', import.meta.url).pathname,
      },
    },
  },
})
