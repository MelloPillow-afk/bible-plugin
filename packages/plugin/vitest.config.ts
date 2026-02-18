import viteConfig from './vite.config'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup/figma.mock.ts'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.ts'],
      exclude: ['test/setup/**', '**/*.test.ts']
    }
  }
}))
