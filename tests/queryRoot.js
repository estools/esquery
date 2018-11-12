
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/nestedFunctions",
], function (esquery, assert, test, nestedFunctions) {

    test.defineSuite("root selector", {

        "root selection": function () {
            var matches = esquery(nestedFunctions, ":root > FunctionDeclaration");
            assert.isSame(1, matches.length);
            assert.isSame(matches[0].id.name, "foo")
        },

    });
});
