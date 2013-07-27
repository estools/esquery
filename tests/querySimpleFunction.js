
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/simpleFunction"
], function (esquery, assert, test, simpleFunction) {

    test.defineSuite("Query simple function", {
        "node types": function () {
            var matches = esquery(simpleFunction, "Program");
            assert.contains([simpleFunction], matches);

            matches = esquery(simpleFunction, "VariableDeclaration");
            assert.contains([
                simpleFunction.body[0].body.body[0]
            ], matches);

            matches = esquery(simpleFunction, "FunctionDeclaration");
            assert.contains([
                simpleFunction.body[0]
            ], matches);

            matches = esquery(simpleFunction, "ReturnStatement");
            assert.contains([
                simpleFunction.body[0].body.body[2]
            ], matches);
        },

        "node attributes": function () {
            var matches = esquery(simpleFunction, "[kind=\"var\"]");
            assert.contains([
                simpleFunction.body[0].body.body[0]
            ], matches);

            matches = esquery(simpleFunction, "[id.name=\"foo\"]");
            assert.contains([
                simpleFunction.body[0]
            ], matches);

            matches = esquery(simpleFunction, "[left]");
            assert.contains([
                simpleFunction.body[0].body.body[0].declarations[0].init
            ], matches);
        },

        "wildcard": function () {
            var matches = esquery(simpleFunction, "*");
            assert.isEqual(17, matches.length, "found all the elements");
        },

        "first child": function () {
            var matches = esquery(simpleFunction, ":first-child");
            assert.contains([
                simpleFunction.body[0],
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[0],
                simpleFunction.body[0].body.body[0].declarations[0]
            ], matches);
        },

        "last child": function () {
            var matches = esquery(simpleFunction, ":last-child");
            assert.contains([
                simpleFunction.body[0],
                simpleFunction.body[0].params[1],
                simpleFunction.body[0].body.body[2],
                simpleFunction.body[0].body.body[0].declarations[0]
            ], matches);
        },

        "nth child": function () {
            var matches = esquery(simpleFunction, ":nth-child(2)");
            assert.contains([
                simpleFunction.body[0].params[1],
                simpleFunction.body[0].body.body[1]
            ], matches);

            matches = esquery(simpleFunction, ":nth-child(3)");
            assert.contains([
                simpleFunction.body[0].body.body[2]
            ], matches);

            matches = esquery(simpleFunction, ":nth-last-child(2)");
            assert.contains([
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[1]
            ], matches);
        },

        "regexp": function () {
            var matches = esquery(simpleFunction, "[name=/x|foo/]");
            assert.contains([
                simpleFunction.body[0].id,
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[0].declarations[0].init.left
            ], matches);
        }
    });
});
