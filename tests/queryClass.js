import esquery from '../esquery.js';
import ast from './fixtures/allClasses.js';

describe('Class query', function () {

    it(':statement', function () {
        const matches = esquery(ast, ':statement');
        assert.includeMembers(matches, [
            ast.body[0],
            ast.body[0].body,
            ast.body[0].body.body[0],
            ast.body[0].body.body[1],
            ast.body[0].body.body[2],
            ast.body[0].body.body[3]
        ]);
        assert.equal(6, matches.length);
    });

    it(':expression', function () {
        const matches = esquery(ast, ':Expression');
        assert.includeMembers(matches, [
            ast.body[0].id,
            ast.body[0].body.body[0].expression,
            ast.body[0].body.body[0].expression.left.elements[0],
            ast.body[0].body.body[0].expression.right,
            ast.body[0].body.body[0].expression.right.body,
            ast.body[0].body.body[1].expression,
            ast.body[0].body.body[2].expression,
            ast.body[0].body.body[3].expression,
            ast.body[0].body.body[3].expression.expressions[0]
        ]);
        assert.equal(9, matches.length);
    });

    it(':function', function () {
        const matches = esquery(ast, ':FUNCTION');
        assert.includeMembers(matches, [
            ast.body[0],
            ast.body[0].body.body[0].expression.right
        ]);
        assert.equal(2, matches.length);
    });

    it(':declaration', function () {
        const matches = esquery(ast, ':declaratioN');
        assert.includeMembers(matches, [
            ast.body[0]
        ]);
        assert.equal(1, matches.length);
    });

    it(':pattern', function () {
        const matches = esquery(ast, ':paTTern');
        assert.includeMembers(matches, [
            ast.body[0].id,
            ast.body[0].body.body[0].expression,
            ast.body[0].body.body[0].expression.left,
            ast.body[0].body.body[0].expression.left.elements[0],
            ast.body[0].body.body[0].expression.right,
            ast.body[0].body.body[0].expression.right.body,
            ast.body[0].body.body[1].expression,
            ast.body[0].body.body[2].expression,
            ast.body[0].body.body[3].expression,
            ast.body[0].body.body[3].expression.expressions[0]
        ]);
        assert.equal(10, matches.length);
    });

});
