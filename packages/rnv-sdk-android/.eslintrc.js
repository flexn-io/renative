module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    globals: {
        window: true,
        module: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        quotes: 'off',
        'no-console': 1,
        'quote-props': ['error', 'as-needed'],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true
            }
        ],
        indent: ['error', 4, { SwitchCase: 1 }],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-named-as-default': 'off',
        'comma-dangle': ['error', 'only-multiline'],
        'prefer-destructuring': ['error',
            { object: true, array: false
            }
        ],
        'no-unused-expressions': ['error',
            { allowShortCircuit: true
            }
        ],
        'max-len': [
            'warn',
            { code: 120, ignoreComments: true, ignoreStrings: true
            }
        ]
    }
}