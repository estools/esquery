/* vim: set sw=4 sts=4 : */
import estraverse from 'estraverse';
import parser from './parser.js';

/**
* @typedef {"LEFT_SIDE"|"RIGHT_SIDE"} Side
*/

const LEFT_SIDE = 'LEFT_SIDE';
const RIGHT_SIDE = 'RIGHT_SIDE';

/**
 * @external AST
 * @see https://esprima.readthedocs.io/en/latest/syntax-tree-format.html
 */

/**
 * One of the rules of `grammar.pegjs`
 * @typedef {PlainObject} SelectorAST
 * @see grammar.pegjs
*/

/**
 * The `sequence` production of `grammar.pegjs`
 * @typedef {PlainObject} SelectorSequenceAST
*/

/**
 * Get the value of a property which may be multiple levels down
 * in the object.
 * @param {?PlainObject} obj
 * @param {string[]} keys
 * @returns {undefined|boolean|string|number|external:AST}
 */
function getPath(obj, keys) {
    for (let i = 0; i < keys.length; ++i) {
        if (obj == null) { return obj; }
        obj = obj[keys[i]];
    }
    return obj;
}

/**
 * Determine whether `node` can be reached by following `path`,
 * starting at `ancestor`.
 * @param {?external:AST} node
 * @param {?external:AST} ancestor
 * @param {string[]} path
 * @param {Integer} fromPathIndex
 * @returns {boolean}
 */
function inPath(node, ancestor, path, fromPathIndex) {
    let current = ancestor;
    for (let i = fromPathIndex; i < path.length; ++i) {
        if (current == null) {
            return false;
        }
        const field = current[path[i]];
        if (Array.isArray(field)) {
            for (let k = 0; k < field.length; ++k) {
                if (inPath(node, field[k], path, i + 1)) {
                    return true;
                }
            }
            return false;
        }
        current = field;
    }
    return node === current;
}

/**
 * A generated matcher function for a selector.
 * @callback SelectorMatcher
 * @param {?SelectorAST} selector
 * @param {external:AST[]} [ancestry=[]]
 * @param {ESQueryOptions} [options]
 * @returns {void}
*/

/**
 * A WeakMap for holding cached matcher functions for selectors.
 * @type {WeakMap<SelectorAST, SelectorMatcher>}
*/
const MATCHER_CACHE = typeof WeakMap === 'function' ? new WeakMap : null;

/**
 * Look up a matcher function for `selector` in the cache.
 * If it does not exist, generate it with `generateMatcher` and add it to the cache.
 * In engines without WeakMap, the caching is skipped and matchers are generated with every call.
 * @param {?SelectorAST} selector
 * @returns {SelectorMatcher}
 */
function getMatcher(selector) {
    if (selector == null) {
        return () => true;
    }

    if (MATCHER_CACHE != null) {
        let matcher = MATCHER_CACHE.get(selector);
        if (matcher != null) {
            return matcher;
        }
        matcher = generateMatcher(selector);
        MATCHER_CACHE.set(selector, matcher);
        return matcher;
    }

    return generateMatcher(selector);
}

/**
 * Create a matcher function for `selector`,
 * @param {?SelectorAST} selector
 * @returns {SelectorMatcher}
 */
function generateMatcher(selector) {
    switch(selector.type) {
        case 'wildcard':
            return () => true;

        case 'identifier': {
            const value = selector.value.toLowerCase();
            return (node, ancestry, options) => {
                const nodeTypeKey = (options && options.nodeTypeKey) || 'type';
                return value === node[nodeTypeKey].toLowerCase();
            };
        }

        case 'exactNode':
            return (node, ancestry) => {
                return ancestry.length === 0;
            };

        case 'field': {
            const path = selector.name.split('.');
            return (node, ancestry) => {
                const ancestor = ancestry[path.length - 1];
                return inPath(node, ancestor, path, 0);
            };
        }

        case 'matches': {
            const matchers = selector.selectors.map(getMatcher);
            return (node, ancestry, options) => {
                for (let i = 0; i < matchers.length; ++i) {
                    if (matchers[i](node, ancestry, options)) { return true; }
                }
                return false;
            };
        }

        case 'compound': {
            const matchers = selector.selectors.map(getMatcher);
            return (node, ancestry, options) => {
                for (let i = 0; i < matchers.length; ++i) {
                    if (!matchers[i](node, ancestry, options)) { return false; }
                }
                return true;
            };
        }

        case 'not': {
            const matchers = selector.selectors.map(getMatcher);
            return (node, ancestry, options) => {
                for (let i = 0; i < matchers.length; ++i) {
                    if (matchers[i](node, ancestry, options)) { return false; }
                }
                return true;
            };
        }

        case 'has': {
            const matchers = selector.selectors.map(getMatcher);
            return (node, ancestry, options) => {
                let result = false;

                const a = [];
                estraverse.traverse(node, {
                    enter (node, parent) {
                        if (parent != null) { a.unshift(parent); }

                        for (let i = 0; i < matchers.length; ++i) {
                            if (matchers[i](node, a, options)) {
                                result = true;
                                this.break();
                                return;
                            }
                        }
                    },
                    leave () { a.shift(); },
                    keys: options && options.visitorKeys,
                    fallback: options && options.fallback || 'iteration'
                });

                return result;
            };
        }

        case 'child': {
            const left = getMatcher(selector.left);
            const right = getMatcher(selector.right);
            return (node, ancestry, options) => {
                if (ancestry.length > 0 && right(node, ancestry, options)) {
                    return left(ancestry[0], ancestry.slice(1), options);
                }
                return false;
            };
        }

        case 'descendant': {
            const left = getMatcher(selector.left);
            const right = getMatcher(selector.right);
            return (node, ancestry, options) => {
                if (right(node, ancestry, options)) {
                    for (let i = 0, l = ancestry.length; i < l; ++i) {
                        if (left(ancestry[i], ancestry.slice(i + 1), options)) {
                            return true;
                        }
                    }
                }
                return false;
            };
        }

        case 'attribute': {
            const path = selector.name.split('.');
            switch (selector.operator) {
                case void 0:
                    return (node) => getPath(node, path) != null;
                case '=':
                    switch (selector.value.type) {
                        case 'regexp':
                            return (node) => {
                                const p = getPath(node, path);
                                return typeof p === 'string' && selector.value.value.test(p);
                            };
                        case 'literal': {
                            const literal = `${selector.value.value}`;
                            return (node) => literal === `${getPath(node, path)}`;
                        }
                        case 'type':
                            return (node) => selector.value.value === typeof getPath(node, path);
                    }
                    throw new Error(`Unknown selector value type: ${selector.value.type}`);
                case '!=':
                    switch (selector.value.type) {
                        case 'regexp':
                            return (node) => !selector.value.value.test(getPath(node, path));
                        case 'literal': {
                            const literal = `${selector.value.value}`;
                            return (node) => literal !== `${getPath(node, path)}`;
                        }
                        case 'type':
                            return (node) => selector.value.value !== typeof getPath(node, path);
                    }
                    throw new Error(`Unknown selector value type: ${selector.value.type}`);
                case '<=':
                    return (node) => getPath(node, path) <= selector.value.value;
                case '<':
                    return (node) => getPath(node, path) < selector.value.value;
                case '>':
                    return (node) => getPath(node, path) > selector.value.value;
                case '>=':
                    return (node) => getPath(node, path) >= selector.value.value;
            }
            throw new Error(`Unknown operator: ${selector.operator}`);
        }

        case 'sibling': {
            const left = getMatcher(selector.left);
            const right = getMatcher(selector.right);
            return (node, ancestry, options) =>
                right(node, ancestry, options) &&
                    sibling(node, left, ancestry, LEFT_SIDE, options) ||
                    selector.left.subject &&
                    left(node, ancestry, options) &&
                    sibling(node, right, ancestry, RIGHT_SIDE, options);
        }

        case 'adjacent': {
            const left = getMatcher(selector.left);
            const right = getMatcher(selector.right);
            return (node, ancestry, options) =>
                right(node, ancestry, options) &&
                    adjacent(node, left, ancestry, LEFT_SIDE, options) ||
                    selector.right.subject &&
                    left(node, ancestry, options) &&
                    adjacent(node, right, ancestry, RIGHT_SIDE, options);
        }

        case 'nth-child': {
            const nth = selector.index.value;
            const right = getMatcher(selector.right);
            return (node, ancestry, options) =>
                right(node, ancestry, options) &&
                    nthChild(node, ancestry, nth, options);
        }

        case 'nth-last-child': {
            const nth = -selector.index.value;
            const right = getMatcher(selector.right);
            return (node, ancestry, options) =>
                right(node, ancestry, options) &&
                    nthChild(node, ancestry, nth, options);
        }

        case 'class': {
            
            const name = selector.name.toLowerCase();

            return (node, ancestry, options) => {
                
                if (options && options.matchClass) {
                    return options.matchClass(selector.name, node, ancestry);
                }
                
                if (options && options.nodeTypeKey) return false;    

                switch(name){
                    case 'statement':
                        if(node.type.slice(-9) === 'Statement') return true;
                        // fallthrough: interface Declaration <: Statement { }
                    case 'declaration':
                        return node.type.slice(-11) === 'Declaration';
                    case 'pattern':
                        if(node.type.slice(-7) === 'Pattern') return true;
                        // fallthrough: interface Expression <: Node, Pattern { }
                    case 'expression':
                        return node.type.slice(-10) === 'Expression' ||
                            node.type.slice(-7) === 'Literal' ||
                            (
                                node.type === 'Identifier' &&
                                (ancestry.length === 0 || ancestry[0].type !== 'MetaProperty')
                            ) ||
                            node.type === 'MetaProperty';
                    case 'function':
                        return node.type === 'FunctionDeclaration' ||
                            node.type === 'FunctionExpression' ||
                            node.type === 'ArrowFunctionExpression';
                }
                throw new Error(`Unknown class name: ${selector.name}`);
            };
        }
    }

    throw new Error(`Unknown selector type: ${selector.type}`);
}

/**
 * @callback TraverseOptionFallback
 * @param {external:AST} node The given node.
 * @returns {string[]} An array of visitor keys for the given node.
 */

/**
 * @callback ClassMatcher
 * @param {string} className The name of the class to match.
 * @param {external:AST} node The node to match against.
 * @param {Array<external:AST>} ancestry The ancestry of the node.
 * @returns {boolean} True if the node matches the class, false if not.
 */

/**
 * @typedef {object} ESQueryOptions
 * @property {string} [nodeTypeKey="type"] By passing `nodeTypeKey`, we can allow other ASTs to use ESQuery.
 * @property { { [nodeType: string]: string[] } } [visitorKeys] By passing `visitorKeys` mapping, we can extend the properties of the nodes that traverse the node.
 * @property {TraverseOptionFallback} [fallback] By passing `fallback` option, we can control the properties of traversing nodes when encountering unknown nodes.
 * @property {ClassMatcher} [matchClass] By passing `matchClass` option, we can customize the interpretation of classes.
 */

/**
 * Given a `node` and its ancestors, determine if `node` is matched
 * by `selector`.
 * @param {?external:AST} node
 * @param {?SelectorAST} selector
 * @param {external:AST[]} [ancestry=[]]
 * @param {ESQueryOptions} [options]
 * @throws {Error} Unknowns (operator, class name, selector type, or
 * selector value type)
 * @returns {boolean}
 */
function matches(node, selector, ancestry, options) {
    if (!selector) { return true; }
    if (!node) { return false; }
    if (!ancestry) { ancestry = []; }

    return getMatcher(selector)(node, ancestry, options);
}

/**
 * Get visitor keys of a given node.
 * @param {external:AST} node The AST node to get keys.
 * @param {ESQueryOptions|undefined} options
 * @returns {string[]} Visitor keys of the node.
 */
function getVisitorKeys(node, options) {
    const nodeTypeKey = (options && options.nodeTypeKey) || 'type';

    const nodeType = node[nodeTypeKey];
    if (options && options.visitorKeys && options.visitorKeys[nodeType]) {
        return options.visitorKeys[nodeType];
    }
    if (estraverse.VisitorKeys[nodeType]) {
        return estraverse.VisitorKeys[nodeType];
    }
    if (options && typeof options.fallback === 'function') {
        return options.fallback(node);
    }
    // 'iteration' fallback
    return Object.keys(node).filter(function (key) {
        return key !== nodeTypeKey;
    });
}


/**
 * Check whether the given value is an ASTNode or not.
 * @param {any} node The value to check.
 * @param {ESQueryOptions|undefined} options The options to use.
 * @returns {boolean} `true` if the value is an ASTNode.
 */
function isNode(node, options) {
    const nodeTypeKey = (options && options.nodeTypeKey) || 'type';
    return node !== null && typeof node === 'object' && typeof node[nodeTypeKey] === 'string';
}

/**
 * Determines if the given node has a sibling that matches the
 * given selector matcher.
 * @param {external:AST} node
 * @param {SelectorMatcher} matcher
 * @param {external:AST[]} ancestry
 * @param {Side} side
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function sibling(node, matcher, ancestry, side, options) {
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (let i = 0; i < keys.length; ++i) {
        const listProp = parent[keys[i]];
        if (Array.isArray(listProp)) {
            const startIndex = listProp.indexOf(node);
            if (startIndex < 0) { continue; }
            let lowerBound, upperBound;
            if (side === LEFT_SIDE) {
                lowerBound = 0;
                upperBound = startIndex;
            } else {
                lowerBound = startIndex + 1;
                upperBound = listProp.length;
            }
            for (let k = lowerBound; k < upperBound; ++k) {
                if (isNode(listProp[k], options) && matcher(listProp[k], ancestry, options)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Determines if the given node has an adjacent sibling that matches
 * the given selector matcher.
 * @param {external:AST} node
 * @param {SelectorMatcher} matcher
 * @param {external:AST[]} ancestry
 * @param {Side} side
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function adjacent(node, matcher, ancestry, side, options) {
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (let i = 0; i < keys.length; ++i) {
        const listProp = parent[keys[i]];
        if (Array.isArray(listProp)) {
            const idx = listProp.indexOf(node);
            if (idx < 0) { continue; }
            if (side === LEFT_SIDE && idx > 0 && isNode(listProp[idx - 1], options) && matcher(listProp[idx - 1], ancestry, options)) {
                return true;
            }
            if (side === RIGHT_SIDE && idx < listProp.length - 1 && isNode(listProp[idx + 1], options) &&  matcher(listProp[idx + 1], ancestry, options)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Determines if the given node is the `nth` child.
 * If `nth` is negative then the position is counted
 * from the end of the list of children.
 * @param {external:AST} node
 * @param {external:AST[]} ancestry
 * @param {Integer} nth
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function nthChild(node, ancestry, nth, options) {
    if (nth === 0) { return false; }
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (let i = 0; i < keys.length; ++i) {
        const listProp = parent[keys[i]];
        if (Array.isArray(listProp)){
            const idx = nth < 0 ? listProp.length + nth : nth - 1;
            if (idx >= 0 && idx < listProp.length && listProp[idx] === node) {
                return true;
            }
        }
    }
    return false;
}

/**
 * For each selector node marked as a subject, find the portion of the
 * selector that the subject must match.
 * @param {SelectorAST} selector
 * @param {SelectorAST} [ancestor] Defaults to `selector`
 * @returns {SelectorAST[]}
 */
function subjects(selector, ancestor) {
    if (selector == null || typeof selector != 'object') { return []; }
    if (ancestor == null) { ancestor = selector; }
    const results = selector.subject ? [ancestor] : [];
    const keys = Object.keys(selector);
    for (let i = 0; i < keys.length; ++i) {
        const p = keys[i];
        const sel = selector[p];
        results.push(...subjects(sel, p === 'left' ? sel : ancestor));
    }
    return results;
}

/**
* @callback TraverseVisitor
* @param {?external:AST} node
* @param {?external:AST} parent
* @param {external:AST[]} ancestry
*/

/**
 * From a JS AST and a selector AST, collect all JS AST nodes that
 * match the selector.
 * @param {external:AST} ast
 * @param {?SelectorAST} selector
 * @param {TraverseVisitor} visitor
 * @param {ESQueryOptions} [options]
 * @returns {external:AST[]}
 */
function traverse(ast, selector, visitor, options) {
    if (!selector) { return; }
    const ancestry = [];
    const matcher = getMatcher(selector);
    const altSubjects = subjects(selector).map(getMatcher);
    estraverse.traverse(ast, {
        enter (node, parent) {
            if (parent != null) { ancestry.unshift(parent); }
            if (matcher(node, ancestry, options)) {
                if (altSubjects.length) {
                    for (let i = 0, l = altSubjects.length; i < l; ++i) {
                        if (altSubjects[i](node, ancestry, options)) {
                            visitor(node, parent, ancestry);
                        }
                        for (let k = 0, m = ancestry.length; k < m; ++k) {
                            const succeedingAncestry = ancestry.slice(k + 1);
                            if (altSubjects[i](ancestry[k], succeedingAncestry, options)) {
                                visitor(ancestry[k], parent, succeedingAncestry);
                            }
                        }
                    }
                } else {
                    visitor(node, parent, ancestry);
                }
            }
        },
        leave () { ancestry.shift(); },
        keys: options && options.visitorKeys,
        fallback: options && options.fallback || 'iteration'
    });
}


/**
 * From a JS AST and a selector AST, collect all JS AST nodes that
 * match the selector.
 * @param {external:AST} ast
 * @param {?SelectorAST} selector
 * @param {ESQueryOptions} [options]
 * @returns {external:AST[]}
 */
function match(ast, selector, options) {
    const results = [];
    traverse(ast, selector, function (node) {
        results.push(node);
    }, options);
    return results;
}

/**
 * Parse a selector string and return its AST.
 * @param {string} selector
 * @returns {SelectorAST}
 */
function parse(selector) {
    return parser.parse(selector);
}

/**
 * Query the code AST using the selector string.
 * @param {external:AST} ast
 * @param {string} selector
 * @param {ESQueryOptions} [options]
 * @returns {external:AST[]}
 */
function query(ast, selector, options) {
    return match(ast, parse(selector), options);
}

query.parse = parse;
query.match = match;
query.traverse = traverse;
query.matches = matches;
query.query = query;

export default query;
