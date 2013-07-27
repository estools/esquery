(function () {

	function esqueryModule() {

		/**
		 * Tokenize a selector string into an array of tokens. Tokens
		 * contain a type and value field.
		 */
		function tokenize(selector) {
			selector = selector.replace(/^\s*|\s*$/g, "");
	    	var tokens = selector.split(/\s*(\/(?:\\\/|[^\/])*\/)\s*|([+\-]?[0-9]*\.?[0-9]+)|(:)|("(?:\\\"|[^"])*")|(\[)\s*|\s*(\]|\))|\s*(!=|<=|>=|\,|\*|~|<|>|=|!|\+|\||\(|\s)\s*/);

	    	tokens = tokens.filter(function (token) {
	    		return token;
	    	});

	    	tokens = tokens.map(function (token) {
	    		if (token === "*") {
	    			return {
	    				type: "wildcard",
	    				value: "*"
	    			};
	    		} else if (/type|not|matches|first\-child|nth\-child|nth\-last\-child|last\-child|length/.test(token)) {
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
	    		} else if (/\/.*\//.test(token)) {
	    			return {
	    				type: "regexp",
	    				value: token.replace(/^\/|\/$/g, "").replace(/\\\//g, "/")
	    			};
	    		} else if (/!=|<=|>=|<|>|,|~|=|!|:|\+|\[|\]|\(|\)|\s/.test(token)) {
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
			var result, ast;
			while (tokens.length > 0) {
				ast = consumeSelector(tokens, ast);
				if (tokens.length > 0) {
					var peek = tokens[0];
					if (peek.type === "operator" && peek.value === ",") {
						tokens.shift();
						if (!result) {
							result = {
								type: "matches",
								selectors: [ast]
							};
						} else {
							result.selectors.push(ast);
						}
						ast = undefined;
					}
				} else if (ast && result) {
					result.selectors.push(ast);
				}
			}
			return result || ast;
		}

		var operatorMap = {
			" ": "descendant",
			">": "child",
			"~": "sibling",
			"+": "adjacent"
		};

		/**
		 * Core token processor
		 */
		function consumeSelector(tokens, ast) {
			var token = tokens.shift();
			if (token.type === "wildcard" && !ast) {
				return token;
			} else if (token.type === "identifier" && !ast) {
				return token;
			} else if (token.type === "operator" && tokens.length > 0) {
				if (/[\s>~+]/.test(token.value)) {
					var selector = consumeSelector(tokens);
					return ast ? {
						type: operatorMap[token.value],
						left: ast,
						right: selector
					} : selector;
				} else if (token.value === ":") {
					var pseudo = consumePseudo(tokens);
					return ast ? {
						type: "and",
						left: ast,
						right: pseudo
					} : pseudo;
				} else if (token.value === "[") {
					var attribute = consumeAttribute(tokens);
					return ast ? {
						type: "and",
						left: ast,
						right: attribute
					} : attribute;
				} else {
					throw createError("Unexpected token: ", token, tokens, ast);
				}
			} else {
				throw createError("Unexpected token: ", token, tokens, ast);
			}
		}

		/**
		 * Consume the various types of pseudo selectors (:*-child).
		 */
		function consumePseudo(tokens, ast) {
			var token = tokens.shift();
			if (token.type === "keyword") {
				switch (token.value) {
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
						index: consumeArgs(tokens, ast)
					};
				case "nth-last-child":
					return {
						type: "nth-last-child",
						index: consumeArgs(tokens, ast)
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
						selectors: consumeArgList(tokens, ast)
					};
				case "not":
					return {
						type: "not",
						selectors: consumeArgList(tokens, ast)
					};
				default:
					throw createError("Unexpected keyword: ", token, tokens, ast);
				}
			} else {
				throw createError("Unexpected token in pseudo: ", token, tokens, ast);
			}
		}

		/**
		 * Consume an attribute selector ([])
		 */
		function consumeAttribute(tokens, ast) {
			var token = tokens.shift();
			if (token.type === "identifier" || token.type === "keyword" && tokens.length > 0) {
				var op = tokens.shift();
				if (op.type === "operator") {
					if (op.value === "]") {
						return {
							type: "attribute",
							name: token.value
						};
					} else {
						ast = {
							type: "attribute",
							name: token.value,
							operator: op.value,
							value: consumeValue(tokens, ast)
						};

						token = tokens.shift();
						if (token.type !== "operator" || token.value !== "]") {
							throw createError("Unexpected token in attribute: ", token, tokens, ast);
						}

						return ast;
					}
				} else {
					throw createError("Unexpected token in attribute: ", op, tokens, ast);
				}
			} else {
				throw createError("Unexpected token in attribute: ", token, tokens, ast);
			}
		}

		function consumeArgList(tokens, ast) {
			var arg, token = tokens.shift();
			if (token.type === "operator" && token.value === "(" && tokens.length > 1) {
				
				var result = [];

				while (tokens.length > 0 && (token.type !== "operator" || token.value !== ")")) {
					arg = consumeSelector(tokens, arg);
					if (tokens.length > 0) {
						token = tokens[0];
						if (token.type === "operator" && token.value === ",") {
							tokens.shift();
						}
					}
					if (arg) {
						result.push(arg);
						arg = undefined;
					}
				}

				tokens.shift();
				if (token.type !== "operator" || token.value !== ")") {
					throw createError("Unexpected token in argument list: ", paren, tokens, ast);
				}

				return result;
			} else {
				throw createError("Unexpected token in argument list: ", token, tokens, ast);
			}
		}

		/**
		 * Consume operator argumetns inside parens
		 */
		function consumeArgs(tokens, ast) {
			var token = tokens.shift();
			if (token.value === "(" && tokens.length > 1) {
				var literal = consumeValue(tokens, ast);

				var paren = tokens.shift();
				if (paren.type !== "operator" || paren.value !== ")") {
					throw createError("Unexpected token in value: ", paren, tokens, ast);
				}

				return literal;
			} else {
				throw createError("Unexpected token in args: ", token, tokens, ast);
			}
		}

		/**
		 * Consume values (literals and computed values)
		 */
		function consumeValue(tokens, ast) {
			var token = tokens.shift();
			if (token.type === "number" || token.type === "string") {
				return {
					type: "literal",
					value: token.value
				};
			} else if (token.type === "regexp") {
				return {
					type: "regexp",
					value: new RegExp(token.value)
				};
			} else if (token.type === "keyword" && token.value === "type" && tokens.length > 2 &&
					tokens[0].type === "operator" && tokens[0].value === "(") {
				return {
					type: "type",
					value: consumeArgs(tokens, ast).value
				};
			} else if (token.type === "keyword" || token.type === "identifier") {
				return {
					type: "literal",
					value: token.value
				};
			} else {
				throw createError("Unexpected token for value: ", token, tokens, ast);
			}
		}

		/**
		 * Create an error object with the supplied information.
		 */
		function createError(message, token, tokens, ast) {
			return new Error(message + JSON.stringify(token) + "\n" +
					"Remaining tokens: " + JSON.stringify(tokens, null, "  ") + "\n" +
					"Current ast: " + JSON.stringify(ast, null, "  "));
		}

		/**
		 * Walk the ECMAScript AST with a pre-order traversal. If the callback function
		 * returns something, then that will be passed to the subtree node visits.
		 */
		function visitPre(ast, fn, context) {
			var newContext = fn(ast, context);
			context = newContext !== undefined ? newContext : context;

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
		 * This is the core match method. It takes the code AST and the selector AST
		 * and returns the matching nodes of the code.
		 */
		function match(ast, selector) {
			if (!selector) {
				return [];
			}

			var leftMatches, rightMatches, matches = [];

			switch (selector.type) {
			case "wildcard":
				visitPre(ast, function (node) {
					matches.push(node);
				});
				break;

			case "identifier":
				visitPre(ast, function (node) {
					if (node.type === selector.value) {
						matches.push(node);
					}
				});
				break;

			case "not":
				leftMatches = match(ast, {type: "wildcard"});
				rightMatches = [];
				selector.selectors.forEach(function (selector) {
					rightMatches = rightMatches.concat(match(ast, selector));
				});

				matches = leftMatches.filter(function (leftNode) {
					return rightMatches.indexOf(leftNode) < 0;
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

			case "child":
				leftMatches = match(ast, selector.left);
				rightMatches = match(ast, selector.right);

				visitPre(ast, function (node, context) {
					if (context > 0 && rightMatches.indexOf(node) > -1) {
						matches.push(node);
					}

					return leftMatches.indexOf(node) > -1 ? 1 : 0;
				});

				break;

			case "sibling":
				leftMatches = match(ast, selector.left);
				rightMatches = match(ast, selector.right);

				visitPre(ast, function (node, context) {
					Object.keys(node).forEach(function (key) {
						if (node[key] && node[key].forEach) {
							var i, j;
							for (i = 0; i < node[key].length; i++) {
								if (leftMatches.indexOf(node[key][i]) > -1) {
									for (j = i + 1; j < node[key].length; j++) {
										if (rightMatches.indexOf(node[key][j]) > -1) {
											matches.push(node[key][j]);
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
				leftMatches = match(ast, selector.left);
				rightMatches = match(ast, selector.right);

				visitPre(ast, function (node, context) {
					Object.keys(node).forEach(function (key) {
						if (node[key] && node[key].forEach) {
							var i;
							for (i = 0; i < node[key].length - 1; i++) {
								if (leftMatches.indexOf(node[key][i]) > -1) {
									if (rightMatches.indexOf(node[key][i + 1]) > -1) {
										matches.push(node[key][i + 1]);
									}
								}
							}
						}
					});
				});

				break;

			// nth-child is used for first/last-child and is a bit different from the css
			// nth-child. It is a zero based index where negative -1 means the last child,
			// -2 is the second to last, and so forth.
			case "nth-child":
				visitPre(ast, function (node, context) {
					var index = selector.index.value;
					Object.keys(node).forEach(function (key) {
						if (node[key] && node[key].forEach) {
							var len = node[key].length;
							if (index >= 0 && index < len) {
								matches.push(node[key][index]);
							} else if (index < 0 && len + index < len && len + index >= 0) {
								matches.push(node[key][len + index]);
							}
						}
					});
				});

				break;

			case "and":
				leftMatches = match(ast, selector.left);
				rightMatches = match(ast, selector.right);

				matches = leftMatches.filter(function (leftNode) {
					return rightMatches.indexOf(leftNode) > -1;
				});

				break;

			case "matches":
				selector.selectors.forEach(function (selector) {
					matches = matches.concat(match(ast, selector));
				});
				break;

			// attribute selector is also different from css, it allows use of regexp
			// and =, <, >, <=, >=, != comparisons
			case "attribute":
				switch (selector.value && selector.value.type || "literal") {
				case "literal":
					visitPre(ast, function (node) {
						var value = getPath(node, selector.name);
						if (!selector.operator && value !== undefined) {
							matches.push(node);
						} else if (selector.operator === "=" && value === selector.value.value) {
							matches.push(node);
						} else if (selector.operator === "!=" && value != selector.value.value) {
							matches.push(node);
						} else if (selector.operator === "<=" && value <= selector.value.value) {
							matches.push(node);
						} else if (selector.operator === ">=" && value >= selector.value.value) {
							matches.push(node);
						} else if (selector.operator === "<" && value < selector.value.value) {
							matches.push(node);
						} else if (selector.operator === ">" && value > selector.value.value) {
							matches.push(node);
						}
					});
					break;

				case "type":
					visitPre(ast, function (node) {
						var test = typeof getPath(node, selector.name) === selector.value.value;
						if (selector.operator === "=" && test) {
							matches.push(node);
						} else if (selector.operator === "!=" && !test) {
							matches.push(node);
						}
					});
					break;

				case "regexp":
					visitPre(ast, function (node) {
						var test = selector.value.value.test(getPath(node, selector.name));
						if (selector.operator === "=" && test) {
							matches.push(node);
						} else if (selector.operator === "!=" && !test) {
							matches.push(node);
						}
					});
					break;
				}
				
				break;
			}	

			return matches;
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
	    	return match(ast, parse(selector));
	    }

	    query.tokenize = tokenize;
	    query.processTokens = processTokens;
	    query.parse = parse;
	    query.match = match;
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
