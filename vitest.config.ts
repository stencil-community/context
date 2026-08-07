import { defineVitestConfig } from '@stencil/vitest/config';
import { playwright }         from '@vitest/browser-playwright';

export default defineVitestConfig({
    stencilConfig: './stencil.config.ts',
    test:          {
        coverage: {
            provider: 'v8',
            include: ['src/context/**/*.{ts,tsx}'],
        },
        projects: [
            // Unit tests - node environment for functions / logic
            {
                test: {
                    name:        'unit',
                    include:     ['src/tests/**/*.unit.{ts,tsx}'],
                    environment: 'node',
                },
            },
            // Spec tests - via a node DOM of your choice
            {
                test: {
                    name:               'spec',
                    include:            ['src/tests/**/*.spec.{ts,tsx}'],
                    environment:        'stencil',
                    setupFiles:         ['./vitest-setup.ts'],
                    environmentOptions: {
                        stencil: {
                            domEnvironment: 'mock-doc',
                        },
                    },
                },
            },
            // Browser tests
            {
                test: {
                    name:       'browser',
                    include:    ['src/tests/**/*.test.{ts,tsx}'],
                    setupFiles: ['./vitest-setup.ts'],
                    browser:    {
                        enabled:   true,
                        provider:  playwright(),
                        headless:  true,
                        instances: [{browser: 'chromium'}],
                    },
                },
            },
        ],
    },
});