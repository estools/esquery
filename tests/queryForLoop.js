
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/forLoop"
], function (esquery, assert, test, forLoop) {

    test.defineSuite("Query for loop", {
        "node types": function () {
            var matches = esquery(forLoop, "Program");
            assert.contains([forLoop], matches);

            matches = esquery(forLoop, "ForStatement");
            assert.contains([
                forLoop.body[0]
            ], matches);

            matches = esquery(forLoop, "BinaryExpression");
            assert.contains([
                forLoop.body[0].test
            ], matches);
        },

        "node attributes": function () {
            var matches = esquery(forLoop, "[operator=\"=\"]");
            assert.contains([
                forLoop.body[0].init
            ], matches);

            matches = esquery(forLoop, "[object.name=\"foo\"]");
            assert.contains([
                forLoop.body[0].test.right
            ], matches);

            matches = esquery(forLoop, "[operator]");
            assert.contains([
                forLoop.body[0].init,
                forLoop.body[0].test,
                forLoop.body[0].update
            ], matches);
        },

        "wildcard": function () {
            var matches = esquery(forLoop, "*");
            assert.isEqual(18, matches.length, "found all the elements");
        },

        "first child": function () {
            var matches = esquery(forLoop, ":first-child");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },

        "last child": function () {
            var matches = esquery(forLoop, ":last-child");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },

        "nth child": function () {
            var matches = esquery(forLoop, ":nth-child(-1)");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },
    });
});
