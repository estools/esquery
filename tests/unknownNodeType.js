
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
    "./fixtures/unknownNodeTypeAST",
], function (esquery, assert, test, AST) {

    test.defineSuite("Unknown node type", {

        "does not throw": function () {
            var thrown = false
            try {
              esquery(AST, '.*');
            } catch (e) {
              thrown = true
            } finally {
              assert.isFalse(thrown)
            }
        }
    });
});
