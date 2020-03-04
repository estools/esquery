import * as esprima from 'esprima';

const parsed = esprima.parse('for (i = 0; i < foo.length; i++) { foo[i](); }');

export default parsed;
