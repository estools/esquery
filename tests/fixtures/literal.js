import * as esprima from 'esprima';

const parsed = esprima.parse(`
    var y = '\b\f\\n\\r\t\v and just a  back\\slash';
    var x = 21.35;
    var z = '\\z';
    var a = 'abc\\z';
`);

export default parsed;
