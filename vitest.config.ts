/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'prisma/',
        'public/',
        'scripts/',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    include: ['__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules/',
      '.next/',
      'coverage/',
      'prisma/',
      'public/',
      'scripts/',
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
