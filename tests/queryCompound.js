
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/conditional"
], function (esquery, assert, test, conditional) {

    test.defineSuite("Compound query", {

        "two attributes": function () {
            var matches = esquery(conditional, '[left.name="x"][right.value=1]');
            assert.contains([
                conditional.body[0].test
            ], matches);
        },

        "type and pseudo": function () {
            var matches = esquery(conditional, '[left.name="x"]:matches(*)');
            assert.contains([
                conditional.body[0].test
            ], matches);
        }
    });
});
