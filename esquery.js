(function () {

    function esqueryModule() {
        var REG = "\\s*(\\/(?:\\\\/|[^\\/])*\\/)\\s*";
        var NUM = "([+\\-]?[0-9]*\\.?[0-9]+)";
        var STR = '("(?:\\"|[^"])*")';
        var OP = "(\\*|\\.)";
        var S_DOP_S = "\\s*(!=|<=|>=)\\s*";
        var S_OP = "\\s*(\\]|\\)|!)";
        var OP_S = "(\\[|:)\\s*";
        var S_OP_S = "\\s*(\\,|~|<|>|=|\\+|\\||\\(|\\s)\\s*";
        var OPS = OP + "|" + S_DOP_S + "|" + S_OP + "|" + S_OP_S + "|" + OP_S;
        var TOKEN_SPLIT = new RegExp(REG + "|" + NUM + "|" + STR + "|" + OPS);

        /**
         * Tokenize a selector string into an array of tokens. Tokens
         * contain a type and value field.
         */
        function tokenize(selector) {
            selector = selector.replace(/^\s*|\s*$/g, "");
            var tokens = selector.split(TOKEN_SPLIT);

            tokens = tokens.filter(function (token) {
                return token;
            });

            tokens = tokens.map(function (token) {
                if (token === "*") {
                    return {
                        type: "wildcard",
                        value: "*"
                    };
                } else if (/type|not|matches|first\-child|nth\-child|nth\-last\-child|last\-child|length|calc/.test(token)) {
                    return {
                        type: "keyword",
                        value: token
                    };
                } else if (/".*"/.test(token)) {
                    return {
                        type: "string",
                        value: token.replace(/^"|"$/g, "").replace(/\\"/, "\"")
                    };
                } else if (/[+\-]?[0-9]*.?[0-9]+/.test(token)) {
                    return {
                        type: "number",
                        value: parseFloat(token)
                    };
                } else if (/\/.*\//.test(token)) {
                    return {
                        type: "regexp",
                        value: token.replace(/^\/|\/$/g, "").replace(/\\\//g, "/")
                    };
                } else if (/!=|<=|>=|<|>|,|~|=|!|:|\.|\+|\[|\]|\(|\)|\s/.test(token)) {
                    return {
                        type: "operator",
                        value: token
                    };
                } else {
                    return {
                        type: "identifier",
                        value: token
                    };
                }
            });

            return tokens;
        }

        /**
         * Loop through all the tokens and process them into the
         * selector AST. The selector AST is a tree containing
         * nodes representing the various elements of the selector:
         * * descendant
         * * child
         * * sibling
         * * adjacent
         * * 'and'
         * * nth-child(num)
         * * [attribute]
         */
        function processTokens(tokens) {
            var result, selector;
            while (tokens.length > 0) {
                selector = consumeComplexSelector(tokens);
                if (tokens.length > 0) {
                    var token = tokens.shift();
                    if (token.type === "operator" && token.value === ",") {
                        if (!result) {
                            result = {
                                type: "matches",
                                selectors: [selector]
                            };
                        } else {
                            result.selectors.push(selector);
                        }
                        selector = undefined;
                    } else {
                        throw createError("Invalid token, expected ',': ", token, tokens);
                    }
                } else if (selector && result) {
                    result.selectors.push(selector);
                }
            }
            return result || selector;
        }

        var operatorMap = {
            " ": "descendant",
            ">": "child",
            "~": "sibling",
            "+": "adjacent"
        };

        function peekOp(tokens, opValue) {
            if (tokens.length > 0 && peekType(tokens, "operator") &&
                    (opValue instanceof RegExp && opValue.test(tokens[0].value) ||
                    tokens[0].value === opValue)) {
                return tokens[0];
            }
        }

        function consumeOp(tokens, opValue) {
            if (peekOp(tokens, opValue)) {
                return tokens.shift();
            } else {
                throw createError("Expected operator " + opValue + ", but found: ", tokens[0], tokens);
            }
        }

        function peekType(tokens, type) {
            if (tokens.length > 0 && (tokens[0].type === type ||
                    type instanceof RegExp && type.test(tokens[0].type))) {
                return tokens[0];
            }
        }

        function consumeType(tokens, type) {
            if (peekType(tokens, type)) {
                return tokens.shift();
            } else {
                throw createError("Expected type " + type + ", but found: ", tokens[0], tokens);
            }
        }

        function consumeComplexSelector(tokens) {
            var selector;
            selector = consumeCompoundSelector(tokens);
            if (tokens.length > 0) {
                if (peekOp(tokens, /[\s+~>]/)) {
                    var op = tokens.shift()
                    var right = consumeComplexSelector(tokens)
                    if (right) {
                        selector = {
                            type: operatorMap[op.value],
                            left: selector,
                            right: right 
                        };
                    } else {
                        throw createError("Invalid right side of complex selector: ", op, tokens);
                    }
                }
            }
            return selector;
        }

        /**
         * Core token processor
         */
        function consumeCompoundSelector(tokens) {
            var result, selector;

            result = consumeSelector(tokens);

            while (tokens.length > 0) {
                selector = consumeSelector(tokens);
                if (selector) {
                    if (result.type !== "compound") {
                        result = {
                            type: "compound",
                            selectors: [result]
                        };
                    }

                    result.selectors.push(selector);
                } else {
                    break;
                }
            }

            return result || selector;
        }

        function consumeSelector(tokens) {
            var selector;
            if (peekType(tokens, "wildcard")) {
                selector = tokens.shift();
            } else if (peekType(tokens, /keyword|identifier/)) {
                selector = {
                    type: "identifier",
                    value: tokens.shift().value
                };
            } else if (peekOp(tokens, ":")) {
                selector = consumePseudo(tokens);
            } else if (peekOp(tokens, "[")) {
                selector = consumeAttribute(tokens);
            } else if (peekOp(tokens, ".")) {
                selector = consumeField(tokens);
            }

            if (selector && peekOp(tokens, "!")) {
                tokens.shift();
                selector.subject = true;
            }

            return selector;
        }

        /**
         * Consume the various types of pseudo selectors (:*-child).
         */
        function consumePseudo(tokens) {
            var op = consumeOp(tokens, ":");
            var id = consumeType(tokens, "keyword");
            switch (id.value) {
            case "first-child":
                return {
                    type: "nth-child",
                    index: {
                        type: "literal",
                        value: 1
                    }
                };
            case "nth-child":
                return {
                    type: "nth-child",
                    index: consumeArg(tokens)
                };
            case "nth-last-child":
                return {
                    type: "nth-last-child",
                    index: consumeArg(tokens)
                };
            case "last-child":
                return {
                    type: "nth-last-child",
                    index: {
                        type: "literal",
                        value: 1
                    }
                };
            case "matches":
                return {
                    type: "matches",
                    selectors: consumeArgList(tokens)
                };
            case "not":
                return {
                    type: "not",
                    selectors: consumeArgList(tokens)
                };
            default:
                throw createError("Unexpected keyword: ", id, tokens);
            }
        }

        function consumeName(tokens) {
            var name = "";
            while (!name || peekOp(tokens, ".")) {
                if (name) {
                    consumeOp(tokens, ".");
                    name += ".";
                }
                name += consumeType(tokens, /keyword|identifier/).value;
            }

            return name;
        }

        /**
         * Consume an attribute selector ([])
         */
        function consumeAttribute(tokens) {
            var op = consumeOp(tokens, "[");
            var name = consumeName(tokens);
        
            op = consumeType(tokens, "operator");
            if (op.value === "]") {
                return {
                    type: "attribute",
                    name: name
                };
            } else {
                var selector = {
                    type: "attribute",
                    name: name,
                    operator: op.value,
                    value: consumeValue(tokens)
                };

                consumeOp(tokens, "]");
                return selector;
            }
        }

        /**
         * Consume the various types of pseudo selectors (:*-child).
         */
        function consumeField(tokens) {
            var op = consumeOp(tokens, ".");
            var name = consumeName(tokens, /keyword|identifier/);
            return {
                type: "field",
                name: name
            };
        }

        function consumeArgList(tokens) {
            consumeOp(tokens, "(");
            
            var arg, result = [];
            while (tokens.length > 0) {
                arg = consumeComplexSelector(tokens);
                if (arg) {
                    result.push(arg);
                } else {
                    throw createError("Expect selector argument: ", tokens[0], tokens);
                }

                if (peekOp(tokens, ",")) {
                    tokens.shift();
                } else {
                    break;
                }
            }

            consumeOp(tokens, ")");
            return result;
        }

        /**
         * Consume operator argumetns inside parens
         */
        function consumeArg(tokens) {
            consumeOp(tokens, "(");
            var value = consumeValue(tokens);
            consumeOp(tokens, ")");
            return value;
        }

        /**
         * Consume values (literals and computed values)
         */
        function consumeValue(tokens) {
            var token = tokens.shift();
            if (/number|string/.test(token.type)) {
                return {
                    type: "literal",
                    value: token.value
                };
            } else if (token.type === "regexp") {
                return {
                    type: "regexp",
                    value: new RegExp(token.value)
                };
            } else if (/keyword|type/.test(token.type) && peekOp(tokens, "(")) {
                return {
                    type: "type",
                    value: consumeArg(tokens).value
                };
            } else if (/keyword|identifier/.test(token.type)) {
                return {
                    type: "literal",
                    value: token.value
                };
            } else {
                throw createError("Unexpected token for value: ", token, tokens);
            }
        }

        /**
         * Create an error object with the supplied information.
         */
        function createError(message, token, tokens) {
            return new Error(message + JSON.stringify(token) + "\n" +
                    "Remaining tokens: " + JSON.stringify(tokens, null, "  "));
        }

        /**
         * Walk the ECMAScript AST with a pre-order traversal. If the callback function
         * returns something, then that will be passed to the subtree node visits.
         */
        function visitPre(ast, fn, path) {
            fn(ast, path);
            
            var key, newPath;
            for (key in ast) {
                newPath = path ? path + "." + key : key;
                if (ast[key] && ast[key].forEach) {
                    ast[key].forEach(function (node) {
                        visitPre(node, fn, newPath);
                    });
                } else if (ast[key] && ast[key].type) {
                    visitPre(ast[key], fn, newPath);
                }
            }
        }

        /**
         * Visit all children of the node, but don't recurse
         */
        function visitChildren(ast, fn) {
            var key;
            for (key in ast) {
                if (ast[key] && ast[key].forEach) {
                    ast[key].forEach(function (node) {
                        fn(node);
                    });
                } else if (ast[key] && ast[key].type) {
                    fn(ast[key]);
                }
            }
        }

        /**
         * Get the value of a property which may be multiple levels down in the object.
         */
        function getPath(obj, key) {
            var keys = key.split(".");
            var i;
            value = obj;
            for (i = 0; i < keys.length; i++) {
                if (value[keys[i]] !== undefined) {
                    value = value[keys[i]];
                } else {
                    return undefined;
                }
            }
            return value;
        }

        /**
         * Get the final set of matches given a match results object.
         */
        function finalMatches(results) {
            var matches = [];
            if (results.subject.length > 0) {
                results.subject.forEach(function (subjects) {
                    matches = matches.concat(subjects);
                });
            } else {
                matches = results.matches;
            }

            return matches;
        }

        /**
         * This is the core match method. It takes the code AST and the selector AST
         * and returns the matching nodes of the code.
         */
        function match(ast, selector) {
            var leftResults, rightResults, subject = [], matches = [];
            var results = {
                subject: subject,
                matches: matches
            };

            if (!selector) {
                return results;
            }

            switch (selector.type) {
            case "wildcard":
                visitPre(ast, function (node) {
                    matches.push(node);

                    if (selector.subject) {
                        subject.push([node]);
                    }
                });
                break;

            case "identifier":
                visitPre(ast, function (node) {
                    if (node.type === selector.value) {
                        matches.push(node);

                        if (selector.subject) {
                            subject.push([node]);
                        }
                    }
                });
                break;

            // nth-child is used for first/nth-child it only supports integers for now
            case "nth-child":
                visitPre(ast, function (node) {
                    var index = selector.index.value;
                    Object.keys(node).forEach(function (key) {
                        if (node[key] && node[key].forEach) {
                            var len = node[key].length;
                            if (index > 0 && index <= len) {
                                matches.push(node[key][index - 1]);

                                if (selector.subject) {
                                    subject.push([node[key][index - 1]]);
                                }
                            }
                        }
                    });
                });
                break;

            // nth-last-child is used for last/nth-last-child it only supports integers for now
            case "nth-last-child":
                visitPre(ast, function (node) {
                    var index = selector.index.value;
                    Object.keys(node).forEach(function (key) {
                        if (node[key] && node[key].forEach) {
                            var len = node[key].length;
                            if (len - index < len && len - index >= 0) {
                                matches.push(node[key][len - index]);

                                if (selector.subject) {
                                    subject.push([node[key][len - index]]);
                                }
                            }
                        }
                    });
                });
                break;

            // attribute selector is also different from css, it allows use of regexp
            // and =, <, >, <=, >=, != comparisons
            case "attribute":
                switch (selector.value && selector.value.type || "literal") {
                case "literal":
                    visitPre(ast, function (node) {
                        var value = getPath(node, selector.name);
                        if (!selector.operator && value !== undefined ||
                                selector.operator === "=" && value === selector.value.value ||
                                selector.operator === "!=" && value != selector.value.value ||
                                selector.operator === "<=" && value <= selector.value.value ||
                                selector.operator === ">=" && value >= selector.value.value ||
                                selector.operator === "<" && value < selector.value.value ||
                                selector.operator === ">" && value > selector.value.value) {

                            matches.push(node);

                            if (selector.subject) {
                                subject.push([node]);
                            }
                        }
                    });
                    break;

                case "type":
                    visitPre(ast, function (node) {
                        var test = typeof getPath(node, selector.name) === selector.value.value;
                        if (selector.operator === "=" && test ||
                                selector.operator === "!=" && !test) {

                            matches.push(node);

                            if (selector.subject) {
                                subject.push([node]);
                            }
                        }
                    });
                    break;

                case "regexp":
                    visitPre(ast, function (node) {
                        var test = selector.value.value.test(getPath(node, selector.name));
                        if (selector.operator === "=" && test ||
                                selector.operator === "!=" && !test) {

                            matches.push(node);

                            if (selector.subject) {
                                subject.push([node]);
                            }
                        }
                    });
                    break;
                }
                break;

            case "field":
                visitPre(ast, function (node, path) {
                    if (path) {
                        var i = path.indexOf(selector.name);
                        if (i > -1 && i === path.length - selector.name.length) {
                            matches.push(node);

                            if (selector.subject) {
                                subject.push([node]);
                            }
                        }
                    }
                });
                break;


            case "matches":
                selector.selectors.forEach(function (matchesSelector) {
                    finalMatches(match(ast, matchesSelector)).forEach(function (node) {
                        matches.push(node);

                        if (selector.subject) {
                            subject.push([node]);
                        }
                    });
                });
                break;

            case "not":
                rightResults = [];
                selector.selectors.forEach(function (selector) {
                    rightResults = rightResults.concat(finalMatches(match(ast, selector)));
                });

                visitPre(ast, function (node) {
                    if (rightResults.indexOf(node) < 0) {
                        matches.push(node);

                        if (selector.subject) {
                            subject.push([node]);
                        }
                    }
                });
                break;

            case "compound":
                rightResults = [];
                selector.selectors.forEach(function (selector) {
                    rightResults.push(finalMatches(match(ast, selector)));
                });

                var isSubject = selector.subject || selector.selectors.some(function (selector) {
                    return selector.subject;
                });

                rightResults[0].forEach(function (node) {
                    var i;
                    for (i = 1; i < rightResults.length; i++) {
                        if (rightResults[i].indexOf(node) > -1) {
                            matches.push(node);

                            if (isSubject) {
                                subject.push([node]);
                            }
                        }
                    }
                });
                break;

            case "descendant":
                leftResults = match(ast, selector.left);
                rightResults = match(ast, selector.right)

                leftResults.matches.forEach(function (leftNode, leftI) {
                    visitPre(leftNode, function (rightNode) {
                        var rightI = rightResults.matches.indexOf(rightNode);
                        if (rightI > -1) {
                            matches.push(rightNode);

                            var newSubject = [];
                            if (leftResults.subject[leftI]) {
                                newSubject = leftResults.subject[leftI];
                            }

                            if (rightResults.subject[rightI]) {
                                newSubject = newSubject.concat(rightResults.subject[rightI]);
                            }

                            if (newSubject.length > 0) {
                                subject.push(newSubject);
                            }
                        }
                    });
                });
                break;

            case "child":
                leftResults = match(ast, selector.left);
                rightResults = match(ast, selector.right);

                leftResults.matches.forEach(function (leftNode, leftI) {
                    visitChildren(leftNode, function (rightNode) {
                        var rightI = rightResults.matches.indexOf(rightNode);
                        if (rightI > -1) {
                            matches.push(rightNode);

                            var newSubject = [];
                            if (leftResults.subject[leftI]) {
                                newSubject = leftResults.subject[leftI];
                            }

                            if (rightResults.subject[rightI]) {
                                newSubject = newSubject.concat(rightResults.subject[rightI]);
                            }

                            if (newSubject.length > 0) {
                                subject.push(newSubject);
                            }
                        }
                    });
                });
                break;

            case "sibling":
                leftResults = match(ast, selector.left);
                rightResults = match(ast, selector.right);

                visitPre(ast, function (node, context) {
                    Object.keys(node).forEach(function (key) {
                        if (node[key] && node[key].forEach) {
                            var i, j;
                            for (i = 0; i < node[key].length; i++) {
                                var leftI = leftResults.matches.indexOf(node[key][i]);
                                if (leftI > -1) {
                                    for (j = i + 1; j < node[key].length; j++) {
                                        var rightI = rightResults.matches.indexOf(node[key][j]);
                                        if (rightI > -1) {
                                            matches.push(node[key][j]);

                                            var newSubject = [];
                                            if (leftResults.subject[leftI]) {
                                                newSubject = leftResults.subject[leftI];
                                            }

                                            if (rightResults.subject[rightI]) {
                                                newSubject = newSubject.concat(rightResults.subject[rightI]);
                                            }

                                            if (newSubject.length > 0) {
                                                subject.push(newSubject);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
                break;

            case "adjacent":
                leftResults = match(ast, selector.left);
                rightResults = match(ast, selector.right);

                visitPre(ast, function (node, context) {
                    Object.keys(node).forEach(function (key) {
                        if (node[key] && node[key].forEach) {
                            var i;
                            for (i = 0; i < node[key].length - 1; i++) {
                                var leftI = leftResults.matches.indexOf(node[key][i]);
                                if (leftI > -1) {
                                    var rightI = rightResults.matches.indexOf(node[key][i + 1]);
                                    if (rightI > -1) {
                                        matches.push(node[key][i + 1]);

                                            var newSubject = [];
                                            if (leftResults.subject[leftI]) {
                                                newSubject = leftResults.subject[leftI];
                                            }

                                            if (rightResults.subject[rightI]) {
                                                newSubject = newSubject.concat(rightResults.subject[rightI]);
                                            }

                                            if (newSubject.length > 0) {
                                                subject.push(newSubject);
                                            }
                                    }
                                }
                            }
                        }
                    });
                });
                break;
            }   

            return results;
        }

        /**
         * Parse a selector string and return it's AST.
         */
        function parse(selector) {
            return processTokens(tokenize(selector));
        }
        
        /**
         * Query the code AST using the selector string.
         */
        function query(ast, selector) {
            return finalMatches(match(ast, parse(selector)));
        }

        query.tokenize = tokenize;
        query.processTokens = processTokens;
        query.parse = parse;
        query.match = match;
        query.finalMatches = finalMatches;
        return query;
    }


    if (typeof define === "function" && define.amd) {
        define(esqueryModule);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = esqueryModule();
    } else {
        this.esquery = esqueryModule();
    }

})();
