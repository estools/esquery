import * as esprima from 'esprima';

const parsed = esprima.parse(`
    var s1 = "foo/bar";
    var s2 = "foo//bar";

    var b1 = "foo\\/bar";
    var b2 = "foo\\/\\/bar";
`);

export default parsed;


