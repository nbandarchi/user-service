import { defineConfig } from 'vitest/config'
import path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            experimentalAstAwareRemapping: true,
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/test/**',
                '**/drizzle/**',
                '**/test-utils/**',
                '**/*.config.{js,ts}',
                '**/vite.config.{js,ts}',
                '**/vitest.config.{js,ts}',
                '**/tsconfig*.json',
                '**/jest.config.{js,ts}',
            ],
            all: true,
            clean: true,
            cleanOnRerun: true,
        },
        setupFiles: ['./test/setup.ts'],
        include: ['**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        testTimeout: 30000,
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, './src'),
            },
        ],
    },
    esbuild: {
        target: 'es2020',
    },
})
