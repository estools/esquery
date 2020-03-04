import esquery from "../esquery.js";
import conditional from "./fixtures/conditional.js";

describe("Parent selector query", function () {

    it("conditional", function () {
        var matches = esquery(conditional, 'ExpressionStatement:has([name="foo"][type="Identifier"])');
        assert.equal(1, matches.length);
    });

    it("one of", function () {
        var matches = esquery(conditional, 'IfStatement:has(LogicalExpression [name="foo"], LogicalExpression [name="x"])');
        assert.equal(1, matches.length);
    });

    it("chaining", function () {
        var matches = esquery(conditional, 'BinaryExpression:has(Identifier[name="x"]):has(Literal[value="test"])');
        assert.equal(1, matches.length);
    });

    it("nesting", function () {
        var matches = esquery(conditional, 'Program:has(IfStatement:has(Literal[value=true], Literal[value=false]))');
        assert.equal(1, matches.length);
    });

    it("non-matching", function () {
        var matches = esquery(conditional, ':has([value="impossible"])');
        assert.equal(0, matches.length);
    });

});
