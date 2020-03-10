import * as esprima from 'esprima';

const parsed = esprima.parse(`
    var x = 1;
    var y = 'y';
    x = x * 2;
    if (y) { y += 'z'; }
`);

export default parsed;
