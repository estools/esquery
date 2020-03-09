import esquery from "../esquery.js";
import conditional from "./fixtures/conditional.js";
import simpleProgram from "./fixtures/simpleProgram.js";

describe("Field query", function () {

    it("single field", function () {
        var matches = esquery(conditional, ".test");
        assert.includeMembers(matches, [
            conditional.body[0].test,
            conditional.body[1].test,
            conditional.body[1].alternate.test
        ]);
    });

    it("field sequence", function () {
        var matches = esquery(simpleProgram, ".declarations.init");
        assert.includeMembers(matches, [
            simpleProgram.body[0].declarations[0].init,
            simpleProgram.body[1].declarations[0].init
        ]);
    });

    it("field sequence (long)", function () {
        var matches = esquery(simpleProgram, ".body.declarations.init");
        assert.includeMembers(matches, [
            simpleProgram.body[0].declarations[0].init,
            simpleProgram.body[1].declarations[0].init
        ]);
    });
});
