define([
    "esquery",
    "jstestr/assert",
    "jstestr/test",
], function (esquery, assert, test) {

    test.defineSuite("basic query parsing", {

        "empty query": function () {
            assert.isEqual(void 0, esquery.parse(""));
            assert.isEqual(void 0, esquery.parse("      "));
        },

        "leading/trailing whitespace": function () {
            assert.isNotEqual(void 0, esquery.parse(" A"));
            assert.isNotEqual(void 0, esquery.parse("     A"));
            assert.isNotEqual(void 0, esquery.parse("A "));
            assert.isNotEqual(void 0, esquery.parse("A     "));
            assert.isNotEqual(void 0, esquery.parse(" A "));
            assert.isNotEqual(void 0, esquery.parse("     A     "));
        }

    });
});
