import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import forLoop from './fixtures/forLoop.js';
import simpleFunction from './fixtures/simpleFunction.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Wildcard query', function () {

    it('empty', function () {
        const matches = esquery(conditional, '');
        assert.equal(0, matches.length);
    });

    it('conditional', function () {
        const matches = esquery(conditional, '*');
        assert.equal(35, matches.length);
    });

    it('for loop', function () {
        const matches = esquery(forLoop, '*');
        assert.equal(18, matches.length);
    });

    it('simple function', function () {
        const matches = esquery(simpleFunction, '*');
        assert.equal(17, matches.length);
    });

    it('simple program', function () {
        const matches = esquery(simpleProgram, '*');
        assert.equal(22, matches.length);
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
        const matches = esquery(program, '*');

        assert.includeMembers(matches, [
            program,
            program.body[0],
            program.body[0].declarations[0],
            program.body[0].declarations[0].id,
            program.body[0].declarations[0].init
        ]);
    });
});
