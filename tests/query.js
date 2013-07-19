
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./ast/simpleProgram",
    "./ast/simpleFunction",
    "./ast/forLoop",
    "./ast/whileLoop",
    "./ast/switchStatement",
    "./ast/conditional",
    "./ast/nestedFunctions"
], function (esquery, assert, test, simpleProgram, simpleFunction, forLoop, whileLoop,
        switchStatement, conditional, nestedFunctions) {

    test.defineSuite("Match AST", {
        "node types": function () {
            var matches = esquery(simpleProgram, "Program");
            assert.isEqual([simpleProgram], matches);

            matches = esquery(simpleProgram, "VariableDeclaration");
            assert.isEqual([
                simpleProgram.body[0],
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, "AssignmentExpression");
            assert.isEqual([
                simpleProgram.body[2].expression,
                simpleProgram.body[3].consequent.body[0].expression
            ], matches);

            matches = esquery(simpleProgram, "Identifier");
            assert.isEqual([
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
            assert.isEqual([
                simpleProgram.body[0],
                simpleProgram.body[1]
            ], matches);

            matches = esquery(simpleProgram, "[id.name=\"y\"]");
            assert.isEqual([
                simpleProgram.body[1].declarations[0]
            ], matches);

            matches = esquery(simpleProgram, "[body]");
            assert.isEqual([
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
                        id: {
                            type: "Identifier",
                            name: "x"
                        },
                        init: {
                            type: "Literal",
                            value: 1,
                            raw: "1"
                        }
                    }],
                    kind: "var"
                }]
            };
            matches = esquery(program, "*");

            assert.isEqual([
                program,
                program.body[0],
                program.body[0].declarations[0],
                program.body[0].declarations[0].id,
                program.body[0].declarations[0].init
            ], matches);
        },

        "nth-child": function () {},
    });
});
