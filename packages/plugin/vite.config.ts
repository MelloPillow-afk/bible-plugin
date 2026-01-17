import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared')
    }
  },
  build: {
    target: 'es6',
    outDir: 'dist',
    rollupOptions: {
      input: {
        code: 'src/code.ts',
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})
