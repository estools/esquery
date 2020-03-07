import esquery from "../esquery.js";
import forLoop from "./fixtures/forLoop.js";
import simpleProgram from "./fixtures/simpleProgram.js";
import conditional from "./fixtures/conditional.js";

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

    it('missing parent', function () {
        let selector = esquery.parse('!VariableDeclaration + !ExpressionStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                simpleProgram.body[2],
                selector,
                []
            );
        });

        selector = esquery.parse('!VariableDeclaration ~ IfStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                simpleProgram.body[3],
                selector,
                []
            );
        });
    });

    it('adjacent/sibling', function () {
        let selector = esquery.parse('!VariableDeclaration + !ExpressionStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                simpleProgram.body[2],
                selector,
                simpleProgram.body
            );
        });

        selector = esquery.parse('!VariableDeclaration ~ IfStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                simpleProgram.body[3],
                selector,
                simpleProgram.body
            );
        });
    });

    it('Non-array list prop', function () {
        let selector = esquery.parse('!IfStatement ~ IfStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                conditional.body[1],
                selector,
                conditional.body
            );
        });

        selector = esquery.parse('!IfStatement + IfStatement');
        assert.doesNotThrow(() => {
            esquery.matches(
                conditional.body[1],
                selector,
                conditional.body
            );
        });
    });
});
