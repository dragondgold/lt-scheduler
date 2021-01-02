module.exports = {
    root: true,
    env: {
        node: true,
        es6: true
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        allowImportExportEverywhere: true
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        'no-console': 'off',
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true
            }
        ]
    }
};
