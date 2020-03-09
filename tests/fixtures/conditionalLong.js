import * as esprima from 'esprima';

const parsed = esprima.parse(`
    if (x === 1) { foo(1); }
    if (x === 2) { foo(2); }
    if (x === 3) { foo(3); }
    if (x === 4) { foo(4); }
    if (x === 5) { foo(5); }
    if (x === 6) { foo(6); }
    if (x === 7) { foo(7); }
    if (x === 8) { foo(8); }
    if (x === 9) { foo(9); }
    if (x === 10) { foo(10); }
    if (x === 11) { foo(11); }
`);

export default parsed;
