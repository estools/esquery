
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

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
