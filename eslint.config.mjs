import nx from '@nx/eslint-plugin';
import promise from 'eslint-plugin-promise';
import tseslint from 'typescript-eslint';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist', '**/out-tsc']
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        {
                            sourceTag: 'type:app',
                            onlyDependOnLibsWithTags: ['type:lib']
                        }
                    ]
                }
            ]
        }
    },
    // Type-aware linting. Layered after `flat/typescript` so eslint-config-prettier
    // stays in effect; the two rule sets do not intersect (typescript-eslint v6+
    // ships no formatting rules). Do not add formatting rules below this point.
    ...tseslint.configs.strictTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.mts', '**/*.cts']
    })),
    ...tseslint.configs.stylisticTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.mts', '**/*.cts']
    })),
    {
        files: ['**/*.ts', '**/*.mts', '**/*.cts'],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['jest.config.ts']
                },
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        // Neither strictTypeChecked nor stylisticTypeChecked opts into this rule.
        files: ['**/*.ts', '**/*.mts', '**/*.cts'],
        rules: {
            '@typescript-eslint/explicit-member-accessibility': 'error'
        }
    },
    {
        // Promise chains read worse than `await` and interact badly with the
        // no-floating-promises / no-misused-promises rules above. No typescript-eslint
        // rule covers this, so the plugin is pulled in for this one rule.
        //
        // `strict: true` also flags `await p.then(...)` and chains inside constructors,
        // which the default would let through. The rule always exempts top-level scope,
        // so the `.catch()` on each entry point's bootstrap stays legal.
        files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.js', '**/*.mjs', '**/*.cjs'],
        plugins: { promise },
        rules: {
            'promise/prefer-await-to-then': ['error', { strict: true }]
        }
    },
    {
        // Every NestJS module is a class with no members by design.
        files: ['**/*.module.ts'],
        rules: {
            '@typescript-eslint/no-extraneous-class': 'off'
        }
    },
    {
        // Runner-independent relaxations shared by Vitest (client) and Jest (server).
        // Do not widen: relaxing type safety in tests is how tests stop catching regressions.
        files: ['**/*.spec.ts', '**/*.test.ts'],
        rules: {
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off'
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        // Override or add rules here
        rules: {}
    }
];
