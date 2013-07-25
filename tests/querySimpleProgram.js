
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/simpleProgram"
], function (esquery, assert, test, simpleProgram) {

    test.defineSuite("Query simple program", {
        "node types": function () {
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

        "node attributes": function () {
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

        "wildcard": function () {
            var matches = esquery(simpleProgram, "*");
            assert.isEqual(22, matches.length, "found all the elements");

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
        },

        "first child": function () {
            var matches = esquery(simpleProgram, ":first-child");
            assert.contains([
                simpleProgram.body[0],
                simpleProgram.body[0].declarations[0],
                simpleProgram.body[1].declarations[0],
                simpleProgram.body[3].consequent.body[0]
            ], matches);
        },

        "last child": function () {
            var matches = esquery(simpleProgram, ":last-child");
            assert.contains([
                simpleProgram.body[3],
                simpleProgram.body[0].declarations[0],
                simpleProgram.body[1].declarations[0],
                simpleProgram.body[3].consequent.body[0]
            ], matches);
        },

        "nth child": function () {
            var matches = esquery(simpleProgram, ":nth-child(1)");
            assert.contains([
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, ":nth-child(2)");
            assert.contains([
                simpleProgram.body[2]
            ], matches);

            matches = esquery(simpleProgram, ":nth-child(-2)");
            assert.contains([
                simpleProgram.body[2]
            ], matches);
        },

        "regexp": function () {
            var matches = esquery(simpleProgram, "[name=/[asdfy]/]");
            assert.contains([
                simpleProgram.body[1].declarations[0].id,
                simpleProgram.body[3].test,
                simpleProgram.body[3].consequent.body[0].expression.left
            ], matches);
        }
    });
});
