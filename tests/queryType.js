import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Type query', function () {

    it('conditional', function () {
        let matches = esquery(conditional, 'Program');
        assert.includeMembers(matches, [conditional]);

        matches = esquery(conditional, 'IfStatement');
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ]);

        matches = esquery(conditional, 'LogicalExpression');
        assert.includeMembers(matches, [
            conditional.body[1].test,
            conditional.body[1].test.left
        ]);

        matches = esquery(conditional, 'ExpressionStatement');
        assert.includeMembers(matches, [
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ]);
    });

    it('for loop', function () {
        let matches = esquery(forLoop, 'Program');
        assert.includeMembers(matches, [forLoop]);

        matches = esquery(forLoop, 'ForStatement');
        assert.includeMembers(matches, [
            forLoop.body[0]
        ]);

        matches = esquery(forLoop, 'BinaryExpression');
        assert.includeMembers(matches, [
            forLoop.body[0].test
        ]);
    });

    it('simple function', function () {
        let matches = esquery(simpleFunction, 'Program');
        assert.includeMembers(matches, [simpleFunction]);

        matches = esquery(simpleFunction, 'VariableDeclaration');
        assert.includeMembers(matches, [
            simpleFunction.body[0].body.body[0]
        ]);

        matches = esquery(simpleFunction, 'FunctionDeclaration');
        assert.includeMembers(matches, [
            simpleFunction.body[0]
        ]);

        matches = esquery(simpleFunction, 'ReturnStatement');
        assert.includeMembers(matches, [
            simpleFunction.body[0].body.body[2]
        ]);
    });

    it('simple program', function () {
        let matches = esquery(simpleProgram, 'Program');
        assert.includeMembers(matches, [simpleProgram]);

        matches = esquery(simpleProgram, 'VariableDeclaration');
        assert.includeMembers(matches, [
            simpleProgram.body[0],
            simpleProgram.body[1]
        ]);

        matches = esquery(simpleProgram, 'AssignmentExpression');
        assert.includeMembers(matches, [
            simpleProgram.body[2].expression,
            simpleProgram.body[3].consequent.body[0].expression
        ]);

        matches = esquery(simpleProgram, 'Identifier');
        assert.includeMembers(matches, [
            simpleProgram.body[0].declarations[0].id,
            simpleProgram.body[1].declarations[0].id,
            simpleProgram.body[2].expression.left,
            simpleProgram.body[2].expression.right.left,
            simpleProgram.body[3].test,
            simpleProgram.body[3].consequent.body[0].expression.left
        ]);
    });

    it('# type', function () {
        let matches = esquery(forLoop, '#Program');
        assert.includeMembers(matches, [
            forLoop
        ]);

        matches = esquery(forLoop, '#ForStatement');
        assert.includeMembers(matches, [
            forLoop.body[0]
        ]);

        matches = esquery(forLoop, '#BinaryExpression');
        assert.includeMembers(matches, [
            forLoop.body[0].test
        ]);
    });

    it('case insensitive type', function () {
        let matches = esquery(forLoop, 'Program');
        assert.includeMembers(matches, [
            forLoop
        ]);

        matches = esquery(forLoop, 'forStatement');
        assert.includeMembers(matches, [
            forLoop.body[0]
        ]);

        matches = esquery(forLoop, 'binaryexpression');
        assert.includeMembers(matches, [
            forLoop.body[0].test
        ]);
    });
});
