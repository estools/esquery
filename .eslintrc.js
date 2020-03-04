module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        // Remove after converting to ESM
        define: 'readonly'
    },
    overrides: [{
        files: 'tests/**',
        globals: {
            assert: true
        },
        env: {
            mocha: true
        }
    }],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },
    rules: {
        semi: ['error'],
        indent: ['error', 4, {SwitchCase: 1}],
        'prefer-const': ['error'],
        'no-var': [2],
        'prefer-destructuring': [2],
        'object-shorthand': [2],
        'quotes': [2, 'single']
    }
};
