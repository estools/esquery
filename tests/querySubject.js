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

    test.defineSuite("Query subject", {

        "type subject": function () {
            var matches = esquery(conditional, "IfStatement! Identifier");
            assert.contains([
            	conditional.body[0],
            	conditional.body[1],
            	conditional.body[1].alternate
        	], matches);
		},

        "* subject": function () {
            var matches = esquery(forLoop, '*! > [name="foo"]');
            assert.contains([
            	forLoop.body[0].test.right,
            	forLoop.body[0].body.body[0].expression.callee
        	], matches);
        },

        ":nth-child subject": function () {
            var matches = esquery(simpleFunction, ':nth-child(1)! [name="y"]');
            assert.contains([
            	simpleFunction.body[0],
            	simpleFunction.body[0].body.body[0],
            	simpleFunction.body[0].body.body[0].declarations[0]
        	], matches);
        },

        ":nth-last-child subject": function () {
            var matches = esquery(simpleProgram, ':nth-last-child(1)! [name="y"]');
            assert.contains([
            	simpleProgram.body[3],
            	simpleProgram.body[1].declarations[0],
            	simpleProgram.body[3].consequent.body[0]
        	], matches);
        },

        "attribute literal subject": function () {
            var matches = esquery(simpleProgram, '[test]! [name="y"]');
            assert.contains([
            	simpleProgram.body[3]
        	], matches);
        },

        "attribute type subject": function () {
            var matches = esquery(nestedFunctions, '[generator=type(boolean)]! > BlockStatement');
            assert.contains([
            	nestedFunctions.body[0],
            	nestedFunctions.body[0].body.body[1]
        	], matches);
        },

        "attribute regexp subject": function () {
            var matches = esquery(conditional, '[operator=/=+/]! > [name="x"]');
            assert.contains([
            	conditional.body[0].test,
            	conditional.body[0].alternate.body[0].expression,
            	conditional.body[1].test.left.left
        	], matches);
        },

        "field subject": function () {
            var matches = esquery(forLoop, '.test!');
            assert.contains([
                forLoop.body[0].test
            ], matches);
        },

        ":matches subject": function () {
            var matches = esquery(forLoop, ':matches(*)! > [name="foo"]');
            assert.contains([
            	forLoop.body[0].test.right,
            	forLoop.body[0].body.body[0].expression.callee
        	], matches);
        },

        ":not subject": function () {
            var matches = esquery(nestedFunctions, ':not(BlockStatement)! > [name="foo"]');
            assert.contains([
            	nestedFunctions.body[0]
        	], matches);
        },

        "compound attributes left subject": function () {
            var matches = esquery(conditional, '[left.name="x"]![right.value=1]');
            assert.contains([
            	conditional.body[0].test
        	], matches);
        },

        "compound attributes group subject": function () {
            var matches = esquery(conditional, '[left.name="x"][right.value=1]!');
            assert.contains([
            	conditional.body[0].test
        	], matches);
        },

        "compound attributes right subject": function () {
            var matches = esquery(conditional, '[left.name="x"][right.value=1]!*');
            assert.contains([
            	conditional.body[0].test
        	], matches);
        },

        "decendent right subject": function () {
            var matches = esquery(forLoop, '* AssignmentExpression!');
            assert.contains([
            	forLoop.body[0].init
        	], matches);
        },

        "child right subject": function () {
            var matches = esquery(forLoop, '* > AssignmentExpression!');
            assert.contains([
            	forLoop.body[0].init
        	], matches);
        },

    	"sibling left subject": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration! ~ IfStatement");
            assert.contains([
            	simpleProgram.body[0],
            	simpleProgram.body[1]
        	], matches);
    	},

    	"sibling right subject": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration! ~ IfStatement!");
            assert.contains([
            	simpleProgram.body[0],
            	simpleProgram.body[1],
            	simpleProgram.body[3]
        	], matches);
    	},

    	"adjacent right subject": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration! + ExpressionStatement!");
            assert.contains([
            	simpleProgram.body[1],
            	simpleProgram.body[2]
        	], matches);
    	}
    });
});
