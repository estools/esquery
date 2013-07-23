
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional"
], function (esquery, assert, test, conditional) {

    test.defineSuite("Query conditonal", {
        "node types": function () {
            var matches = esquery(conditional, "Program");
            assert.contains([conditional], matches);

            matches = esquery(conditional, "IfStatement");
            assert.contains([
                conditional.body[0],
                conditional.body[1],
                conditional.body[1].alternate
            ], matches);

            matches = esquery(conditional, "LogicalExpression");
            assert.contains([
                conditional.body[1].test,
                conditional.body[1].test.left
            ], matches);

            matches = esquery(conditional, "ExpressionStatement");
            assert.contains([
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "node attributes": function () {
            var matches = esquery(conditional, "[name=\"x\"]");
            assert.contains([
                conditional.body[0].test.left,
                conditional.body[0].alternate.body[0].expression.left,
                conditional.body[1].test.left.left.left,
                conditional.body[1].test.right
            ], matches);

            matches = esquery(conditional, "[callee.name=\"foo\"]");
            assert.contains([
                conditional.body[0].consequent.body[0].expression
            ], matches);

            matches = esquery(conditional, "[operator]");
            assert.contains([
                conditional.body[0].test,
                conditional.body[0].alternate.body[0].expression,
                conditional.body[1].test,
                conditional.body[1].test.left,
                conditional.body[1].test.left.left
            ], matches);
        },

        "wildcard": function () {
            var matches = esquery(conditional, "*");
            assert.isEqual(35, matches.length, "found all the elements");
        },

        "first child": function () {
            var matches = esquery(conditional, ":first-child");
            assert.contains([
                conditional.body[0],
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "last child": function () {
            var matches = esquery(conditional, ":last-child");
            assert.contains([
                conditional.body[1],
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "nth child": function () {
            var matches = esquery(conditional, ":nth-child(1)");
            assert.contains([
                conditional.body[1]
            ], matches);

            matches = esquery(conditional, ":nth-child(-2)");
            assert.contains([
                conditional.body[0]
            ], matches);
        },
    });
});
