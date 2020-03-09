import esquery from "../esquery.js";
import conditional from "./fixtures/conditional.js";
import simpleProgram from "./fixtures/simpleProgram.js";

describe("Complex selector query", function () {

    it("two types child", function () {
        var matches = esquery(conditional, "IfStatement > BinaryExpression");
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it("three types child", function () {
        var matches = esquery(conditional, "IfStatement > BinaryExpression > Identifier");
        assert.includeMembers(matches, [
            conditional.body[0].test.left
        ]);
    });

    it("two types descendant", function () {
        var matches = esquery(conditional, "IfStatement BinaryExpression");
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it("two types sibling", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration ~ IfStatement");
        assert.includeMembers(matches, [
            simpleProgram.body[3]
        ]);
    });

    it("two types adjacent", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration + ExpressionStatement");
        assert.includeMembers(matches, [
            simpleProgram.body[2]
        ]);
    });
});
