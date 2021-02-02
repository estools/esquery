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
 * @param {string} key
 * @returns {undefined|boolean|string|number|external:AST}
 */
function getPath(obj, key) {
    const keys = key.split('.');
    for (const key of keys) {
        if (obj == null) { return obj; }
        obj = obj[key];
    }
    return obj;
}

/**
 * Determine whether `node` can be reached by following `path`,
 * starting at `ancestor`.
 * @param {?external:AST} node
 * @param {?external:AST} ancestor
 * @param {string[]} path
 * @returns {boolean}
 */
function inPath(node, ancestor, path) {
    if (path.length === 0) { return node === ancestor; }
    if (ancestor == null) { return false; }
    const field = ancestor[path[0]];
    const remainingPath = path.slice(1);
    if (Array.isArray(field)) {
        for (const component of field) {
            if (inPath(node, component, remainingPath)) { return true; }
        }
        return false;
    } else {
        return inPath(node, field, remainingPath);
    }
}

/**
 * @callback TraverseOptionFallback
 * @param {external:AST} node The given node.
 * @returns {string[]} An array of visitor keys for the given node.
 */
/**
 * @typedef {object} ESQueryOptions
 * @property { { [nodeType: string]: string[] } } [visitorKeys] By passing `visitorKeys` mapping, we can extend the properties of the nodes that traverse the node.
 * @property {TraverseOptionFallback} [fallback] By passing `fallback` option, we can control the properties of traversing nodes when encountering unknown nodes.
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

    switch(selector.type) {
        case 'wildcard':
            return true;

        case 'identifier':
            return selector.value.toLowerCase() === node.type.toLowerCase();

        case 'field': {
            const path = selector.name.split('.');
            const ancestor = ancestry[path.length - 1];
            return inPath(node, ancestor, path);

        }
        case 'matches':
            for (const sel of selector.selectors) {
                if (matches(node, sel, ancestry, options)) { return true; }
            }
            return false;

        case 'compound':
            for (const sel of selector.selectors) {
                if (!matches(node, sel, ancestry, options)) { return false; }
            }
            return true;

        case 'not':
            for (const sel of selector.selectors) {
                if (matches(node, sel, ancestry, options)) { return false; }
            }
            return true;

        case 'has': {
            const collector = [];
            for (const sel of selector.selectors) {
                const a = [];
                estraverse.traverse(node, {
                    enter (node, parent) {
                        if (parent != null) { a.unshift(parent); }
                        if (matches(node, sel, a, options)) {
                            collector.push(node);
                        }
                    },
                    leave () { a.shift(); },
                    keys: options && options.visitorKeys,
                    fallback: options && options.fallback || 'iteration'
                });
            }
            return collector.length !== 0;

        }
        case 'child':
            if (matches(node, selector.right, ancestry, options)) {
                return matches(ancestry[0], selector.left, ancestry.slice(1), options);
            }
            return false;

        case 'descendant':
            if (matches(node, selector.right, ancestry, options)) {
                for (let i = 0, l = ancestry.length; i < l; ++i) {
                    if (matches(ancestry[i], selector.left, ancestry.slice(i + 1), options)) {
                        return true;
                    }
                }
            }
            return false;

        case 'attribute': {
            const p = getPath(node, selector.name);
            switch (selector.operator) {
                case void 0:
                    return p != null;
                case '=':
                    switch (selector.value.type) {
                        case 'regexp': return typeof p === 'string' && selector.value.value.test(p);
                        case 'literal': return `${selector.value.value}` === `${p}`;
                        case 'type': return selector.value.value === typeof p;
                    }
                    throw new Error(`Unknown selector value type: ${selector.value.type}`);
                case '!=':
                    switch (selector.value.type) {
                        case 'regexp': return !selector.value.value.test(p);
                        case 'literal': return `${selector.value.value}` !== `${p}`;
                        case 'type': return selector.value.value !== typeof p;
                    }
                    throw new Error(`Unknown selector value type: ${selector.value.type}`);
                case '<=': return p <= selector.value.value;
                case '<': return p < selector.value.value;
                case '>': return p > selector.value.value;
                case '>=': return p >= selector.value.value;
            }
            throw new Error(`Unknown operator: ${selector.operator}`);
        }
        case 'sibling':
            return matches(node, selector.right, ancestry, options) &&
                sibling(node, selector.left, ancestry, LEFT_SIDE, options) ||
                selector.left.subject &&
                matches(node, selector.left, ancestry, options) &&
                sibling(node, selector.right, ancestry, RIGHT_SIDE, options);
        case 'adjacent':
            return matches(node, selector.right, ancestry, options) &&
                adjacent(node, selector.left, ancestry, LEFT_SIDE, options) ||
                selector.right.subject &&
                matches(node, selector.left, ancestry, options) &&
                adjacent(node, selector.right, ancestry, RIGHT_SIDE, options);

        case 'nth-child':
            return matches(node, selector.right, ancestry, options) &&
                nthChild(node, ancestry, function () {
                    return selector.index.value - 1;
                }, options);

        case 'nth-last-child':
            return matches(node, selector.right, ancestry, options) &&
                nthChild(node, ancestry, function (length) {
                    return length - selector.index.value;
                }, options);

        case 'class':
            switch(selector.name.toLowerCase()){
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
    }

    throw new Error(`Unknown selector type: ${selector.type}`);
}

/**
 * Get visitor keys of a given node.
 * @param {external:AST} node The AST node to get keys.
 * @param {ESQueryOptions|undefined} options
 * @returns {string[]} Visitor keys of the node.
 */
function getVisitorKeys(node, options) {
    const nodeType = node.type;
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
        return key !== 'type';
    });
}


/**
 * Check whether the given value is an ASTNode or not.
 * @param {any} node The value to check.
 * @returns {boolean} `true` if the value is an ASTNode.
 */
function isNode(node) {
    return node !== null && typeof node === 'object' && typeof node.type === 'string';
}

/**
 * Determines if the given node has a sibling that matches the
 * given selector.
 * @param {external:AST} node
 * @param {SelectorSequenceAST} selector
 * @param {external:AST[]} ancestry
 * @param {Side} side
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function sibling(node, selector, ancestry, side, options) {
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (const key of keys) {
        const listProp = parent[key];
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
                if (isNode(listProp[k]) && matches(listProp[k], selector, ancestry, options)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Determines if the given node has an adjacent sibling that matches
 * the given selector.
 * @param {external:AST} node
 * @param {SelectorSequenceAST} selector
 * @param {external:AST[]} ancestry
 * @param {Side} side
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function adjacent(node, selector, ancestry, side, options) {
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (const key of keys) {
        const listProp = parent[key];
        if (Array.isArray(listProp)) {
            const idx = listProp.indexOf(node);
            if (idx < 0) { continue; }
            if (side === LEFT_SIDE && idx > 0 && isNode(listProp[idx - 1]) && matches(listProp[idx - 1], selector, ancestry, options)) {
                return true;
            }
            if (side === RIGHT_SIDE && idx < listProp.length - 1 && isNode(listProp[idx + 1]) &&  matches(listProp[idx + 1], selector, ancestry, options)) {
                return true;
            }
        }
    }
    return false;
}

/**
* @callback IndexFunction
* @param {Integer} len Containing list's length
* @returns {Integer}
*/

/**
 * Determines if the given node is the nth child, determined by
 * `idxFn`, which is given the containing list's length.
 * @param {external:AST} node
 * @param {external:AST[]} ancestry
 * @param {IndexFunction} idxFn
 * @param {ESQueryOptions|undefined} options
 * @returns {boolean}
 */
function nthChild(node, ancestry, idxFn, options) {
    const [parent] = ancestry;
    if (!parent) { return false; }
    const keys = getVisitorKeys(parent, options);
    for (const key of keys) {
        const listProp = parent[key];
        if (Array.isArray(listProp)) {
            const idx = listProp.indexOf(node);
            if (idx >= 0 && idx === idxFn(listProp.length)) { return true; }
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
    for (const [p, sel] of Object.entries(selector)) {
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
    const altSubjects = subjects(selector);
    estraverse.traverse(ast, {
        enter (node, parent) {
            if (parent != null) { ancestry.unshift(parent); }
            if (matches(node, selector, ancestry, options)) {
                if (altSubjects.length) {
                    for (let i = 0, l = altSubjects.length; i < l; ++i) {
                        if (matches(node, altSubjects[i], ancestry, options)) {
                            visitor(node, parent, ancestry);
                        }
                        for (let k = 0, m = ancestry.length; k < m; ++k) {
                            const succeedingAncestry = ancestry.slice(k + 1);
                            if (matches(ancestry[k], altSubjects[i], succeedingAncestry, options)) {
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
