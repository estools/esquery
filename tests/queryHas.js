
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/conditional"
], function (esquery, assert, test, conditional) {

    test.defineSuite("Parent selector query", {

        "conditional": function () {
            var matches = esquery(conditional, 'ExpressionStatement:has([name="foo"][type="Identifier"])');
            assert.isEqual(1, matches.length);
        },

        "one of": function () {
            var matches = esquery(conditional, 'IfStatement:has(LogicalExpression [name="foo"], LogicalExpression [name="x"])');
            assert.isEqual(1, matches.length);
        },

        "chaining": function () {
            var matches = esquery(conditional, 'BinaryExpression:has(Identifier[name="x"]):has(Literal[value="test"])');
            assert.isEqual(1, matches.length);
        },

        "nesting": function () {
            var matches = esquery(conditional, 'Program:has(IfStatement:has(Literal[value=true], Literal[value=false]))');
            assert.isEqual(1, matches.length);
        },

        "non-matching": function () {
            var matches = esquery(conditional, ':has([value="impossible"])');
            assert.isEqual(0, matches.length);
        }

    });
});
