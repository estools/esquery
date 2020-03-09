import * as esprima from 'esprima';

const parsed = esprima.parse(`
    function foo() {
      var x = 1;
      function bar() {
        x = 2;
      }
    }
`);

export default parsed;
