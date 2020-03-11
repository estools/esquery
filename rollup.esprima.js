import {terser} from 'rollup-plugin-terser';

// We don't need this so long as we are hard-coding the
//    `node_modules` path for the sake of the browser, but keeping
//    in event we can use import paths later
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
function getRollupObject ({minifying, format = 'umd'} = {}) {
    const nonMinified = {
        input: 'node_modules/esprima/dist/esprima.js',
        output: {
            format,
            sourcemap: minifying,
            file: `esprima.${format}${minifying ? '.min' : ''}.js`,
            name: 'esprima'
        },
        plugins: [
            nodeResolve(),
            commonjs()
        ]
    };
    if (minifying) {
        nonMinified.plugins.push(terser());
    }
    return nonMinified;
}

export default [
    getRollupObject({minifying: false, format: 'umd'}),
    // getRollupObject({minifying: false, format: 'esm'}) // Might use later
];
