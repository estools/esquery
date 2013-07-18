
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test"
], function (esquery, assert, test) {
    test.defineSuite("Process tokens", {
        "single nodes": function () {
            var ast = esquery.processTokens([{type: "wildcard", value: "*"}]);
            assert.matches({type: "wildcard", value: "*"}, ast);

            ast = esquery.processTokens([{type: "identifier", value: "asdf"}]);
            assert.matches({type: "identifier", value: "asdf"}, ast);
        },

        "nth-child nodes": function () {
            var ast = esquery.processTokens([
                {type: "operator", value: ":"},
                {type: "keyword", value: "nth-child"},
                {type: "operator", value: "("},
                {type: "number", value: 2},
                {type: "operator", value: ")"}
            ]);
            assert.matches({type: "nth-child", index: {type: "literal", value: 2}}, ast);

            ast = esquery.processTokens([
                {type: "operator", value: ":"},
                {type: "keyword", value: "first-child"}
            ]);
            assert.matches({type: "nth-child", index: {type: "literal", value: 0}}, ast);

            ast = esquery.processTokens([
                {type: "operator", value: ":"},
                {type: "keyword", value: "last-child"}
            ]);
            assert.matches({type: "nth-child", index: {type: "literal", value: -1}}, ast);
        },

        "attribute nodes": function () {
            var ast = esquery.processTokens([
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "]"}
            ]);
            assert.matches({type: "attribute", name: "attr"}, ast, "no value attribute");

            ast = esquery.processTokens([
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "="},
                {type: "number", value: 123},
                {type: "operator", value: "]"}
            ]);
            assert.matches({type: "attribute", name: "attr", value: {type: "literal", value: 123}}, ast, "number attribute");

            ast = esquery.processTokens([
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "="},
                {type: "string", value: "123"},
                {type: "operator", value: "]"}
            ]);
            assert.matches({type: "attribute", name: "attr", value: {type: "literal", value: "123"}}, ast, "string attribute");
        },

        "descendant selector": function () {
            var ast = esquery.processTokens([
                {type: "identifier", value: "foo"},
                {type: "operator", value: " "},
                {type: "identifier", value: "foo2"}
            ]);
            assert.matches({
                type: "descendant",
                left: {type: "identifier", value: "foo"},
                right: {type: "identifier", value: "foo2"}
            }, ast, "identifier descendant");
        }
    });
});