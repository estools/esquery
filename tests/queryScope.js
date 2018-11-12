
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/nestedFunctions",
], function (esquery, assert, test, nestedFunctions) {

    test.defineSuite("scope selector", {

        "scope selection from root": function () {
            var matches = esquery(nestedFunctions, ":scope > FunctionDeclaration");
            assert.isSame(1, matches.length);
            assert.isSame(matches[0].id.name, "foo")
        },

    });
});