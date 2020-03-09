import esquery from "../esquery.js";

describe("basic query parsing", function () {

    it("empty query", function () {
        assert.equal(void 0, esquery.parse(""));
        assert.equal(void 0, esquery.parse("      "));
    });

    it("leading/trailing whitespace", function () {
        assert.notEqual(void 0, esquery.parse(" A"));
        assert.notEqual(void 0, esquery.parse("     A"));
        assert.notEqual(void 0, esquery.parse("A "));
        assert.notEqual(void 0, esquery.parse("A     "));
        assert.notEqual(void 0, esquery.parse(" A "));
        assert.notEqual(void 0, esquery.parse("     A     "));
    });
});
