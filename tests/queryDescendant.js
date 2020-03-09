import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';

describe('Pseudo matches query', function () {

    it('conditional matches', function () {
        const matches = esquery(conditional, 'Program IfStatement');
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ]);
    });

    it('#8: descendant selector includes ancestor in search', function() {
        let matches = esquery(conditional, 'Identifier[name=x]');
        assert.equal(4, matches.length);
        matches = esquery(conditional, 'Identifier [name=x]');
        assert.equal(0, matches.length);
        matches = esquery(conditional, 'BinaryExpression [name=x]');
        assert.equal(2, matches.length);
        matches = esquery(conditional, 'AssignmentExpression [name=x]');
        assert.equal(1, matches.length);
    });

});
