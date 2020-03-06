import esquery from "../esquery.js";
import forLoop from "./fixtures/forLoop.js";

describe('matches', function () {
    it("falsey node", function () {
        let selector = esquery.parse('*');

        assert.equal(false, esquery.matches(
            null,
            selector,
            []
        ));

        assert.equal(false, esquery.matches(
            '',
            selector,
            []
        ));

        assert.equal(false, esquery.matches(
            false,
            selector,
            []
        ));
    });

    it("falsey selector", function () {
        assert.equal(true, esquery.matches(
            forLoop,
            null,
            []
        ));

        assert.equal(true, esquery.matches(
            forLoop,
            '',
            []
        ));

        assert.equal(true, esquery.matches(
            forLoop,
            false,
            []
        ));
    });

    it("falsey ancestry", function () {
        let selector = esquery.parse('*');

        assert.doesNotThrow(() => {
            esquery.matches(
                forLoop,
                selector,
                null
            );
        });

        assert.doesNotThrow(() => {
            esquery.matches(
                forLoop,
                selector,
                ''
            );
        });

        assert.doesNotThrow(() => {
            esquery.matches(
                forLoop,
                selector,
                false
            );
        });
    });
});
