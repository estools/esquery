
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

        "conditional": function () {
            var matches = esquery(conditional, ":not(Literal)");
            assert.isEqual(28, matches.length);
        },

        "for loop": function () {
            var matches = esquery(forLoop, ':not([name="x"])');
            assert.isEqual(18, matches.length);
        },

        "simple function": function () {
            var matches = esquery(simpleFunction, ":not(*)");
            assert.isEqual(0, matches.length);
        },

        "simple program": function () {
            var matches = esquery(simpleProgram, ":not(Identifier, IfStatement)");
            assert.isEqual(15, matches.length);
        },

        "small program": function () {
            var program = {
                type: "Program",
                body: [{
                    type: "VariableDeclaration",
                    declarations: [{
                        type: "VariableDeclarator",
                        id: {type: "Identifier", name: "x"},
                        init: {type: "Literal", value: 1, raw: "1"}
                    }],
                    kind: "var"
                }]
            };
            matches = esquery(program, ":not([value=1])");

            assert.contains([
                program,
                program.body[0],
                program.body[0].declarations[0],
                program.body[0].declarations[0].id
            ], matches);
        }
    });
});