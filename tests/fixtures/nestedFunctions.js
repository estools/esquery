import * as esprima from 'esprima';

const parsed = esprima.parse(
    'function foo() {\n' +
    '  var x = 1;\n' +
    '  function bar() {\n' +
    '    x = 2;\n' +
    '  }\n' +
    '}\n'
);

export default parsed;
