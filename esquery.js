(function () {


	function parse(selector) {
		return processTokens(tokenize(selector));
	}

	function tokenize(selector) {
    	var tokens = selector.split(/\s*?(\s|\*|~|<=|>=|<|>|=|:|\+|\[|\]|\(|\))/);

    	tokens = tokens.filter(function (token) {
    		return token;
    	});

    	tokens = tokens.map(function (token) {
    		if (token === "*") {
    			return {
    				type: "wildcard"
    			};
    		} else if (/first\-child|nth\-child|last\-child|calc|length/.test(token)) {
    			return {
    				type: "keyword",
    				value: token
    			};
    		} else if (/".*"/.test(token)) {
    			return {
    				type: "string",
    				value: token.replace(/^"|"$/g, "")
    			};
    		} else if (/[+\-]?[0-9]*.?[0-9]+/.test(token)) {
    			return {
    				type: "number",
    				value: parseFloat(token)
    			};
    		} else if (/~|<=|>=|<|>|=|:|\+|\[|\]|\(|\)|\s/.test(token)) {
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

	function findToken(tokens, token, i) {
		for (; i < tokens.length; i++) {
			if (tokens[i].type === token.type && tokens[i].value === token.value) {
				break;
			}
		}
		return i;
	}

	function processTokens(tokens) {
		var ast;
		while (tokens.length > 0) {
			ast = parseSelector(tokens, ast);
		}
		return ast;
	}

	var operatorMap = {
		" ": "descendant",
		">": "child",
		"~": "sibling",
		"+": "adjacent"
	}

	function parseSelector(tokens, ast) {
		var token = tokens.shift();
		if (token.type === "wildcard" && !ast) {
			return token;
		} else if (token.type === "identifier" && !ast) {
			return token;
		} else if (token.type === "operator" && tokens.length > 0) {
			if (/[\s>~+]/.test(token.value)) {
				return {
					type: operatorMap[token.value],
					left: ast,
					right: parseSelector(tokens)
				};
			} else if (token.value === ":") {
				var pseudo = parsePseudo(tokens, ast);
				return ast ? {
					type: "and",
					left: ast,
					right: pseudo
				} : pseudo;
			} else if (token.value === "[") {
				var attribute = parseAttribute(tokens, ast);
				return ast ? {
					type: "and",
					left: ast,
					right: attribute
				} : attribute;
			}
		} else {
			throw createError("Unexpected token: ", token, tokens, ast);
		}
	}

	function parsePseudo(tokens, ast) {
		var token = tokens.shift();
		if (token.type === "keyword") {
			switch (token.value) {
			case "first-child":
				return {type: "nth-child", index: 0};
			case "nth-child":
				return {
					type: "nth-child",
					index: parseArgs(tokens, ast)
				};
			case "last-child":
				return {
					type: "nth-child",
					index: -1
				};
			default:
				throw createError("Unexpected keyword: ", token, tokens, ast);
			}
		} else {
			throw createError("Unexpected token in pseudo: ", token, tokens, ast);
		}
	}

	function parseAttribute(tokens, ast) {
		var token = tokens.shift();
		if (token.type === "identifier" && tokens.length > 1 && tokens[0].type === "operator") {
			ast = {
				type: "attribute",
				name: token.value,
				operator: tokens.shift().value,
				value: parseValue(tokens, ast)
			};

			token = tokens.shift();
			if (token.type !== "operator" || token.value !== "]") {
				throw createError("Unexpected token in attribute: ", token, tokens, ast);
			}

			return ast;
		} else {
			throw createError("Unexpected token in attribute: ", token, tokens, ast);
		}
	}

	function parseArgs(tokens, ast) {
		var token = tokens.shift();
		if (token.value === "(" && tokens.length > 1) {
			var literal = parseValue(tokens, ast);

			var paren = tokens.shift();
			if (paren.type !== "operator" || paren.value !== ")") {
				throw createError("Unexpected token in value: ", paren, tokens, ast);
			}

			return literal;
		} else {
			throw createError("Unexpected token in args: ", token, tokens, ast);
		}
	}

	function parseValue(tokens, ast) {
		var token = tokens.shift();
		if (token.type === "number" || token.type === "string") {
			return {
				type: "literal",
				value: token.value
			};
		} else {
			throw createError("Unexpected token for value: ", token, tokens, ast);
		}
	}

	function createError(message, token, tokens, ast) {
		return new Error(message + JSON.stringify(token) + ", " + JSON.stringify(tokens) +
				", " + JSON.stringify(ast));
	}

	function visitPre(ast, fn, context) {
		var newContext = fn(ast, context);
		context = context || newContext;

		var key;
		for (key in ast) {
			if (ast[key] && ast[key].forEach) {
				ast[key].forEach(function (node) {
					visitPre(node, fn, context);
				});
			} else if (ast[key] && ast[key].type) {
				visitPre(ast[key], fn, context);
			}
		}
	}

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

	function match(ast, selector) {
		var leftMatches, rightMatches, matches = [];

		switch (selector.type) {
		case "wildcard":
			visitPre(ast, matches.push.bind(matches));
			break;

		case "identifier":
			visitPre(ast, function (node) {
				if (node.type === selector.value) {
					matches.push(node);
				}
			});
			break;

		case "descendant":
			leftMatches = match(ast, selector.left);
			rightMatches = match(ast, selector.right);

			visitPre(ast, function (node, context) {
				if (context && rightMatches.indexOf(node) > -1) {
					matches.push(node);
				}

				if (leftMatches.indexOf(node) > -1) {
					return true;
				}
			});

			break;

		case "and":
			leftMatches = match(ast, selector.left);
			rightMatches = match(ast, selector.right);

			matches = leftMatches.filter(function (leftNode) {
				return rightMatches.indexOf(leftNode) > -1;
			});
			break;

		case "attribute":
			visitPre(ast, function (node) {
				switch (selector.value.type) {
				case "literal":
					if (getPath(node, selector.name) === selector.value.value) {
						matches.push(node);
					}
					break;
				}
			});
			break;
		}

		return matches;
	}
	
    function query(ast, selector) {
    	return match(ast, parse(selector));
    }

    this.esquery = query;
})();
