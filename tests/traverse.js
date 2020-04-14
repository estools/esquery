import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';

describe('traverse', function () {
    it('iterates matches', function () {
        const matches = [];
        const parents = [];
        const ancestries = [];
        const selector = esquery.parse(':matches(IfStatement)');
        esquery.traverse(conditional, selector, (match, parent, ancestry) => {
            parents.push(parent);
            matches.push(match);
            ancestries.push(ancestry);
        });
        assert.includeMembers(matches, [
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ]);
        assert.includeMembers(parents, [
            conditional,
            conditional.body[1]
        ]);
        assert.includeMembers(ancestries[0], [
            conditional
        ]);
        assert.includeMembers(ancestries[1], [
            conditional
        ]);
        assert.includeMembers(ancestries[2], [
            conditional.body[1],
            conditional
        ]);
    });
});
