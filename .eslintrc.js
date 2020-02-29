module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: "eslint:recommended",
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        // Remove after converting to ESM
        define: "readonly"
    },
    overrides: [{
      files: 'parser.js',
      rules: {
        // We could disable checking as auto-generated
        'no-control-regex': 0,
        'no-unused-vars': 0,
        'no-useless-escape': 0,
        semi: 0
      }
    }],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },
    rules: {
        semi: ["error"]
    }
};
