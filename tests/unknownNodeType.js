define([
  "dist/esquery",
  "jstestr/assert",
  "jstestr/test",
  "./fixtures/unknownNodeTypeAST",
], function (esquery, assert, test, AST) {

  test.defineSuite("Unknown node type", {
    "does not throw": function () {
      try {
        esquery(AST, '*');
      } catch (e) {
        assert.fail();
      }
    }
  });
});
