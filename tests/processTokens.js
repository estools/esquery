
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test"
], function (esquery, assert, test) {
    var wildcard = {type: "wildcard", value: "*"};
    
    var idAsdf = {type: "identifier", value: "asdf"};
    var idAttr = {type: "identifier", value: "attr"};
    var idFoo = {type: "identifier", value: "foo"};

    var opColon = {type: "operator", value: ":"};
    var opEq = {type: "operator", value: "="};
    var opSpace = {type: "operator", value: " "};
    var opGreater = {type: "operator", value: ">"};
    var opPlus = {type: "operator", value: "+"};
    var opTilde = {type: "operator", value: "~"};
    var opLParen = {type: "operator", value: "("};
    var opRParen = {type: "operator", value: ")"};
    var opLBracket = {type: "operator", value: "["};
    var opRBracket = {type: "operator", value: "]"};

    var num1 = {type: "number", value: 1};
    var num2 = {type: "number", value: 2};
    
    var keywordNthChild = {type: "keyword", value: "nth-child"};
    

    test.defineSuite("Process tokens", {
        "single nodes": function () {
            var ast = esquery.processTokens([wildcard]);
            assert.matches(wildcard, ast);

            ast = esquery.processTokens([idAsdf]);
            assert.matches(idAsdf, ast);
        },

        "nth-child nodes": function () {
            var ast = esquery.processTokens([opColon, keywordNthChild, opLParen, num2, opRParen]);
            assert.matches({type: "nth-child", index: {type: "literal", value: 2}}, ast);

            ast = esquery.processTokens([opColon, {type: "keyword", value: "first-child"}]);
            assert.matches({type: "nth-child", index: {type: "literal", value: 0}}, ast);

            ast = esquery.processTokens([opColon, {type: "keyword", value: "last-child"}]);
            assert.matches({type: "nth-child", index: {type: "literal", value: -1}}, ast);
        },

        "attribute nodes": function () {
            var ast = esquery.processTokens([opLBracket, idAttr, opRBracket]);
            assert.matches({type: "attribute", name: "attr"}, ast);

            ast = esquery.processTokens([opLBracket, idAttr, opEq, num2, opRBracket]);
            assert.matches({type: "attribute", name: "attr", value: {type: "literal", value: 2}}, ast);

            ast = esquery.processTokens([opLBracket, idAttr, opEq, {type: "string", value: "123"}, opRBracket]);
            assert.matches({type: "attribute", name: "attr", value: {type: "literal", value: "123"}}, ast);
        },

        "descendant selector with identifiers": function () {
            var ast = esquery.processTokens([idFoo, opSpace, idAsdf]);
            assert.matches({
                type: "descendant",
                left: idFoo,
                right: idAsdf
            }, ast);
        },

        "descendant selector with pseudo": function () {
            var ast = esquery.processTokens([opColon, keywordNthChild, opLParen, num1, opRParen,
                    opSpace, idFoo]);
            assert.matches({
                type: "descendant",
                left: {type: "nth-child", index: {type: "literal", value: 1}},
                right: idFoo
            }, ast);

            ast = esquery.processTokens([idFoo, opSpace, opColon, keywordNthChild, 
                    opLParen, num1, opRParen]);
            assert.matches({
                type: "descendant",
                left: idFoo,
                right: {type: "nth-child", index: {type: "literal", value: 1}}
            }, ast);
        },

        "descendant selector with attribute": function () {
            var ast = esquery.processTokens([opColon, keywordNthChild, opLParen, num1, opRParen,
                    opSpace, opLBracket, idFoo, opRBracket]);
            assert.matches({
                type: "descendant",
                left: {type: "nth-child", index: {type: "literal", value: 1}},
                right: {type: "attribute", name: "foo"}
            }, ast);

            ast = esquery.processTokens([opLBracket, idFoo, opRBracket, opSpace,
                    opColon, keywordNthChild, opLParen, num1, opRParen]);
            assert.matches({
                type: "descendant",
                left: {type: "attribute", name: "foo"},
                right: {type: "nth-child", index: {type: "literal", value: 1}}
            }, ast);
        },

        "child selector with identifiers": function () {
            var ast = esquery.processTokens([idFoo, opGreater, idAsdf]);
            assert.matches({
                type: "child",
                left: idFoo,
                right: idAsdf
            }, ast);
        },

        "child selector with pseudo": function () {
            var ast = esquery.processTokens([opColon, keywordNthChild, opLParen, num1, opRParen,
                    opGreater, idFoo]);
            assert.matches({
                type: "child",
                left: {type: "nth-child", index: {type: "literal", value: 1}},
                right: idFoo
            }, ast);

            ast = esquery.processTokens([idFoo, opGreater, opColon, keywordNthChild,
                    opLParen, num1, opRParen]);
            assert.matches({
                type: "child",
                left: idFoo,
                right: {type: "nth-child", index: {type: "literal", value: 1}}
            }, ast);
        },

        "child selector with attribute": function () {
            var ast = esquery.processTokens([opColon, keywordNthChild, opLParen, num1, opRParen,
                    opGreater, opLBracket, idFoo, opRBracket]);
            assert.matches({
                type: "child",
                left: {type: "nth-child", index: {type: "literal", value: 1}},
                right: {type: "attribute", name: "foo"}
            }, ast);

            ast = esquery.processTokens([opLBracket, idFoo, opRBracket, opGreater,
                    opColon, keywordNthChild, opLParen, num1, opRParen]);
            assert.matches({
                type: "child",
                left: {type: "attribute", name: "foo"},
                right: {type: "nth-child", index: {type: "literal", value: 1}}
            }, ast);
        },

        "sibling selector with identifiers": function () {
            var ast = esquery.processTokens([idFoo, opTilde, idAsdf]);
            assert.matches({
                type: "sibling",
                left: idFoo,
                right: idAsdf
            }, ast);
        },

        "adjacent selector with identifiers": function () {
            var ast = esquery.processTokens([idFoo, opPlus, idAsdf]);
            assert.matches({
                type: "adjacent",
                left: idFoo,
                right: idAsdf
            }, ast);
        },

        "and selector with identifiers": function () {
            var ast = esquery.processTokens([idFoo, opLBracket, idFoo, opRBracket]);
            assert.matches({
                type: "and",
                left: idFoo,
                right: {
                    type: "attribute",
                    name: "foo"
                }
            }, ast);
        },

        "compound selector": function () {
            var ast = esquery.processTokens([idFoo, opPlus, opColon, keywordNthChild,
                    opLParen, num1, opRParen, opSpace, opLBracket, idAttr, opEq, num2, opRBracket,
                    opGreater, idFoo]);
            assert.matches({
                type: "child",
                left: {
                    type: "descendant",
                    left: {
                        type: "adjacent",
                        left: {
                            type: "identifier",
                            value: "foo"
                        },
                        right: {
                            type: "nth-child",
                            index: {
                                type: "literal",
                                value: 1
                            }
                        }
                    },
                    right: {
                        type: "attribute",
                        name: "attr",
                        operator: "=",
                        value: {
                            type: "literal",
                            value: 2
                        }
                    }
                },
                right: idFoo
            }, ast);
        }
    });
});