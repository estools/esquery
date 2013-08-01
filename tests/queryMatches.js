
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Pseudo matches query", {
    	
    	"conditional matches": function () {
            var matches = esquery(conditional, ":matches(IfStatement)");
            assert.contains([
                conditional.body[0],
                conditional.body[1].alternate
            ], matches);
    	},

    	"for loop matches": function () {
            var matches = esquery(forLoop, ":matches(BinaryExpression, MemberExpression)");
            assert.contains([
                forLoop.body[0].test,
                forLoop.body[0].body.body[0].expression.callee
            ], matches);
    	},

    	"simple function matches": function () {
            var matches = esquery(simpleFunction, ':matches([name="foo"], ReturnStatement)');
            assert.contains([
                simpleFunction.body[0].id,
                simpleFunction.body[0].body.body[2]
            ], matches);
    	},

        "simple program matches": function () {
            var matches = esquery(simpleProgram, ":matches(AssignmentExpression, BinaryExpression)");
            assert.contains([
                simpleProgram.body[2].expression,
                simpleProgram.body[3].consequent.body[0].expression,
                simpleProgram.body[2].expression.right
            ], matches);
        },

        "implicit matches": function () {
            var matches = esquery(simpleProgram, "AssignmentExpression, BinaryExpression, NonExistant");
            assert.contains([
                simpleProgram.body[2].expression,
                simpleProgram.body[3].consequent.body[0].expression,
                simpleProgram.body[2].expression.right
            ], matches);
        }
    });
});
