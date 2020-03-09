import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Pseudo matches query', function () {

    it('conditional', function () {
        const matches = esquery(conditional, ':not(Literal)');
        assert.equal(28, matches.length);
    });

    it('for loop', function () {
        const matches = esquery(forLoop, ':not([name="x"])');
        assert.equal(18, matches.length);
    });

    it('simple function', function () {
        const matches = esquery(simpleFunction, ':not(*)');
        assert.equal(0, matches.length);
    });

    it('simple program', function () {
        const matches = esquery(simpleProgram, ':not(Identifier, IfStatement)');
        assert.equal(15, matches.length);
    });

    it('small program', function () {
        const program = {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'x' },
                    init: { type: 'Literal', value: 1, raw: '1' }
                }],
                kind: 'var'
            }]
        };
        const matches = esquery(program, ':not([value=1])');

        assert.includeMembers(matches, [
            program,
            program.body[0],
            program.body[0].declarations[0],
            program.body[0].declarations[0].id
        ]);
    });
});
