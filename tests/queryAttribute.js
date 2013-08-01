
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Attribute query", {

        "conditional": function () {
            var matches = esquery(conditional, "[name=\"x\"]");
            assert.contains([
                conditional.body[0].test.left,
                conditional.body[0].alternate.body[0].expression.left,
                conditional.body[1].test.left.left.left,
                conditional.body[1].test.right
            ], matches);

            matches = esquery(conditional, "[callee.name=\"foo\"]");
            assert.contains([
                conditional.body[0].consequent.body[0].expression
            ], matches);

            matches = esquery(conditional, "[operator]");
            assert.contains([
                conditional.body[0].test,
                conditional.body[0].alternate.body[0].expression,
                conditional.body[1].test,
                conditional.body[1].test.left,
                conditional.body[1].test.left.left
            ], matches);
        },

        "for loop": function () {
            var matches = esquery(forLoop, "[operator=\"=\"]");
            assert.contains([
                forLoop.body[0].init
            ], matches);

            matches = esquery(forLoop, "[object.name=\"foo\"]");
            assert.contains([
                forLoop.body[0].test.right
            ], matches);

            matches = esquery(forLoop, "[operator]");
            assert.contains([
                forLoop.body[0].init,
                forLoop.body[0].test,
                forLoop.body[0].update
            ], matches);
        },

        "simple function": function () {
            var matches = esquery(simpleFunction, "[kind=\"var\"]");
            assert.contains([
                simpleFunction.body[0].body.body[0]
            ], matches);

            matches = esquery(simpleFunction, "[id.name=\"foo\"]");
            assert.contains([
                simpleFunction.body[0]
            ], matches);

            matches = esquery(simpleFunction, "[left]");
            assert.contains([
                simpleFunction.body[0].body.body[0].declarations[0].init
            ], matches);
        },

        "simple program": function () {
            var matches = esquery(simpleProgram, "[kind=\"var\"]");
            assert.contains([
                simpleProgram.body[0],
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, "[id.name=\"y\"]");
            assert.contains([
                simpleProgram.body[1].declarations[0]
            ], matches);

            matches = esquery(simpleProgram, "[body]");
            assert.contains([
                simpleProgram,
                simpleProgram.body[3].consequent
            ], matches);
        },

        "conditional regexp": function () {
            var matches = esquery(conditional, "[name=/x|foo/]");
            assert.contains([
                conditional.body[0].test.left,
                conditional.body[0].consequent.body[0].expression.callee,
                conditional.body[0].alternate.body[0].expression.left
            ], matches);
        },

        "simple function regexp": function () {
            var matches = esquery(simpleFunction, "[name=/x|foo/]");
            assert.contains([
                simpleFunction.body[0].id,
                simpleFunction.body[0].params[0],
                simpleFunction.body[0].body.body[0].declarations[0].init.left
            ], matches);
        },

        "simple program regexp": function () {
            var matches = esquery(simpleProgram, "[name=/[asdfy]/]");
            assert.contains([
                simpleProgram.body[1].declarations[0].id,
                simpleProgram.body[3].test,
                simpleProgram.body[3].consequent.body[0].expression.left
            ], matches);
        },

        "for loop regexp": function () {
            var matches = esquery(forLoop, "[name=/i|foo/]");
            assert.contains([
                forLoop.body[0].init.left,
                forLoop.body[0].test.left,
                forLoop.body[0].test.right.object,
                forLoop.body[0].update.argument,
                forLoop.body[0].body.body[0].expression.callee.object,
                forLoop.body[0].body.body[0].expression.callee.property
            ], matches);
        },

        "not string": function () {
            var matches = esquery(conditional, '[name!="x"]');
            assert.contains([
                conditional.body[0].consequent.body[0].expression.callee,
                conditional.body[1].consequent.body[0].expression.left
            ], matches);
        },

        "not type": function () {
            var matches = esquery(conditional, '[value!=type(number)]');
            assert.contains([
                conditional.body[1].test.left.left.right,
                conditional.body[1].test.left.right,
                conditional.body[1].alternate
            ], matches);
        },

        "not regexp": function () {
            var matches = esquery(conditional, '[name!=/x|y/]');
            assert.contains([
                conditional.body[0].consequent.body[0].expression.callee
            ], matches);
        },

        "less than": function () {
            var matches = esquery(conditional, "[body.length<2]");
            assert.contains([
                conditional.body[0].consequent,
                conditional.body[0].alternate,
                conditional.body[1].consequent,
                conditional.body[1].alternate.consequent
            ], matches);
        },

        "greater than": function () {
            var matches = esquery(conditional, "[body.length>1]");
            assert.contains([
                conditional
            ], matches);
        },

        "less than or equal": function () {
            var matches = esquery(conditional, "[body.length<=2]");
            assert.contains([
                conditional,
                conditional.body[0].consequent,
                conditional.body[0].alternate,
                conditional.body[1].consequent,
                conditional.body[1].alternate.consequent
            ], matches);
        },

        "greater than or equal": function () {
            var matches = esquery(conditional, "[body.length>=1]");
            assert.contains([
                conditional,
                conditional.body[0].consequent,
                conditional.body[0].alternate,
                conditional.body[1].consequent,
                conditional.body[1].alternate.consequent
            ], matches);
        },

        "attribute type": function () {
            var matches = esquery(conditional, "[test=type(object)]");
            assert.contains([
                conditional.body[0],
                conditional.body[1],
                conditional.body[1].alternate
            ], matches);

            matches = esquery(conditional, "[value=type(boolean)]");
            assert.contains([
                conditional.body[1].test.left.right,
                conditional.body[1].alternate.test
            ], matches);
        }
    });
});
