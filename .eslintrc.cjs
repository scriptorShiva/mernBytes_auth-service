// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Use "plugin:prettier/recommended" for formatting rules
    ],
    rules: {
        // Add any project-specific rules or overrides here
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        'no-console': 'error',
        'dot-notation': 'error',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off',
    },
};
