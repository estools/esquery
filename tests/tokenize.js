
define([
    "esquery",
    "jstestr/assert",
    "jstestr/test"
], function (esquery, assert, test) {
    test.defineSuite("Selector tokenize", {
        "single identifier": function () {
            var tokens = esquery.tokenize("SomeIdentifier");
            assert.matches([{type: "identifier", value: "SomeIdentifier"}], tokens);

            tokens = esquery.tokenize("id.name");
            assert.matches([{type: "identifier", value: "id.name"}], tokens);
        },

        "single wildcard": function () {
            var tokens = esquery.tokenize("*");
            assert.matches([{type: "wildcard", value: "*"}], tokens);
        },

        "individual operators": function () {
            var tokens = esquery.tokenize(":");
            assert.matches([{type: "operator", value: ":"}], tokens);

            tokens = esquery.tokenize("[");
            assert.matches([{type: "operator", value: "["}], tokens);

            tokens = esquery.tokenize("]");
            assert.matches([{type: "operator", value: "]"}], tokens);

            tokens = esquery.tokenize("(");
            assert.matches([{type: "operator", value: "("}], tokens);

            tokens = esquery.tokenize(")");
            assert.matches([{type: "operator", value: ")"}], tokens);

            tokens = esquery.tokenize("=");
            assert.matches([{type: "operator", value: "="}], tokens);

            tokens = esquery.tokenize("~");
            assert.matches([{type: "operator", value: "~"}], tokens);

            tokens = esquery.tokenize("+");
            assert.matches([{type: "operator", value: "+"}], tokens);

            tokens = esquery.tokenize("!");
            assert.matches([{type: "operator", value: "!"}], tokens);

            tokens = esquery.tokenize(">");
            assert.matches([{type: "operator", value: ">"}], tokens);

            tokens = esquery.tokenize(">=");
            assert.matches([{type: "operator", value: ">="}], tokens);

            tokens = esquery.tokenize("<=");
            assert.matches([{type: "operator", value: "<="}], tokens);

            tokens = esquery.tokenize("!=");
            assert.matches([{type: "operator", value: "!="}], tokens);
        }, 

        "individual keywords": function () {
            var tokens = esquery.tokenize("first-child");
            assert.matches([{type: "keyword", value: "first-child"}], tokens);

            tokens = esquery.tokenize("nth-child");
            assert.matches([{type: "keyword", value: "nth-child"}], tokens);

            tokens = esquery.tokenize("last-child");
            assert.matches([{type: "keyword", value: "last-child"}], tokens);

            tokens = esquery.tokenize("calc");
            assert.matches([{type: "keyword", value: "calc"}], tokens);

            tokens = esquery.tokenize("length");
            assert.matches([{type: "keyword", value: "length"}], tokens);
        },

        "individual numbers": function () {
            var tokens = esquery.tokenize("123");
            assert.matches([{type: "number", value: 123}], tokens);

            tokens = esquery.tokenize("123.45678901");
            assert.matches([{type: "number", value: 123.45678901}], tokens);

            tokens = esquery.tokenize("-123.45678");
            assert.matches([{type: "number", value: -123.45678}], tokens);

            tokens = esquery.tokenize("+123.45678");
            assert.matches([{type: "number", value: 123.45678}], tokens);
        },

        "individual strings": function () {
            var tokens = esquery.tokenize('"asdf asdf"');
            assert.matches([{type: "string", value: "asdf asdf"}], tokens);

            tokens = esquery.tokenize('"asdf \\\" asdf"');
            assert.matches([{type: "string", value: "asdf \" asdf"}], tokens);
        },

        "individual regexp": function () {
            var tokens = esquery.tokenize("/asdf/");
            assert.matches([{type: "regexp", value: "asdf"}], tokens);

            tokens = esquery.tokenize("/asdf \\/ asdf/");
            assert.matches([{type: "regexp", value: "asdf / asdf"}], tokens);
        },

        "pseudo selectors": function () {
            var tokens = esquery.tokenize(":first-child");
            assert.matches([
                {type: "operator", value: ":"},
                {type: "keyword", value: "first-child"}
            ], tokens);

            tokens = esquery.tokenize(":nth-child(2)");
            assert.matches([
                {type: "operator", value: ":"},
                {type: "keyword", value: "nth-child"},
                {type: "operator", value: "("},
                {type: "number", value: 2},
                {type: "operator", value: ")"}
            ], tokens);
        },

        "random spacing": function () {
            var tokens = esquery.tokenize("   123\t 134   asdf    ");
            assert.matches([
                {type: "number", value: 123},
                {type: "operator", value: " "},
                {type: "number", value: 134},
                {type: "operator", value: " "},
                {type: "identifier", value: "asdf"}
            ], tokens);

            tokens = esquery.tokenize("  :nth-child  ( 5)");
            assert.matches([
                {type: "operator", value: ":"},
                {type: "keyword", value: "nth-child"},
                {type: "operator", value: "("},
                {type: "number", value: 5},
                {type: "operator", value: ")"}
            ], tokens);

            tokens = esquery.tokenize("[attr] [attr]");
            assert.matches([
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "]"},
                {type: "operator", value: " "},
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "]"},
            ], tokens);
        },

        "compound selector": function () {
            var tokens = esquery.tokenize(" asdf  >  asdf  +  asdf:first-child[ attr = 2 ] [attr = /asdf / ] ");
            assert.matches([
                {type: "identifier", value: "asdf"},
                {type: "operator", value: ">"},
                {type: "identifier", value: "asdf"},
                {type: "operator", value: "+"},
                {type: "identifier", value: "asdf"},
                {type: "operator", value: ":"},
                {type: "keyword", value: "first-child"},
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "="},
                {type: "number", value: 2},
                {type: "operator", value: "]"},
                {type: "operator", value: " "},
                {type: "operator", value: "["},
                {type: "identifier", value: "attr"},
                {type: "operator", value: "="},
                {type: "regexp", value: "asdf "},
                {type: "operator", value: "]"}
            ], tokens);
        }
    });
});
