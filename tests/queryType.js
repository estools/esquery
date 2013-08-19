
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Type query", {

        "conditional": function () {
            var matches = esquery(conditional, "Program");
            assert.contains([conditional], matches);

            matches = esquery(conditional, "IfStatement");
            assert.contains([
                conditional.body[0],
                conditional.body[1],
                conditional.body[1].alternate
            ], matches);

            matches = esquery(conditional, "LogicalExpression");
            assert.contains([
                conditional.body[1].test,
                conditional.body[1].test.left
            ], matches);

            matches = esquery(conditional, "ExpressionStatement");
            assert.contains([
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "for loop": function () {
            var matches = esquery(forLoop, "Program");
            assert.contains([forLoop], matches);

            matches = esquery(forLoop, "ForStatement");
            assert.contains([
                forLoop.body[0]
            ], matches);

            matches = esquery(forLoop, "BinaryExpression");
            assert.contains([
                forLoop.body[0].test
            ], matches);
        },

        "simple function": function () {
            var matches = esquery(simpleFunction, "Program");
            assert.contains([simpleFunction], matches);

            matches = esquery(simpleFunction, "VariableDeclaration");
            assert.contains([
                simpleFunction.body[0].body.body[0]
            ], matches);

            matches = esquery(simpleFunction, "FunctionDeclaration");
            assert.contains([
                simpleFunction.body[0]
            ], matches);

            matches = esquery(simpleFunction, "ReturnStatement");
            assert.contains([
                simpleFunction.body[0].body.body[2]
            ], matches);
        },

        "simple program": function () {
            var matches = esquery(simpleProgram, "Program");
            assert.contains([simpleProgram], matches);

            matches = esquery(simpleProgram, "VariableDeclaration");
            assert.contains([
                simpleProgram.body[0],
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, "AssignmentExpression");
            assert.contains([
                simpleProgram.body[2].expression,
                simpleProgram.body[3].consequent.body[0].expression
            ], matches);

            matches = esquery(simpleProgram, "Identifier");
            assert.contains([
                simpleProgram.body[0].declarations[0].id,
                simpleProgram.body[1].declarations[0].id,
                simpleProgram.body[2].expression.left,
                simpleProgram.body[2].expression.right.left,
                simpleProgram.body[3].test,
                simpleProgram.body[3].consequent.body[0].expression.left
            ], matches);
        },

        "# type": function () {
            var matches = esquery(forLoop, "#Program");
            assert.contains([
                forLoop
            ], matches);

            matches = esquery(forLoop, "#ForStatement");
            assert.contains([
                forLoop.body[0]
            ], matches);

            matches = esquery(forLoop, "#BinaryExpression");
            assert.contains([
                forLoop.body[0].test
            ], matches);
        },

        "case insensitive type": function () {
            var matches = esquery(forLoop, "Program");
            assert.contains([
                forLoop
            ], matches);

            matches = esquery(forLoop, "forStatement");
            assert.contains([
                forLoop.body[0]
            ], matches);

            matches = esquery(forLoop, "binaryexpression");
            assert.contains([
                forLoop.body[0].test
            ], matches);
        }
    });
});
