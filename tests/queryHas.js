import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';

describe('Parent selector query', function () {

    it('conditional', function () {
        const matches = esquery(conditional, 'ExpressionStatement:has([name="foo"][type="Identifier"])');
        assert.equal(1, matches.length);
    });

    it('one of', function () {
        const matches = esquery(conditional, 'IfStatement:has(LogicalExpression [name="foo"], LogicalExpression [name="x"])');
        assert.equal(1, matches.length);
    });

    it('chaining', function () {
        const matches = esquery(conditional, 'BinaryExpression:has(Identifier[name="x"]):has(Literal[value="test"])');
        assert.equal(1, matches.length);
    });

    it('nesting', function () {
        const matches = esquery(conditional, 'Program:has(IfStatement:has(Literal[value=true], Literal[value=false]))');
        assert.equal(1, matches.length);
    });

    it('non-matching', function () {
        const matches = esquery(conditional, ':has([value="impossible"])');
        assert.equal(0, matches.length);
    });

    it('binary op', function () {
        const deepChildMatches = esquery(conditional, 'IfStatement:has(> Identifier[name="x"])');
        assert.equal(0, deepChildMatches.length);

        const shallowChildMatches = esquery(conditional, 'IfStatement:has(> LogicalExpression.test, > Identifier[name="x"])');
        assert.equal(1, shallowChildMatches.length);
    });
});
