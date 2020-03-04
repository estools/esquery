import * as esprima from 'esprima';

const parsed = esprima.parse(
    'x = 10;\n' +
    'while (x > 0) { x--; }'
);

export default parsed;
