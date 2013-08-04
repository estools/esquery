
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram",
    "./ast/nestedFunctions"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram, nestedFunctions) {

    test.defineSuite("Complex selector query", {

    	"two types child": function () {
            var matches = esquery(conditional, "IfStatement > BinaryExpression");
            assert.contains([
            	conditional.body[0].test
        	], matches);
    	},

        "three types child": function () {
            var matches = esquery(conditional, "IfStatement > BinaryExpression > Identifier");
            assert.contains([
                conditional.body[0].test.left
            ], matches);
        },

    	"two types descendant": function () {
            var matches = esquery(conditional, "IfStatement BinaryExpression");
            assert.contains([
            	conditional.body[0].test
        	], matches);
    	},

    	"two types sibling": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration ~ IfStatement");
            assert.contains([
            	simpleProgram.body[3]
        	], matches);
    	},

    	"two types adjacent": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration + ExpressionStatement");
            assert.contains([
            	simpleProgram.body[2]
        	], matches);
    	}
    });
});
