import * as esprima from 'esprima';

const parsed = esprima.parse(`
    function foo(x, y) {
      var z = x + y;
      z++;
      return z;
    }
`);

export default parsed;
