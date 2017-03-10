
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/conditional"
], function (esquery, assert, test, conditional) {

    test.defineSuite("Parent selector query", {

        "conditional": function () {
            var matches = esquery(conditional, 'ExpressionStatement:has([name="foo"][type="Identifier"])');
            assert.isEqual(1, matches.length);
        }

    });
});
