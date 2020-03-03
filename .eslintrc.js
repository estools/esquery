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
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        semi: ["error"]
    }
};
