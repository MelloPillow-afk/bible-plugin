import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts', 'eslint.config.js']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        figma: 'readonly',
        __html__: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
