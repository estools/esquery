import esquery from '../esquery.js';
import forLoop from './fixtures/forLoop.js';
import simpleProgram from './fixtures/simpleProgram.js';
import conditional from './fixtures/conditional.js';
import customNodes from './fixtures/customNodes.js';
import customNodesWithKind from './fixtures/customNodesWithKind.js';

describe('matches', function () {
    it('falsey node', function () {
        const selector = esquery.parse('*');

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

    it('falsey selector', function () {
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

    it('falsey ancestry', function () {
        const selector = esquery.parse('*');

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

describe('matches with custom AST and custom visitor keys', function () {
    it('adjacent/sibling', function () {
        const options = {
            visitorKeys: {
                CustomRoot: ['list'],
                CustomChild: ['sublist'],
                CustomGrandChild: []
            }
        };
        let selector = esquery.parse('CustomChild + CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
                options
            );
        });

        selector = esquery.parse('CustomChild ~ CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
                options
            );
        });
    });
});

describe('matches with custom AST and nodeTypeKey and custom visitor keys', function () {
    it('adjacent/sibling', function () {
        const options = {
            visitorKeys: {
                CustomRoot: ['list'],
                CustomChild: ['sublist'],
                CustomGrandChild: [],
                CustomStatement: [],
                CustomExpression: []
            },
            nodeTypeKey: 'kind'
        };

        let selector = esquery.parse('CustomChild + CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodesWithKind.list[1],
                selector,
                [customNodesWithKind],
                options
            );
        });

        selector = esquery.parse('CustomChild ~ CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodesWithKind.list[1],
                selector,
                [customNodesWithKind],
                options
            );
        });
    });
});

describe('matches with custom AST and fallback option', function () {
    it('adjacent/sibling', function () {
        const options = {
            fallback (node) {
                return node.type === 'CustomRoot' ? ['list'] : node.type === 'CustomChild' ? ['sublist'] : [];
            }
        };
        let selector = esquery.parse('CustomChild + CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
                options
            );
        });

        selector = esquery.parse('CustomChild ~ CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
                options
            );
        });
    });
});

describe('matches with custom AST and default fallback', function () {
    it('adjacent/sibling', function () {
        let selector = esquery.parse('CustomChild + CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
            );
        });

        selector = esquery.parse('CustomChild ~ CustomChild');
        assert.doesNotThrow(() => {
            esquery.matches(
                customNodes.list[1],
                selector,
                [customNodes],
            );
        });
    });
});
