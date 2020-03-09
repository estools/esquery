import esquery from "../esquery.js";
import conditional from "./fixtures/conditional.js";

describe("Compound query", function () {

    it("two attributes", function () {
        var matches = esquery(conditional, '[left.name="x"][right.value=1]');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it("type and pseudo", function () {
        var matches = esquery(conditional, '[left.name="x"]:matches(*)');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });
});
