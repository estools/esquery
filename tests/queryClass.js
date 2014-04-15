
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/allClasses"
], function (esquery, assert, test, ast) {

    test.defineSuite("Class query", {

        ":statement": function () {
            var matches = esquery(ast, ":statement");
            assert.contains([
              ast.body[0],
              ast.body[0].body,
              ast.body[0].body.body[0]
            ], matches);
            assert.isSame(3, matches.length);
        },

        ":expression": function () {
            var matches = esquery(ast, ":Expression");
            assert.contains([
              ast.body[0].id,
              ast.body[0].body.body[0].expression,
              ast.body[0].body.body[0].expression.left.elements[0],
              ast.body[0].body.body[0].expression.right,
              ast.body[0].body.body[0].expression.right.body
            ], matches);
            assert.isSame(5, matches.length);
        },

        ":function": function () {
            var matches = esquery(ast, ":FUNCTION");
            assert.contains([
              ast.body[0],
              ast.body[0].body.body[0].expression.right
            ], matches);
            assert.isSame(2, matches.length);
        },

        ":declaration": function () {
            var matches = esquery(ast, ":declaratioN");
            assert.contains([
              ast.body[0]
            ], matches);
            assert.isSame(1, matches.length);
        },

        ":pattern": function () {
            var matches = esquery(ast, ":paTTern");
            assert.contains([
              ast.body[0].id,
              ast.body[0].body.body[0].expression,
              ast.body[0].body.body[0].expression.left,
              ast.body[0].body.body[0].expression.left.elements[0],
              ast.body[0].body.body[0].expression.right,
              ast.body[0].body.body[0].expression.right.body
            ], matches);
            assert.isSame(6, matches.length);
        }

    });
});
