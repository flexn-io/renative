module.exports = {
    extends: ['@flexn/eslint-config', 'prettier'],
    settings: {
        'import/core-modules': ['@flexn/eslint-config'],
    },
    rules: {
        '@typescript-eslint/no-empty-interface': 'off',
    },
};
