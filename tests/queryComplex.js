
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/conditional",
    "./fixtures/forLoop",
    "./fixtures/simpleFunction",
    "./fixtures/simpleProgram",
    "./fixtures/nestedFunctions"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram, nestedFunctions) {

    test.defineSuite("Complex selector query", {

        "two types child": function () {
            var matches = esquery(conditional, "IfStatement > BinaryExpression");
            assert.contains([
                conditional.body[0].test
            ], matches);
        },

        "two types child (shorthand)": function () {
            var matches = esquery(conditional, "@If > @Binary");
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

        "three types child (shorthand)": function () {
            var matches = esquery(conditional, "@If > @Binary > @Id");
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

        "two types descendant (shorthand)": function () {
            var matches = esquery(conditional, "@If @Binary");
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

        "two types sibling (shorthand)": function () {
            var matches = esquery(simpleProgram, "@Var ~ @If");
            assert.contains([
                simpleProgram.body[3]
            ], matches);
        },

        "two types adjacent": function () {
            var matches = esquery(simpleProgram, "VariableDeclaration + ExpressionStatement");
            assert.contains([
                simpleProgram.body[2]
            ], matches);
        },

        "two types adjacent (shorthand)": function () {
            var matches = esquery(simpleProgram, "@Variable + @Expr");
            assert.contains([
                simpleProgram.body[2]
            ], matches);
        }
    });
});
