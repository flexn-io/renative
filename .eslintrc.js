module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    parser: '@babel/eslint-parser',
    extends: ['airbnb'],
    env: {
        node: true,
        browser: true,
        es6: true,
        jest: true,
        mocha: true
    },
    parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        },
        babelOptions: {
            presets: ['@babel/preset-react']
        }
    },
    plugins: ['jest', 'detox', 'mocha'],
    rules: {
        //= ===========
        'function-paren-newline': 'off',
        'arrow-parens': 'off',
        'no-multiple-empty-lines': 'off',
        'function-call-argument-newline': 'off',
        'default-param-last': 'off',
        'no-promise-executor-return': 'off',
        'react/destructuring-assignment': 'off',
        'react/function-component-definition': 'off',
        'max-classes-per-file': 'off',
        'import/no-relative-packages': 'off',
        'import/extensions': 'off',
        'react/no-unstable-nested-components': 'off',
        'react/jsx-curly-brace-presence': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-wrap-multilines': 'off',
        'prefer-object-spread': 'off',
        'react/jsx-no-constructed-context-values': 'off',
        'react/prop-types': 'off',
        //= ===========
        'arrow-body-style': ['warn', 'as-needed'],
        'import/no-cycle': ['warn'],
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'consistent-return': 0,
        indent: ['error', 4, { SwitchCase: 1 }],
        'new-cap': ['error', { capIsNew: false }],
        'no-duplicate-imports': 'off',
        'no-param-reassign': [
            'error',
            { ignorePropertyModificationsFor: ['el', 'ref', 'event'] }
        ],
        'no-plusplus': 'off',
        'no-shadow': [
            'error',
            { builtinGlobals: false, hoist: 'functions', allow: ['describe'] }
        ],
        'no-use-before-define': 0,
        'no-unused-expressions': ['error', { allowShortCircuit: true }],
        'nonblock-statement-body-position': 0,
        'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/require-extension': 'off',
        'react/sort-comp': [
            'error',
            {
                order: [
                    'type-annotations',
                    'static-methods',
                    'lifecycle',
                    '/^on.+$/',
                    '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
                    'everything-else',
                    '/^render.+$/',
                    'render'
                ]
            }
        ],
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                },
                ObjectPattern: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                }
            }
        ],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 'off',

        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/no-noninteractive-tabindex': 'off',
        'jsx-a11y/media-has-caption': 'off',
        'jsx-a11y/mouse-events-have-key-events': 'off',

        'comma-dangle': ['error', 'only-multiline'],
        'no-underscore-dangle': 'off',
        'mocha/no-exclusive-tests': 'error',
        'prefer-destructuring': ['error', { object: true, array: false }],
        'prefer-promise-reject-errors': 'off',
        'max-len': [
            'warn',
            { code: 120, ignoreComments: true, ignoreStrings: true }
        ],
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix']
    }
};
