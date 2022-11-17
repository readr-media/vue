import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://github.com/vitejs/vite-plugin-vue2
export default defineConfig({
  plugins: [cssInjectedByJsPlugin(), vue2()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 4000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: '@readr-media/vue-responsive-image-loader',
      fileName: 'lib',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
