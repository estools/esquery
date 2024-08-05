import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Complex selector query', function () {

    it('two types child', function () {
        const matches = esquery(conditional, 'IfStatement > BinaryExpression');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it('three types child', function () {
        const matches = esquery(conditional, 'IfStatement > BinaryExpression > Identifier');
        assert.includeMembers(matches, [
            conditional.body[0].test.left
        ]);
    });

    it('two types descendant', function () {
        const matches = esquery(conditional, 'IfStatement BinaryExpression');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it('two types sibling', function () {
        const matches = esquery(simpleProgram, 'VariableDeclaration ~ IfStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[3]
        ]);
    });

    it('two types adjacent', function () {
        const matches = esquery(simpleProgram, 'VariableDeclaration + ExpressionStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[2]
        ]);
    });

    it('can not match a top level node', function () {
        // Test fix for issue #135: half of a child selector matches a top-level node.
        const matches = esquery(simpleProgram, 'NonExistingNodeType > *');
        assert.isEmpty(matches);
    });

    it('fails field on a descendant', function () {
        const matches = esquery(simpleProgram, 'ExpressionStatement AssignmentExpression.left');
        assert.deepEqual([
            { name: 'x', type: 'Identifier' },
            { name: 'y', type: 'Identifier' }
        ], matches);

        const matches2 = esquery(simpleProgram, 'ExpressionStatement AssignmentExpression.left Identifier[name="y"]');
        assert.equal(1, matches2.length);
    });

    it('fails field should not apply to a parent of descendant', function () {
        const matches = esquery(simpleProgram, 'ExpressionStatement AssignmentExpression > *.left');
        assert.deepEqual([], matches);

        const matches2 = esquery(simpleProgram, 'ExpressionStatement AssignmentExpression Identifier[name="y"].left');
        assert.equal(0, matches2.length);
    });
});
