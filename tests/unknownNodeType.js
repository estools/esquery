import esquery from '../esquery.js';
import AST from './fixtures/unknownNodeTypeAST.js';

describe('Unknown node type', function () {
    it('does not throw', function () {
        try {
            esquery(AST, '*');
        } catch (e) {
            assert.fail();
        }
    });
});
