import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pocket2square/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['handlebars']
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@framework': resolve(__dirname, './src/framework'),
      '@components': resolve(__dirname, './src/components'),
      '@layouts': resolve(__dirname, './src/components/layouts'),
      '@api': resolve(__dirname, './src/api'),
      '@data': resolve(__dirname, './src/data'),
      '@css': resolve(__dirname, './src/css')
    }
  },

  server: {
    port: 3000,
    open: false
  }
})
