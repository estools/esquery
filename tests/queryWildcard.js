
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/conditional",
    "./ast/forLoop",
    "./ast/simpleFunction",
    "./ast/simpleProgram"
], function (esquery, assert, test, conditional, forLoop, simpleFunction, simpleProgram) {

    test.defineSuite("Wildcard query", {

        "conditional": function () {
            var matches = esquery(conditional, "*");
            assert.isEqual(35, matches.length, "found all the elements");
        },

        "for loop": function () {
            var matches = esquery(forLoop, "*");
            assert.isEqual(18, matches.length, "found all the elements");
        },

        "simple function": function () {
            var matches = esquery(simpleFunction, "*");
            assert.isEqual(17, matches.length, "found all the elements");
        },

        "simple program": function () {
            var matches = esquery(simpleProgram, "*");
            assert.isEqual(22, matches.length, "found all the elements");
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
            matches = esquery(program, "*");

            assert.contains([
                program,
                program.body[0],
                program.body[0].declarations[0],
                program.body[0].declarations[0].id,
                program.body[0].declarations[0].init
            ], matches);
        }
    });
});
