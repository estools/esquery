
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Pseudo *-child query", {

        "conditional first child": function () {
            var matches = esquery(conditional, ":first-child");
            assert.contains([
                conditional.body[0],
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "conditional last child": function () {
            var matches = esquery(conditional, ":last-child");
            assert.contains([
                conditional.body[1],
                conditional.body[0].consequent.body[0],
                conditional.body[0].alternate.body[0],
                conditional.body[1].consequent.body[0],
                conditional.body[1].alternate.consequent.body[0]
            ], matches);
        },

        "conditional nth child": function () {
            var matches = esquery(conditional, ":nth-child(2)");
            assert.contains([
                conditional.body[1]
            ], matches);

            matches = esquery(conditional, ":nth-last-child(2)");
            assert.contains([
                conditional.body[0]
            ], matches);
        },

        "for loop first child": function () {
            var matches = esquery(forLoop, ":first-child");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },

        "for loop last child": function () {
            var matches = esquery(forLoop, ":last-child");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },

        "for loop nth child": function () {
            var matches = esquery(forLoop, ":nth-last-child(1)");
            assert.contains([
                forLoop.body[0],
                forLoop.body[0].body.body[0]
            ], matches);
        },

        "simple function first child": function () {
            var matches = esquery(simpleFunction, ":first-child");
            assert.contains([
                simpleFunction.body[0],
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[0],
                simpleFunction.body[0].body.body[0].declarations[0]
            ], matches);
        },

        "simple function last child": function () {
            var matches = esquery(simpleFunction, ":last-child");
            assert.contains([
                simpleFunction.body[0],
                simpleFunction.body[0].params[1],
                simpleFunction.body[0].body.body[2],
                simpleFunction.body[0].body.body[0].declarations[0]
            ], matches);
        },

        "simple function nth child": function () {
            var matches = esquery(simpleFunction, ":nth-child(2)");
            assert.contains([
                simpleFunction.body[0].params[1],
                simpleFunction.body[0].body.body[1]
            ], matches);

            matches = esquery(simpleFunction, ":nth-child(3)");
            assert.contains([
                simpleFunction.body[0].body.body[2]
            ], matches);

            matches = esquery(simpleFunction, ":nth-last-child(2)");
            assert.contains([
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[1]
            ], matches);
        },

        "simple program first child": function () {
            var matches = esquery(simpleProgram, ":first-child");
            assert.contains([
                simpleProgram.body[0],
                simpleProgram.body[0].declarations[0],
                simpleProgram.body[1].declarations[0],
                simpleProgram.body[3].consequent.body[0]
            ], matches);
        },

        "simple program last child": function () {
            var matches = esquery(simpleProgram, ":last-child");
            assert.contains([
                simpleProgram.body[3],
                simpleProgram.body[0].declarations[0],
                simpleProgram.body[1].declarations[0],
                simpleProgram.body[3].consequent.body[0]
            ], matches);
        },

        "simple program nth child": function () {
            var matches = esquery(simpleProgram, ":nth-child(2)");
            assert.contains([
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, ":nth-child(3)");
            assert.contains([
                simpleProgram.body[2]
            ], matches);

            matches = esquery(simpleProgram, ":nth-last-child(2)");
            assert.contains([
                simpleProgram.body[2]
            ], matches);
        }
    });
});
