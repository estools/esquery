import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';

import nestedFunctions from './fixtures/nestedFunctions.js';
import bigArray from './fixtures/bigArray.js';
import customNodes from './fixtures/customNodes.js';

describe('Query subject', function () {

    it('type subject', function () {
        const matches = esquery(conditional, '!IfStatement Identifier');
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ]);
    });

    it('* subject', function () {
        const matches = esquery(forLoop, '!* > [name="foo"]');
        assert.includeMembers(matches, [
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee
        ]);
    });

    it(':nth-child subject', function () {
        const matches = esquery(simpleFunction, '!:nth-child(1) [name="y"]');
        assert.includeMembers(matches, [
            simpleFunction.body[0],
            simpleFunction.body[0].body.body[0],
            simpleFunction.body[0].body.body[0].declarations[0]
        ]);
    });

    it(':nth-last-child subject', function () {
        const matches = esquery(simpleProgram, '!:nth-last-child(1) [name="y"]');
        assert.includeMembers(matches, [
            simpleProgram.body[3],
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3].consequent.body[0]
        ]);
    });

    it('attribute literal subject', function () {
        const matches = esquery(simpleProgram, '![test] [name="y"]');
        assert.includeMembers(matches, [
            simpleProgram.body[3]
        ]);
    });

    it('attribute type subject', function () {
        const matches = esquery(nestedFunctions, '![generator=type(boolean)] > BlockStatement');
        assert.includeMembers(matches, [
            nestedFunctions.body[0],
            nestedFunctions.body[0].body.body[1]
        ]);
    });

    it('attribute regexp subject', function () {
        const matches = esquery(conditional, '![operator=/=+/] > [name="x"]');
        assert.includeMembers(matches, [
            conditional.body[0].test,
            conditional.body[0].alternate.body[0].expression,
            conditional.body[1].test.left.left
        ]);
    });

    it('field subject', function () {
        const matches = esquery(forLoop, '!.test');
        assert.includeMembers(matches, [
            forLoop.body[0].test
        ]);
    });

    it(':matches subject', function () {
        const matches = esquery(forLoop, '!:matches(*) > [name="foo"]');
        assert.includeMembers(matches, [
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee
        ]);
    });

    it(':not subject', function () {
        const matches = esquery(nestedFunctions, '!:not(BlockStatement) > [name="foo"]');
        assert.includeMembers(matches, [
            nestedFunctions.body[0]
        ]);
    });

    it('compound attributes subject', function () {
        const matches = esquery(conditional, '![left.name="x"][right.value=1]');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it('descendant right subject', function () {
        const matches = esquery(forLoop, '* !AssignmentExpression');
        assert.includeMembers(matches, [
            forLoop.body[0].init
        ]);
    });

    it('child right subject', function () {
        const matches = esquery(forLoop, '* > !AssignmentExpression');
        assert.includeMembers(matches, [
            forLoop.body[0].init
        ]);
    });

    it('sibling left subject', function () {
        const matches = esquery(simpleProgram, '!VariableDeclaration ~ IfStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[0],
            simpleProgram.body[1]
        ]);
    });

    it('sibling right subject', function () {
        const matches = esquery(simpleProgram, '!VariableDeclaration ~ !IfStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[0],
            simpleProgram.body[1],
            simpleProgram.body[3]
        ]);
    });

    it('adjacent right subject', function () {
        const matches = esquery(simpleProgram, '!VariableDeclaration + !ExpressionStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[1],
            simpleProgram.body[2]
        ]);
    });

    it('multiple adjacent siblings', function () {
        const matches = esquery(bigArray, 'Identifier + Identifier');
        assert.includeMembers(matches, [
            bigArray.body[0].expression.elements[4],
            bigArray.body[0].expression.elements[8]
        ]);
        assert.equal(2, matches.length);
    });

    it('multiple siblings', function () {
        const matches = esquery(bigArray, 'Identifier ~ Identifier');
        assert.includeMembers(matches, [
            bigArray.body[0].expression.elements[4],
            bigArray.body[0].expression.elements[7],
            bigArray.body[0].expression.elements[8]
        ]);
        assert.equal(3, matches.length);
    });
});

describe('Query subject with custom ast', function () {
    const visitorKeys = {
        CustomRoot: ['list'],
        CustomChild: ['sublist'],
        CustomGrandChild: []
    };

    it('sibling', function () {
        const matches = esquery(customNodes, 'CustomChild[name=two] ~ CustomChild', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[3],
        ]);
    });


    it('sibling with fallback', function () {
        const matches = esquery(customNodes, 'CustomChild[name=two] ~ CustomChild', {
            fallback (node) {
                return node.type === 'CustomRoot' ? ['list'] : node.type === 'CustomChild' ? ['sublist'] : [];
            }
        });
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[3],
        ]);
    });

    it('sibling with default fallback', function () {
        const matches = esquery(customNodes, 'CustomChild[name=two] ~ CustomChild');
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[3],
        ]);
    });

    it('adjacent', function () {
        const matches = esquery(customNodes, 'CustomChild[name=two] + CustomChild', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2],
        ]);
    });
});
