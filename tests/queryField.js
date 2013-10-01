
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Field query", {

    	"single field": function () {
            var matches = esquery(conditional, ".test");
            assert.contains([
                conditional.body[0].test,
                conditional.body[1].test,
                conditional.body[1].alternate.test
            ], matches);
    	},
    	
    	"field sequence": function () {
            var matches = esquery(simpleProgram, ".declarations.init");
            assert.contains([
                simpleProgram.body[0].declarations[0].init,
                simpleProgram.body[1].declarations[0].init
            ], matches);
    	}
	});
});
