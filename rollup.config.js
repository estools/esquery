import { terser } from 'rollup-plugin-terser';

import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} [config= {}]
 * @param {boolean} [config.minifying=false]
 * @param {string} [config.format='umd']
 * @returns {external:RollupConfig}
 */
function getRollupObject ({ minifying, format = 'umd' } = {}) {
    const nonMinified = {
        input: 'esquery.js',
        output: {
            format,
            sourcemap: minifying,
            file: `dist/esquery${
                format === 'umd' ? '' : `.${format}`
            }${minifying ? '.min' : ''}.js`,
            name: 'esquery'
        },
        plugins: [
            json(),
            nodeResolve(),
            commonjs(),
            babel({ exclude: 'node_modules/**' })
        ]
    };
    if (minifying) {
        nonMinified.plugins.push(terser());
    }
    return nonMinified;
}

export default [
    getRollupObject({ minifying: true, format: 'umd' }),
    getRollupObject({ minifying: false, format: 'umd' }),
    getRollupObject({ minifying: true, format: 'esm' }),
    getRollupObject({ minifying: false, format: 'esm' })
];
