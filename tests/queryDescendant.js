define([
    "dist/esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/conditional",
], function (esquery, assert, test, conditional) {

    test.defineSuite("Pseudo matches query", {

        "conditional matches": function () {
            var matches = esquery(conditional, "Program IfStatement");
            assert.contains([
                conditional.body[0],
                conditional.body[1],
                conditional.body[1].alternate
            ], matches);
        },

        "#8: descendant selector includes ancestor in search": function() {
            var matches = esquery(conditional, "Identifier[name=x]");
            assert.isSame(4, matches.length);
            matches = esquery(conditional, "Identifier [name=x]");
            assert.isSame(0, matches.length);
            matches = esquery(conditional, "BinaryExpression [name=x]");
            assert.isSame(2, matches.length);
            matches = esquery(conditional, "AssignmentExpression [name=x]");
            assert.isSame(1, matches.length);
        }

    });
});
