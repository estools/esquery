
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/nestedFunctions",
    "./fixtures/nestedFunctionsWithReturns",
], function (esquery, assert, test, nestedFunctions, nestedFunctionsWithReturns) {

    test.defineSuite("root selector", {

        "select only first level function": function () {
            var matches = esquery(nestedFunctions, ":root > FunctionDeclaration");
            assert.isSame(1, matches.length);
            assert.isSame(matches[0].id.name, "foo")
        },

        "select only first level return": function () {
            var firstBlock =  esquery(nestedFunctionsWithReturns, "BlockStatement")[0];
            var matches = esquery(firstBlock, ":scope > ReturnStatement");
            assert.isSame(1, matches.length);
            assert.isSame(matches[0].argument.value, "foo")
        },

    });
});
