import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import conditionalLong from './fixtures/conditionalLong.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';
import customNodes from './fixtures/customNodes.js';

describe('Pseudo *-child query', function () {

    it('conditional first child', function () {
        const matches = esquery(conditional, ':first-child');
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ]);
    });

    it('conditional last child', function () {
        const matches = esquery(conditional, ':last-child');
        assert.includeMembers(matches, [
            conditional.body[1],
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ]);
    });

    it('conditional nth child', function () {
        let matches = esquery(conditional, ':nth-child(2)');
        assert.includeMembers(matches, [
            conditional.body[1]
        ]);

        matches = esquery(conditional, ':nth-last-child(2)');
        assert.includeMembers(matches, [
            conditional.body[0]
        ]);
    });

    it('conditional nth child (multiple digits)', function () {
        const matches = esquery(conditionalLong, ':nth-child(10)');
        assert.includeMembers(matches, [
            conditionalLong.body[9]
        ]);
    });

    it('conditional nth-last child (multiple digits)', function () {
        const matches = esquery(conditionalLong, ':nth-last-child(10)');
        assert.includeMembers(matches, [
            conditionalLong.body[1]
        ]);
    });

    it('for loop first child', function () {
        const matches = esquery(forLoop, ':first-child');
        assert.includeMembers(matches, [
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ]);
    });

    it('for loop last child', function () {
        const matches = esquery(forLoop, ':last-child');
        assert.includeMembers(matches, [
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ]);
    });

    it('for loop nth child', function () {
        const matches = esquery(forLoop, ':nth-last-child(1)');
        assert.includeMembers(matches, [
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ]);
    });

    it('simple function first child', function () {
        const matches = esquery(simpleFunction, ':first-child');
        assert.includeMembers(matches, [
            simpleFunction.body[0],
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[0],
            simpleFunction.body[0].body.body[0].declarations[0]
        ]);
    });

    it('simple function last child', function () {
        const matches = esquery(simpleFunction, ':last-child');
        assert.includeMembers(matches, [
            simpleFunction.body[0],
            simpleFunction.body[0].params[1],
            simpleFunction.body[0].body.body[2],
            simpleFunction.body[0].body.body[0].declarations[0]
        ]);
    });

    it('simple function nth child', function () {
        let matches = esquery(simpleFunction, ':nth-child(2)');
        assert.includeMembers(matches, [
            simpleFunction.body[0].params[1],
            simpleFunction.body[0].body.body[1]
        ]);

        matches = esquery(simpleFunction, ':nth-child(3)');
        assert.includeMembers(matches, [
            simpleFunction.body[0].body.body[2]
        ]);

        matches = esquery(simpleFunction, ':nth-last-child(2)');
        assert.includeMembers(matches, [
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[1]
        ]);
    });

    it('simple program first child', function () {
        const matches = esquery(simpleProgram, ':first-child');
        assert.includeMembers(matches, [
            simpleProgram.body[0],
            simpleProgram.body[0].declarations[0],
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3].consequent.body[0]
        ]);
    });

    it('simple program last child', function () {
        const matches = esquery(simpleProgram, ':last-child');
        assert.includeMembers(matches, [
            simpleProgram.body[3],
            simpleProgram.body[0].declarations[0],
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3].consequent.body[0]
        ]);
    });

    it('simple program nth child', function () {
        let matches = esquery(simpleProgram, ':nth-child(2)');
        assert.includeMembers(matches, [
            simpleProgram.body[1]
        ]);

        matches = esquery(simpleProgram, ':nth-child(3)');
        assert.includeMembers(matches, [
            simpleProgram.body[2]
        ]);

        matches = esquery(simpleProgram, ':nth-last-child(2)');
        assert.includeMembers(matches, [
            simpleProgram.body[2]
        ]);
    });
});

describe('Pseudo *-child query with custom ast', function () {
    const visitorKeys = {
        CustomRoot: ['list'],
        CustomChild: ['sublist'],
        CustomGrandChild: []
    };

    it('conditional first child', function () {
        const matches = esquery(customNodes, ':first-child', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[0],
            customNodes.list[0].sublist[0],
            customNodes.list[2].sublist[0],
            customNodes.list[3].sublist[0],
        ]);
    });

    it('conditional first child with fallback', function () {
        const matches = esquery(customNodes, ':first-child', {
            fallback (node) {
                return node.type === 'CustomRoot' ? ['list'] : node.type === 'CustomChild' ? ['sublist'] : [];
            }
        });
        assert.includeMembers(matches, [
            customNodes.list[0],
            customNodes.list[0].sublist[0],
            customNodes.list[2].sublist[0],
            customNodes.list[3].sublist[0],
        ]);
    });

    it('conditional first child with default fallback', function () {
        const matches = esquery(customNodes, ':first-child');
        assert.includeMembers(matches, [
            customNodes.list[0],
            customNodes.list[0].sublist[0],
            customNodes.list[2].sublist[0],
            customNodes.list[3].sublist[0],
        ]);
    });

    it('conditional last child', function () {
        const matches = esquery(customNodes, ':last-child', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[3],
            customNodes.list[0].sublist[0],
            customNodes.list[2].sublist[1],
            customNodes.list[3].sublist[2],
        ]);
    });

    it('conditional nth child', function () {
        let matches = esquery(customNodes, ':nth-child(2)', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[1],
            customNodes.list[2].sublist[1],
            customNodes.list[3].sublist[1],
        ]);

        matches = esquery(customNodes, ':nth-last-child(2)', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[2].sublist[0],
            customNodes.list[3].sublist[1],
        ]);
    });

    it('conditional nth child combination', function () {
        let matches = esquery(customNodes, ':matches(:nth-child(2), :nth-last-child(2))', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[1],
            customNodes.list[2],
            customNodes.list[2].sublist[0],
            customNodes.list[2].sublist[1],
            customNodes.list[3].sublist[1],
        ]);

        matches = esquery(customNodes, ':not(:nth-child(2)):nth-last-child(2)', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[2].sublist[0],
        ]);


        matches = esquery(customNodes, ':nth-last-child(2) > :nth-child(2)', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2].sublist[1],
        ]);

        matches = esquery(customNodes, ':nth-last-child(2) :nth-child(2)', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2].sublist[1],
        ]);

        matches = esquery(customNodes, '*:has(:nth-child(2))', { visitorKeys });
        assert.includeMembers(matches, [
            customNodes.list[2],
            customNodes.list[3],
        ]);
    });
});
