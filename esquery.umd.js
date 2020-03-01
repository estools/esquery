(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.esquery = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var _from = "estraverse@^4.0.0";
	var _id = "estraverse@4.3.0";
	var _inBundle = false;
	var _integrity = "sha512-39nnKffWz8xN1BU/2c79n9nB9HDzo0niYUqx6xyqUnyoAnQyyWpOTdZEeiCch8BBu515t4wp9ZmgVfVhn9EBpw==";
	var _location = "/estraverse";
	var _phantomChildren = {
	};
	var _requested = {
		type: "range",
		registry: true,
		raw: "estraverse@^4.0.0",
		name: "estraverse",
		escapedName: "estraverse",
		rawSpec: "^4.0.0",
		saveSpec: null,
		fetchSpec: "^4.0.0"
	};
	var _requiredBy = [
		"/"
	];
	var _resolved = "https://registry.npmjs.org/estraverse/-/estraverse-4.3.0.tgz";
	var _shasum = "398ad3f3c5a24948be7725e83d11a7de28cdbd1d";
	var _spec = "estraverse@^4.0.0";
	var _where = "/Users/brett/esquery";
	var bugs = {
		url: "https://github.com/estools/estraverse/issues"
	};
	var bundleDependencies = false;
	var deprecated = false;
	var description = "ECMAScript JS AST traversal functions";
	var devDependencies = {
		"babel-preset-env": "^1.6.1",
		"babel-register": "^6.3.13",
		chai: "^2.1.1",
		espree: "^1.11.0",
		gulp: "^3.8.10",
		"gulp-bump": "^0.2.2",
		"gulp-filter": "^2.0.0",
		"gulp-git": "^1.0.1",
		"gulp-tag-version": "^1.3.0",
		jshint: "^2.5.6",
		mocha: "^2.1.0"
	};
	var engines = {
		node: ">=4.0"
	};
	var homepage = "https://github.com/estools/estraverse";
	var license = "BSD-2-Clause";
	var main = "estraverse.js";
	var maintainers = [
		{
			name: "Yusuke Suzuki",
			email: "utatane.tea@gmail.com",
			url: "http://github.com/Constellation"
		}
	];
	var name = "estraverse";
	var repository = {
		type: "git",
		url: "git+ssh://git@github.com/estools/estraverse.git"
	};
	var scripts = {
		lint: "jshint estraverse.js",
		test: "npm run-script lint && npm run-script unit-test",
		"unit-test": "mocha --compilers js:babel-register"
	};
	var version = "4.3.0";
	var _package = {
		_from: _from,
		_id: _id,
		_inBundle: _inBundle,
		_integrity: _integrity,
		_location: _location,
		_phantomChildren: _phantomChildren,
		_requested: _requested,
		_requiredBy: _requiredBy,
		_resolved: _resolved,
		_shasum: _shasum,
		_spec: _spec,
		_where: _where,
		bugs: bugs,
		bundleDependencies: bundleDependencies,
		deprecated: deprecated,
		description: description,
		devDependencies: devDependencies,
		engines: engines,
		homepage: homepage,
		license: license,
		main: main,
		maintainers: maintainers,
		name: name,
		repository: repository,
		scripts: scripts,
		version: version
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		_from: _from,
		_id: _id,
		_inBundle: _inBundle,
		_integrity: _integrity,
		_location: _location,
		_phantomChildren: _phantomChildren,
		_requested: _requested,
		_requiredBy: _requiredBy,
		_resolved: _resolved,
		_shasum: _shasum,
		_spec: _spec,
		_where: _where,
		bugs: bugs,
		bundleDependencies: bundleDependencies,
		deprecated: deprecated,
		description: description,
		devDependencies: devDependencies,
		engines: engines,
		homepage: homepage,
		license: license,
		main: main,
		maintainers: maintainers,
		name: name,
		repository: repository,
		scripts: scripts,
		version: version,
		'default': _package
	});

	var require$$0 = getCjsExportFromNamespace(_package$1);

	var estraverse = createCommonjsModule(function (module, exports) {
	/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true*/
	(function clone(exports) {

	    var Syntax,
	        VisitorOption,
	        VisitorKeys,
	        BREAK,
	        SKIP,
	        REMOVE;

	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }

	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License

	    function upperBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        AssignmentPattern: 'AssignmentPattern',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportAllDeclaration: 'ExportAllDeclaration',
	        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
	        ExportNamedDeclaration: 'ExportNamedDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportExpression: 'ImportExpression',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MetaProperty: 'MetaProperty',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        RestElement: 'RestElement',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        Super: 'Super',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        AssignmentPattern: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrayPattern: ['elements'],
	        ArrowFunctionExpression: ['params', 'body'],
	        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'superClass', 'body'],
	        ClassExpression: ['id', 'superClass', 'body'],
	        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExportAllDeclaration: ['source'],
	        ExportDefaultDeclaration: ['declaration'],
	        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
	        ExportSpecifier: ['exported', 'local'],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        ForOfStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'body'],
	        FunctionExpression: ['id', 'params', 'body'],
	        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        ImportExpression: ['source'],
	        ImportDeclaration: ['specifiers', 'source'],
	        ImportDefaultSpecifier: ['local'],
	        ImportNamespaceSpecifier: ['local'],
	        ImportSpecifier: ['imported', 'local'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MetaProperty: ['meta', 'property'],
	        MethodDefinition: ['key', 'value'],
	        ModuleSpecifier: [],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        ObjectPattern: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        RestElement: [ 'argument' ],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SpreadElement: ['argument'],
	        Super: [],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        TaggedTemplateExpression: ['tag', 'quasi'],
	        TemplateElement: [],
	        TemplateLiteral: ['quasis', 'expressions'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handler', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };

	    // unique id
	    BREAK = {};
	    SKIP = {};
	    REMOVE = {};

	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP,
	        Remove: REMOVE
	    };

	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }

	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };

	    Reference.prototype.remove = function remove() {
	        if (Array.isArray(this.parent)) {
	            this.parent.splice(this.key, 1);
	            return true;
	        } else {
	            this.replace(null);
	            return false;
	        }
	    };

	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }

	    function Controller() { }

	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;

	        function addToPath(result, path) {
	            if (Array.isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }

	        // root node
	        if (!this.__current.path) {
	            return null;
	        }

	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };

	    // API:
	    // return type of current node
	    Controller.prototype.type = function () {
	        var node = this.current();
	        return node.type || this.__current.wrap;
	    };

	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;

	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }

	        return result;
	    };

	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };

	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;

	        result = undefined;

	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;

	        return result;
	    };

	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };

	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };

	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };

	    // API:
	    // remove node
	    Controller.prototype.remove = function () {
	        this.notify(REMOVE);
	    };

	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	        this.__fallback = null;
	        if (visitor.fallback === 'iteration') {
	            this.__fallback = Object.keys;
	        } else if (typeof visitor.fallback === 'function') {
	            this.__fallback = visitor.fallback;
	        }

	        this.__keys = VisitorKeys;
	        if (visitor.keys) {
	            this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
	        }
	    };

	    function isNode(node) {
	        if (node == null) {
	            return false;
	        }
	        return typeof node === 'object' && typeof node.type === 'string';
	    }

	    function isProperty(nodeType, key) {
	        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
	    }

	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                ret = this.__execute(visitor.leave, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }

	            if (element.node) {

	                ret = this.__execute(visitor.enter, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }

	                worklist.push(sentinel);
	                leavelist.push(element);

	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }

	                node = element.node;
	                nodeType = node.type || element.wrap;
	                candidates = this.__keys[nodeType];
	                if (!candidates) {
	                    if (this.__fallback) {
	                        candidates = this.__fallback(node);
	                    } else {
	                        throw new Error('Unknown node type ' + nodeType + '.');
	                    }
	                }

	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }

	                    if (Array.isArray(candidate)) {
	                        current2 = candidate.length;
	                        while ((current2 -= 1) >= 0) {
	                            if (!candidate[current2]) {
	                                continue;
	                            }
	                            if (isProperty(nodeType, candidates[current])) {
	                                element = new Element(candidate[current2], [key, current2], 'Property', null);
	                            } else if (isNode(candidate[current2])) {
	                                element = new Element(candidate[current2], [key, current2], null, null);
	                            } else {
	                                continue;
	                            }
	                            worklist.push(element);
	                        }
	                    } else if (isNode(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                    }
	                }
	            }
	        }
	    };

	    Controller.prototype.replace = function replace(root, visitor) {
	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;

	        function removeElem(element) {
	            var i,
	                key,
	                nextElem,
	                parent;

	            if (element.ref.remove()) {
	                // When the reference is an element of an array.
	                key = element.ref.key;
	                parent = element.ref.parent;

	                // If removed from array, then decrease following items' keys.
	                i = worklist.length;
	                while (i--) {
	                    nextElem = worklist[i];
	                    if (nextElem.ref && nextElem.ref.parent === parent) {
	                        if  (nextElem.ref.key < key) {
	                            break;
	                        }
	                        --nextElem.ref.key;
	                    }
	                }
	            }
	        }

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                target = this.__execute(visitor.leave, element);

	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                    // replace
	                    element.ref.replace(target);
	                }

	                if (this.__state === REMOVE || target === REMOVE) {
	                    removeElem(element);
	                }

	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }

	            target = this.__execute(visitor.enter, element);

	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }

	            if (this.__state === REMOVE || target === REMOVE) {
	                removeElem(element);
	                element.node = null;
	            }

	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }

	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }

	            worklist.push(sentinel);
	            leavelist.push(element);

	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }

	            nodeType = node.type || element.wrap;
	            candidates = this.__keys[nodeType];
	            if (!candidates) {
	                if (this.__fallback) {
	                    candidates = this.__fallback(node);
	                } else {
	                    throw new Error('Unknown node type ' + nodeType + '.');
	                }
	            }

	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }

	                if (Array.isArray(candidate)) {
	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if (isProperty(nodeType, candidates[current])) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                        } else if (isNode(candidate[current2])) {
	                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                        } else {
	                            continue;
	                        }
	                        worklist.push(element);
	                    }
	                } else if (isNode(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                }
	            }
	        }

	        return outer.root;
	    };

	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }

	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }

	    function extendCommentRange(comment, tokens) {
	        var target;

	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });

	        comment.extendedRange = [comment.range[0], comment.range[1]];

	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }

	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }

	        return comment;
	    }

	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;

	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }

	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }

	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }

	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }

	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }

	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        return tree;
	    }

	    exports.version = require$$0.version;
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	    exports.cloneEnvironment = function () { return clone({}); };

	    return exports;
	}(exports));
	/* vim: set sw=4 ts=4 et tw=80 : */
	});

	var parser = createCommonjsModule(function (module) {
	var result = (function(){
	  /*
	   * Generated by PEG.js 0.7.0.
	   *
	   * http://pegjs.majda.cz/
	   */
	  
	  function quote(s) {
	    /*
	     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
	     * string literal except for the closing quote character, backslash,
	     * carriage return, line separator, paragraph separator, and line feed.
	     * Any character may appear in the form of an escape sequence.
	     *
	     * For portability, we also escape escape all control and non-ASCII
	     * characters. Note that "\0" and "\v" escape sequences are not used
	     * because JSHint does not like the first and IE the second.
	     */
	     return '"' + s
	      .replace(/\\/g, '\\\\')  // backslash
	      .replace(/"/g, '\\"')    // closing quote character
	      .replace(/\x08/g, '\\b') // backspace
	      .replace(/\t/g, '\\t')   // horizontal tab
	      .replace(/\n/g, '\\n')   // line feed
	      .replace(/\f/g, '\\f')   // form feed
	      .replace(/\r/g, '\\r')   // carriage return
	      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
	      + '"';
	  }
	  
	  var result = {
	    /*
	     * Parses the input with a generated parser. If the parsing is successful,
	     * returns a value explicitly or implicitly specified by the grammar from
	     * which the parser was generated (see |PEG.buildParser|). If the parsing is
	     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
	     */
	    parse: function(input, startRule) {
	      var parseFunctions = {
	        "start": parse_start,
	        "_": parse__,
	        "identifierName": parse_identifierName,
	        "binaryOp": parse_binaryOp,
	        "selectors": parse_selectors,
	        "selector": parse_selector,
	        "sequence": parse_sequence,
	        "atom": parse_atom,
	        "wildcard": parse_wildcard,
	        "identifier": parse_identifier,
	        "attr": parse_attr,
	        "attrOps": parse_attrOps,
	        "attrEqOps": parse_attrEqOps,
	        "attrName": parse_attrName,
	        "attrValue": parse_attrValue,
	        "string": parse_string,
	        "number": parse_number,
	        "path": parse_path,
	        "type": parse_type,
	        "regex": parse_regex,
	        "field": parse_field,
	        "negation": parse_negation,
	        "matches": parse_matches,
	        "has": parse_has,
	        "firstChild": parse_firstChild,
	        "lastChild": parse_lastChild,
	        "nthChild": parse_nthChild,
	        "nthLastChild": parse_nthLastChild,
	        "class": parse_class
	      };
	      
	      if (startRule !== undefined) {
	        if (parseFunctions[startRule] === undefined) {
	          throw new Error("Invalid rule name: " + quote(startRule) + ".");
	        }
	      } else {
	        startRule = "start";
	      }
	      
	      var pos = 0;
	      var rightmostFailuresPos = 0;
	      var rightmostFailuresExpected = [];
	      var cache = {};
	      
	      function matchFailed(failure) {
	        if (pos < rightmostFailuresPos) {
	          return;
	        }
	        
	        if (pos > rightmostFailuresPos) {
	          rightmostFailuresPos = pos;
	          rightmostFailuresExpected = [];
	        }
	        
	        rightmostFailuresExpected.push(failure);
	      }
	      
	      function parse_start() {
	        var cacheKey = "start@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse__();
	        if (result0 !== null) {
	          result1 = parse_selectors();
	          if (result1 !== null) {
	            result2 = parse__();
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, ss) { return ss.length === 1 ? ss[0] : { type: 'matches', selectors: ss }; })(pos0, result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          result0 = parse__();
	          if (result0 !== null) {
	            result0 = (function(offset) { return void 0; })();
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse__() {
	        var cacheKey = "_@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        
	        result0 = [];
	        if (input.charCodeAt(pos) === 32) {
	          result1 = " ";
	          pos++;
	        } else {
	          result1 = null;
	          {
	            matchFailed("\" \"");
	          }
	        }
	        while (result1 !== null) {
	          result0.push(result1);
	          if (input.charCodeAt(pos) === 32) {
	            result1 = " ";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\" \"");
	            }
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_identifierName() {
	        var cacheKey = "identifierName@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0;
	        
	        pos0 = pos;
	        if (/^[^ [\],():#!=><~+.]/.test(input.charAt(pos))) {
	          result1 = input.charAt(pos);
	          pos++;
	        } else {
	          result1 = null;
	          {
	            matchFailed("[^ [\\],():#!=><~+.]");
	          }
	        }
	        if (result1 !== null) {
	          result0 = [];
	          while (result1 !== null) {
	            result0.push(result1);
	            if (/^[^ [\],():#!=><~+.]/.test(input.charAt(pos))) {
	              result1 = input.charAt(pos);
	              pos++;
	            } else {
	              result1 = null;
	              {
	                matchFailed("[^ [\\],():#!=><~+.]");
	              }
	            }
	          }
	        } else {
	          result0 = null;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, i) { return i.join(''); })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_binaryOp() {
	        var cacheKey = "binaryOp@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse__();
	        if (result0 !== null) {
	          if (input.charCodeAt(pos) === 62) {
	            result1 = ">";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\">\"");
	            }
	          }
	          if (result1 !== null) {
	            result2 = parse__();
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return 'child'; })();
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          result0 = parse__();
	          if (result0 !== null) {
	            if (input.charCodeAt(pos) === 126) {
	              result1 = "~";
	              pos++;
	            } else {
	              result1 = null;
	              {
	                matchFailed("\"~\"");
	              }
	            }
	            if (result1 !== null) {
	              result2 = parse__();
	              if (result2 !== null) {
	                result0 = [result0, result1, result2];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset) { return 'sibling'; })();
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            pos1 = pos;
	            result0 = parse__();
	            if (result0 !== null) {
	              if (input.charCodeAt(pos) === 43) {
	                result1 = "+";
	                pos++;
	              } else {
	                result1 = null;
	                {
	                  matchFailed("\"+\"");
	                }
	              }
	              if (result1 !== null) {
	                result2 = parse__();
	                if (result2 !== null) {
	                  result0 = [result0, result1, result2];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) { return 'adjacent'; })();
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              pos1 = pos;
	              if (input.charCodeAt(pos) === 32) {
	                result0 = " ";
	                pos++;
	              } else {
	                result0 = null;
	                {
	                  matchFailed("\" \"");
	                }
	              }
	              if (result0 !== null) {
	                result1 = parse__();
	                if (result1 !== null) {
	                  result0 = [result0, result1];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) { return 'descendant'; })();
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	            }
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_selectors() {
	        var cacheKey = "selectors@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4, result5;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse_selector();
	        if (result0 !== null) {
	          result1 = [];
	          pos2 = pos;
	          result2 = parse__();
	          if (result2 !== null) {
	            if (input.charCodeAt(pos) === 44) {
	              result3 = ",";
	              pos++;
	            } else {
	              result3 = null;
	              {
	                matchFailed("\",\"");
	              }
	            }
	            if (result3 !== null) {
	              result4 = parse__();
	              if (result4 !== null) {
	                result5 = parse_selector();
	                if (result5 !== null) {
	                  result2 = [result2, result3, result4, result5];
	                } else {
	                  result2 = null;
	                  pos = pos2;
	                }
	              } else {
	                result2 = null;
	                pos = pos2;
	              }
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	          } else {
	            result2 = null;
	            pos = pos2;
	          }
	          while (result2 !== null) {
	            result1.push(result2);
	            pos2 = pos;
	            result2 = parse__();
	            if (result2 !== null) {
	              if (input.charCodeAt(pos) === 44) {
	                result3 = ",";
	                pos++;
	              } else {
	                result3 = null;
	                {
	                  matchFailed("\",\"");
	                }
	              }
	              if (result3 !== null) {
	                result4 = parse__();
	                if (result4 !== null) {
	                  result5 = parse_selector();
	                  if (result5 !== null) {
	                    result2 = [result2, result3, result4, result5];
	                  } else {
	                    result2 = null;
	                    pos = pos2;
	                  }
	                } else {
	                  result2 = null;
	                  pos = pos2;
	                }
	              } else {
	                result2 = null;
	                pos = pos2;
	              }
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, s, ss) {
	          return [s].concat(ss.map(function (s) { return s[3]; }));
	        })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_selector() {
	        var cacheKey = "selector@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse_sequence();
	        if (result0 !== null) {
	          result1 = [];
	          pos2 = pos;
	          result2 = parse_binaryOp();
	          if (result2 !== null) {
	            result3 = parse_sequence();
	            if (result3 !== null) {
	              result2 = [result2, result3];
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	          } else {
	            result2 = null;
	            pos = pos2;
	          }
	          while (result2 !== null) {
	            result1.push(result2);
	            pos2 = pos;
	            result2 = parse_binaryOp();
	            if (result2 !== null) {
	              result3 = parse_sequence();
	              if (result3 !== null) {
	                result2 = [result2, result3];
	              } else {
	                result2 = null;
	                pos = pos2;
	              }
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, a, ops) {
	            return ops.reduce(function (memo, rhs) {
	              return { type: rhs[0], left: memo, right: rhs[1] };
	            }, a);
	          })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_sequence() {
	        var cacheKey = "sequence@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 33) {
	          result0 = "!";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"!\"");
	          }
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          result2 = parse_atom();
	          if (result2 !== null) {
	            result1 = [];
	            while (result2 !== null) {
	              result1.push(result2);
	              result2 = parse_atom();
	            }
	          } else {
	            result1 = null;
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, subject, as) {
	            var b = as.length === 1 ? as[0] : { type: 'compound', selectors: as };
	            if(subject) b.subject = true;
	            return b;
	          })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_atom() {
	        var cacheKey = "atom@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0;
	        
	        result0 = parse_wildcard();
	        if (result0 === null) {
	          result0 = parse_identifier();
	          if (result0 === null) {
	            result0 = parse_attr();
	            if (result0 === null) {
	              result0 = parse_field();
	              if (result0 === null) {
	                result0 = parse_negation();
	                if (result0 === null) {
	                  result0 = parse_matches();
	                  if (result0 === null) {
	                    result0 = parse_has();
	                    if (result0 === null) {
	                      result0 = parse_firstChild();
	                      if (result0 === null) {
	                        result0 = parse_lastChild();
	                        if (result0 === null) {
	                          result0 = parse_nthChild();
	                          if (result0 === null) {
	                            result0 = parse_nthLastChild();
	                            if (result0 === null) {
	                              result0 = parse_class();
	                            }
	                          }
	                        }
	                      }
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_wildcard() {
	        var cacheKey = "wildcard@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        if (input.charCodeAt(pos) === 42) {
	          result0 = "*";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"*\"");
	          }
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, a) { return { type: 'wildcard', value: a }; })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_identifier() {
	        var cacheKey = "identifier@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 35) {
	          result0 = "#";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"#\"");
	          }
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          result1 = parse_identifierName();
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, i) { return { type: 'identifier', value: i }; })(pos0, result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_attr() {
	        var cacheKey = "attr@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 91) {
	          result0 = "[";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"[\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_attrValue();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 93) {
	                  result4 = "]";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\"]\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, v) { return v; })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_attrOps() {
	        var cacheKey = "attrOps@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (/^[><!]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("[><!]");
	          }
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          if (input.charCodeAt(pos) === 61) {
	            result1 = "=";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\"=\"");
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, a) { return a + '='; })(pos0, result0[0]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          if (/^[><]/.test(input.charAt(pos))) {
	            result0 = input.charAt(pos);
	            pos++;
	          } else {
	            result0 = null;
	            {
	              matchFailed("[><]");
	            }
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_attrEqOps() {
	        var cacheKey = "attrEqOps@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 33) {
	          result0 = "!";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"!\"");
	          }
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          if (input.charCodeAt(pos) === 61) {
	            result1 = "=";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\"=\"");
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, a) { return a + '='; })(pos0, result0[0]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_attrName() {
	        var cacheKey = "attrName@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0;
	        
	        pos0 = pos;
	        result1 = parse_identifierName();
	        if (result1 === null) {
	          if (input.charCodeAt(pos) === 46) {
	            result1 = ".";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\".\"");
	            }
	          }
	        }
	        if (result1 !== null) {
	          result0 = [];
	          while (result1 !== null) {
	            result0.push(result1);
	            result1 = parse_identifierName();
	            if (result1 === null) {
	              if (input.charCodeAt(pos) === 46) {
	                result1 = ".";
	                pos++;
	              } else {
	                result1 = null;
	                {
	                  matchFailed("\".\"");
	                }
	              }
	            }
	          }
	        } else {
	          result0 = null;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, i) { return i.join(''); })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_attrValue() {
	        var cacheKey = "attrValue@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse_attrName();
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_attrEqOps();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                result4 = parse_type();
	                if (result4 === null) {
	                  result4 = parse_regex();
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, name, op, value) {
	              return { type: 'attribute', name: name, operator: op, value: value };
	            })(pos0, result0[0], result0[2], result0[4]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          result0 = parse_attrName();
	          if (result0 !== null) {
	            result1 = parse__();
	            if (result1 !== null) {
	              result2 = parse_attrOps();
	              if (result2 !== null) {
	                result3 = parse__();
	                if (result3 !== null) {
	                  result4 = parse_string();
	                  if (result4 === null) {
	                    result4 = parse_number();
	                    if (result4 === null) {
	                      result4 = parse_path();
	                    }
	                  }
	                  if (result4 !== null) {
	                    result0 = [result0, result1, result2, result3, result4];
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset, name, op, value) {
	                return { type: 'attribute', name: name, operator: op, value: value };
	              })(pos0, result0[0], result0[2], result0[4]);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            result0 = parse_attrName();
	            if (result0 !== null) {
	              result0 = (function(offset, name) { return { type: 'attribute', name: name }; })(pos0, result0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_string() {
	        var cacheKey = "string@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3;
	        var pos0, pos1, pos2, pos3;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 34) {
	          result0 = "\"";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"\\\"\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = [];
	          if (/^[^\\"]/.test(input.charAt(pos))) {
	            result2 = input.charAt(pos);
	            pos++;
	          } else {
	            result2 = null;
	            {
	              matchFailed("[^\\\\\"]");
	            }
	          }
	          if (result2 === null) {
	            pos2 = pos;
	            pos3 = pos;
	            if (input.charCodeAt(pos) === 92) {
	              result2 = "\\";
	              pos++;
	            } else {
	              result2 = null;
	              {
	                matchFailed("\"\\\\\"");
	              }
	            }
	            if (result2 !== null) {
	              if (input.length > pos) {
	                result3 = input.charAt(pos);
	                pos++;
	              } else {
	                result3 = null;
	                {
	                  matchFailed("any character");
	                }
	              }
	              if (result3 !== null) {
	                result2 = [result2, result3];
	              } else {
	                result2 = null;
	                pos = pos3;
	              }
	            } else {
	              result2 = null;
	              pos = pos3;
	            }
	            if (result2 !== null) {
	              result2 = (function(offset, a, b) { return a + b; })(pos2, result2[0], result2[1]);
	            }
	            if (result2 === null) {
	              pos = pos2;
	            }
	          }
	          while (result2 !== null) {
	            result1.push(result2);
	            if (/^[^\\"]/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              {
	                matchFailed("[^\\\\\"]");
	              }
	            }
	            if (result2 === null) {
	              pos2 = pos;
	              pos3 = pos;
	              if (input.charCodeAt(pos) === 92) {
	                result2 = "\\";
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("\"\\\\\"");
	                }
	              }
	              if (result2 !== null) {
	                if (input.length > pos) {
	                  result3 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result3 = null;
	                  {
	                    matchFailed("any character");
	                  }
	                }
	                if (result3 !== null) {
	                  result2 = [result2, result3];
	                } else {
	                  result2 = null;
	                  pos = pos3;
	                }
	              } else {
	                result2 = null;
	                pos = pos3;
	              }
	              if (result2 !== null) {
	                result2 = (function(offset, a, b) { return a + b; })(pos2, result2[0], result2[1]);
	              }
	              if (result2 === null) {
	                pos = pos2;
	              }
	            }
	          }
	          if (result1 !== null) {
	            if (input.charCodeAt(pos) === 34) {
	              result2 = "\"";
	              pos++;
	            } else {
	              result2 = null;
	              {
	                matchFailed("\"\\\"\"");
	              }
	            }
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, d) {
	                return { type: 'literal', value: strUnescape(d.join('')) };
	              })(pos0, result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          if (input.charCodeAt(pos) === 39) {
	            result0 = "'";
	            pos++;
	          } else {
	            result0 = null;
	            {
	              matchFailed("\"'\"");
	            }
	          }
	          if (result0 !== null) {
	            result1 = [];
	            if (/^[^\\']/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              {
	                matchFailed("[^\\\\']");
	              }
	            }
	            if (result2 === null) {
	              pos2 = pos;
	              pos3 = pos;
	              if (input.charCodeAt(pos) === 92) {
	                result2 = "\\";
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("\"\\\\\"");
	                }
	              }
	              if (result2 !== null) {
	                if (input.length > pos) {
	                  result3 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result3 = null;
	                  {
	                    matchFailed("any character");
	                  }
	                }
	                if (result3 !== null) {
	                  result2 = [result2, result3];
	                } else {
	                  result2 = null;
	                  pos = pos3;
	                }
	              } else {
	                result2 = null;
	                pos = pos3;
	              }
	              if (result2 !== null) {
	                result2 = (function(offset, a, b) { return a + b; })(pos2, result2[0], result2[1]);
	              }
	              if (result2 === null) {
	                pos = pos2;
	              }
	            }
	            while (result2 !== null) {
	              result1.push(result2);
	              if (/^[^\\']/.test(input.charAt(pos))) {
	                result2 = input.charAt(pos);
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("[^\\\\']");
	                }
	              }
	              if (result2 === null) {
	                pos2 = pos;
	                pos3 = pos;
	                if (input.charCodeAt(pos) === 92) {
	                  result2 = "\\";
	                  pos++;
	                } else {
	                  result2 = null;
	                  {
	                    matchFailed("\"\\\\\"");
	                  }
	                }
	                if (result2 !== null) {
	                  if (input.length > pos) {
	                    result3 = input.charAt(pos);
	                    pos++;
	                  } else {
	                    result3 = null;
	                    {
	                      matchFailed("any character");
	                    }
	                  }
	                  if (result3 !== null) {
	                    result2 = [result2, result3];
	                  } else {
	                    result2 = null;
	                    pos = pos3;
	                  }
	                } else {
	                  result2 = null;
	                  pos = pos3;
	                }
	                if (result2 !== null) {
	                  result2 = (function(offset, a, b) { return a + b; })(pos2, result2[0], result2[1]);
	                }
	                if (result2 === null) {
	                  pos = pos2;
	                }
	              }
	            }
	            if (result1 !== null) {
	              if (input.charCodeAt(pos) === 39) {
	                result2 = "'";
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("\"'\"");
	                }
	              }
	              if (result2 !== null) {
	                result0 = [result0, result1, result2];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset, d) {
	                  return { type: 'literal', value: strUnescape(d.join('')) };
	                })(pos0, result0[1]);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_number() {
	        var cacheKey = "number@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        pos2 = pos;
	        result0 = [];
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result1 = input.charAt(pos);
	          pos++;
	        } else {
	          result1 = null;
	          {
	            matchFailed("[0-9]");
	          }
	        }
	        while (result1 !== null) {
	          result0.push(result1);
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("[0-9]");
	            }
	          }
	        }
	        if (result0 !== null) {
	          if (input.charCodeAt(pos) === 46) {
	            result1 = ".";
	            pos++;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\".\"");
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos2;
	          }
	        } else {
	          result0 = null;
	          pos = pos2;
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result2 = input.charAt(pos);
	            pos++;
	          } else {
	            result2 = null;
	            {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result2 !== null) {
	            result1 = [];
	            while (result2 !== null) {
	              result1.push(result2);
	              if (/^[0-9]/.test(input.charAt(pos))) {
	                result2 = input.charAt(pos);
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("[0-9]");
	                }
	              }
	            }
	          } else {
	            result1 = null;
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, a, b) {
	                return { type: 'literal', value: parseFloat((a ? a.join('') : '') + b.join('')) };
	              })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_path() {
	        var cacheKey = "path@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        result0 = parse_identifierName();
	        if (result0 !== null) {
	          result0 = (function(offset, i) { return { type: 'literal', value: i }; })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_type() {
	        var cacheKey = "type@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 5) === "type(") {
	          result0 = "type(";
	          pos += 5;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"type(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            if (/^[^ )]/.test(input.charAt(pos))) {
	              result3 = input.charAt(pos);
	              pos++;
	            } else {
	              result3 = null;
	              {
	                matchFailed("[^ )]");
	              }
	            }
	            if (result3 !== null) {
	              result2 = [];
	              while (result3 !== null) {
	                result2.push(result3);
	                if (/^[^ )]/.test(input.charAt(pos))) {
	                  result3 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result3 = null;
	                  {
	                    matchFailed("[^ )]");
	                  }
	                }
	              }
	            } else {
	              result2 = null;
	            }
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, t) { return { type: 'type', value: t.join('') }; })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_regex() {
	        var cacheKey = "regex@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 47) {
	          result0 = "/";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\"/\"");
	          }
	        }
	        if (result0 !== null) {
	          if (/^[^\/]/.test(input.charAt(pos))) {
	            result2 = input.charAt(pos);
	            pos++;
	          } else {
	            result2 = null;
	            {
	              matchFailed("[^\\/]");
	            }
	          }
	          if (result2 !== null) {
	            result1 = [];
	            while (result2 !== null) {
	              result1.push(result2);
	              if (/^[^\/]/.test(input.charAt(pos))) {
	                result2 = input.charAt(pos);
	                pos++;
	              } else {
	                result2 = null;
	                {
	                  matchFailed("[^\\/]");
	                }
	              }
	            }
	          } else {
	            result1 = null;
	          }
	          if (result1 !== null) {
	            if (input.charCodeAt(pos) === 47) {
	              result2 = "/";
	              pos++;
	            } else {
	              result2 = null;
	              {
	                matchFailed("\"/\"");
	              }
	            }
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, d) { return { type: 'regexp', value: new RegExp(d.join('')) }; })(pos0, result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_field() {
	        var cacheKey = "field@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 46) {
	          result0 = ".";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\".\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse_identifierName();
	          if (result1 !== null) {
	            result2 = [];
	            pos2 = pos;
	            if (input.charCodeAt(pos) === 46) {
	              result3 = ".";
	              pos++;
	            } else {
	              result3 = null;
	              {
	                matchFailed("\".\"");
	              }
	            }
	            if (result3 !== null) {
	              result4 = parse_identifierName();
	              if (result4 !== null) {
	                result3 = [result3, result4];
	              } else {
	                result3 = null;
	                pos = pos2;
	              }
	            } else {
	              result3 = null;
	              pos = pos2;
	            }
	            while (result3 !== null) {
	              result2.push(result3);
	              pos2 = pos;
	              if (input.charCodeAt(pos) === 46) {
	                result3 = ".";
	                pos++;
	              } else {
	                result3 = null;
	                {
	                  matchFailed("\".\"");
	                }
	              }
	              if (result3 !== null) {
	                result4 = parse_identifierName();
	                if (result4 !== null) {
	                  result3 = [result3, result4];
	                } else {
	                  result3 = null;
	                  pos = pos2;
	                }
	              } else {
	                result3 = null;
	                pos = pos2;
	              }
	            }
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, i, is) {
	          return { type: 'field', name: is.reduce(function(memo, p){ return memo + p[0] + p[1]; }, i)};
	        })(pos0, result0[1], result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_negation() {
	        var cacheKey = "negation@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 5) === ":not(") {
	          result0 = ":not(";
	          pos += 5;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":not(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_selectors();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, ss) { return { type: 'not', selectors: ss }; })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_matches() {
	        var cacheKey = "matches@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 9) === ":matches(") {
	          result0 = ":matches(";
	          pos += 9;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":matches(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_selectors();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, ss) { return { type: 'matches', selectors: ss }; })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_has() {
	        var cacheKey = "has@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 5) === ":has(") {
	          result0 = ":has(";
	          pos += 5;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":has(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_selectors();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, ss) { return { type: 'has', selectors: ss }; })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_firstChild() {
	        var cacheKey = "firstChild@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        if (input.substr(pos, 12) === ":first-child") {
	          result0 = ":first-child";
	          pos += 12;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":first-child\"");
	          }
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return nth(1); })();
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_lastChild() {
	        var cacheKey = "lastChild@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        if (input.substr(pos, 11) === ":last-child") {
	          result0 = ":last-child";
	          pos += 11;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":last-child\"");
	          }
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return nthLast(1); })();
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_nthChild() {
	        var cacheKey = "nthChild@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 11) === ":nth-child(") {
	          result0 = ":nth-child(";
	          pos += 11;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":nth-child(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result3 = input.charAt(pos);
	              pos++;
	            } else {
	              result3 = null;
	              {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result3 !== null) {
	              result2 = [];
	              while (result3 !== null) {
	                result2.push(result3);
	                if (/^[0-9]/.test(input.charAt(pos))) {
	                  result3 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result3 = null;
	                  {
	                    matchFailed("[0-9]");
	                  }
	                }
	              }
	            } else {
	              result2 = null;
	            }
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, n) { return nth(parseInt(n.join(''), 10)); })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_nthLastChild() {
	        var cacheKey = "nthLastChild@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 16) === ":nth-last-child(") {
	          result0 = ":nth-last-child(";
	          pos += 16;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":nth-last-child(\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result3 = input.charAt(pos);
	              pos++;
	            } else {
	              result3 = null;
	              {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result3 !== null) {
	              result2 = [];
	              while (result3 !== null) {
	                result2.push(result3);
	                if (/^[0-9]/.test(input.charAt(pos))) {
	                  result3 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result3 = null;
	                  {
	                    matchFailed("[0-9]");
	                  }
	                }
	              }
	            } else {
	              result2 = null;
	            }
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 41) {
	                  result4 = ")";
	                  pos++;
	                } else {
	                  result4 = null;
	                  {
	                    matchFailed("\")\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, n) { return nthLast(parseInt(n.join(''), 10)); })(pos0, result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      function parse_class() {
	        var cacheKey = "class@" + pos;
	        var cachedResult = cache[cacheKey];
	        if (cachedResult) {
	          pos = cachedResult.nextPos;
	          return cachedResult.result;
	        }
	        
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 58) {
	          result0 = ":";
	          pos++;
	        } else {
	          result0 = null;
	          {
	            matchFailed("\":\"");
	          }
	        }
	        if (result0 !== null) {
	          if (input.substr(pos, 9).toLowerCase() === "statement") {
	            result1 = input.substr(pos, 9);
	            pos += 9;
	          } else {
	            result1 = null;
	            {
	              matchFailed("\"statement\"");
	            }
	          }
	          if (result1 === null) {
	            if (input.substr(pos, 10).toLowerCase() === "expression") {
	              result1 = input.substr(pos, 10);
	              pos += 10;
	            } else {
	              result1 = null;
	              {
	                matchFailed("\"expression\"");
	              }
	            }
	            if (result1 === null) {
	              if (input.substr(pos, 11).toLowerCase() === "declaration") {
	                result1 = input.substr(pos, 11);
	                pos += 11;
	              } else {
	                result1 = null;
	                {
	                  matchFailed("\"declaration\"");
	                }
	              }
	              if (result1 === null) {
	                if (input.substr(pos, 8).toLowerCase() === "function") {
	                  result1 = input.substr(pos, 8);
	                  pos += 8;
	                } else {
	                  result1 = null;
	                  {
	                    matchFailed("\"function\"");
	                  }
	                }
	                if (result1 === null) {
	                  if (input.substr(pos, 7).toLowerCase() === "pattern") {
	                    result1 = input.substr(pos, 7);
	                    pos += 7;
	                  } else {
	                    result1 = null;
	                    {
	                      matchFailed("\"pattern\"");
	                    }
	                  }
	                }
	              }
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, c) {
	          return { type: 'class', name: c };
	        })(pos0, result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        
	        cache[cacheKey] = {
	          nextPos: pos,
	          result:  result0
	        };
	        return result0;
	      }
	      
	      
	      function cleanupExpected(expected) {
	        expected.sort();
	        
	        var lastExpected = null;
	        var cleanExpected = [];
	        for (var i = 0; i < expected.length; i++) {
	          if (expected[i] !== lastExpected) {
	            cleanExpected.push(expected[i]);
	            lastExpected = expected[i];
	          }
	        }
	        return cleanExpected;
	      }
	      
	      function computeErrorPosition() {
	        /*
	         * The first idea was to use |String.split| to break the input up to the
	         * error position along newlines and derive the line and column from
	         * there. However IE's |split| implementation is so broken that it was
	         * enough to prevent it.
	         */
	        
	        var line = 1;
	        var column = 1;
	        var seenCR = false;
	        
	        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
	          var ch = input.charAt(i);
	          if (ch === "\n") {
	            if (!seenCR) { line++; }
	            column = 1;
	            seenCR = false;
	          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
	            line++;
	            column = 1;
	            seenCR = true;
	          } else {
	            column++;
	            seenCR = false;
	          }
	        }
	        
	        return { line: line, column: column };
	      }
	      
	      
	        function nth(n) { return { type: 'nth-child', index: { type: 'literal', value: n } }; }
	        function nthLast(n) { return { type: 'nth-last-child', index: { type: 'literal', value: n } }; }
	        function strUnescape(s) {
	          return s.replace(/\\(.)/g, function(match, ch) {
	            switch(ch) {
	              case 'a': return '\a';
	              case 'b': return '\b';
	              case 'f': return '\f';
	              case 'n': return '\n';
	              case 'r': return '\r';
	              case 't': return '\t';
	              case 'v': return '\v';
	              default: return ch;
	            }
	          });
	        }
	      
	      
	      var result = parseFunctions[startRule]();
	      
	      /*
	       * The parser is now in one of the following three states:
	       *
	       * 1. The parser successfully parsed the whole input.
	       *
	       *    - |result !== null|
	       *    - |pos === input.length|
	       *    - |rightmostFailuresExpected| may or may not contain something
	       *
	       * 2. The parser successfully parsed only a part of the input.
	       *
	       *    - |result !== null|
	       *    - |pos < input.length|
	       *    - |rightmostFailuresExpected| may or may not contain something
	       *
	       * 3. The parser did not successfully parse any part of the input.
	       *
	       *   - |result === null|
	       *   - |pos === 0|
	       *   - |rightmostFailuresExpected| contains at least one failure
	       *
	       * All code following this comment (including called functions) must
	       * handle these states.
	       */
	      if (result === null || pos !== input.length) {
	        var offset = Math.max(pos, rightmostFailuresPos);
	        var found = offset < input.length ? input.charAt(offset) : null;
	        var errorPosition = computeErrorPosition();
	        
	        throw new this.SyntaxError(
	          cleanupExpected(rightmostFailuresExpected),
	          found,
	          offset,
	          errorPosition.line,
	          errorPosition.column
	        );
	      }
	      
	      return result;
	    },
	    
	    /* Returns the parser source code. */
	    toSource: function() { return this._source; }
	  };
	  
	  /* Thrown when a parser encounters a syntax error. */
	  
	  result.SyntaxError = function(expected, found, offset, line, column) {
	    function buildMessage(expected, found) {
	      var expectedHumanized, foundHumanized;
	      
	      switch (expected.length) {
	        case 0:
	          expectedHumanized = "end of input";
	          break;
	        case 1:
	          expectedHumanized = expected[0];
	          break;
	        default:
	          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
	            + " or "
	            + expected[expected.length - 1];
	      }
	      
	      foundHumanized = found ? quote(found) : "end of input";
	      
	      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
	    }
	    
	    this.name = "SyntaxError";
	    this.expected = expected;
	    this.found = found;
	    this.message = buildMessage(expected, found);
	    this.offset = offset;
	    this.line = line;
	    this.column = column;
	  };
	  
	  result.SyntaxError.prototype = Error.prototype;
	  
	  return result;
	})();
	if ( module.exports) { module.exports = result; } else { commonjsGlobal.esquery = result; }
	});

	var esquery = createCommonjsModule(function (module) {
	/* vim: set sw=4 sts=4 : */
	(function () {

	    var estraverse$1 = estraverse;
	    var parser$1 = parser;

	    var isArray = Array.isArray || function isArray(array) {
	        return {}.toString.call(array) === '[object Array]';
	    };

	    var LEFT_SIDE = {};
	    var RIGHT_SIDE = {};

	    function esqueryModule() {

	        /**
	         * Get the value of a property which may be multiple levels down in the object.
	         */
	        function getPath(obj, key) {
	            var i, keys = key.split(".");
	            for (i = 0; i < keys.length; i++) {
	                if (obj == null) { return obj; }
	                obj = obj[keys[i]];
	            }
	            return obj;
	        }

	        /**
	         * Determine whether `node` can be reached by following `path`, starting at `ancestor`.
	         */
	        function inPath(node, ancestor, path) {
	            var field, remainingPath, i;
	            if (path.length === 0) { return node === ancestor; }
	            if (ancestor == null) { return false; }
	            field = ancestor[path[0]];
	            remainingPath = path.slice(1);
	            if (isArray(field)) {
	                for (i = 0, l = field.length; i < l; ++i) {
	                    if (inPath(node, field[i], remainingPath)) { return true; }
	                }
	                return false;
	            } else {
	                return inPath(node, field, remainingPath);
	            }
	        }

	        /**
	         * Given a `node` and its ancestors, determine if `node` is matched by `selector`.
	         */
	        function matches(node, selector, ancestry) {
	            var path, ancestor, i, l, p;
	            if (!selector) { return true; }
	            if (!node) { return false; }
	            if (!ancestry) { ancestry = []; }

	            switch(selector.type) {
	                case 'wildcard':
	                    return true;

	                case 'identifier':
	                    return selector.value.toLowerCase() === node.type.toLowerCase();

	                case 'field':
	                    path = selector.name.split('.');
	                    ancestor = ancestry[path.length - 1];
	                    return inPath(node, ancestor, path);

	                case 'matches':
	                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
	                        if (matches(node, selector.selectors[i], ancestry)) { return true; }
	                    }
	                    return false;

	                case 'compound':
	                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
	                        if (!matches(node, selector.selectors[i], ancestry)) { return false; }
	                    }
	                    return true;

	                case 'not':
	                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
	                        if (matches(node, selector.selectors[i], ancestry)) { return false; }
	                    }
	                    return true;

	                case 'has':
	                    var a, collector = [];
	                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
	                      a = [];
	                      estraverse$1.traverse(node, {
	                          enter: function (node, parent) {
	                              if (parent != null) { a.unshift(parent); }
	                              if (matches(node, selector.selectors[i], a)) {
	                                collector.push(node);
	                              }
	                          },
	                          leave: function () { a.shift(); },
	                          fallback: 'iteration'
	                      });
	                    }
	                    return collector.length !== 0;

	                case 'child':
	                    if (matches(node, selector.right, ancestry)) {
	                        return matches(ancestry[0], selector.left, ancestry.slice(1));
	                    }
	                    return false;

	                case 'descendant':
	                    if (matches(node, selector.right, ancestry)) {
	                        for (i = 0, l = ancestry.length; i < l; ++i) {
	                            if (matches(ancestry[i], selector.left, ancestry.slice(i + 1))) {
	                                return true;
	                            }
	                        }
	                    }
	                    return false;

	                case 'attribute':
	                    p = getPath(node, selector.name);
	                    switch (selector.operator) {
	                        case null:
	                        case void 0:
	                            return p != null;
	                        case '=':
	                            switch (selector.value.type) {
	                                case 'regexp': return typeof p === 'string' && selector.value.value.test(p);
	                                case 'literal': return '' + selector.value.value === '' + p;
	                                case 'type': return selector.value.value === typeof p;
	                            }
	                        case '!=':
	                            switch (selector.value.type) {
	                                case 'regexp': return !selector.value.value.test(p);
	                                case 'literal': return '' + selector.value.value !== '' + p;
	                                case 'type': return selector.value.value !== typeof p;
	                            }
	                        case '<=': return p <= selector.value.value;
	                        case '<': return p < selector.value.value;
	                        case '>': return p > selector.value.value;
	                        case '>=': return p >= selector.value.value;
	                    }

	                case 'sibling':
	                    return matches(node, selector.right, ancestry) &&
	                        sibling(node, selector.left, ancestry, LEFT_SIDE) ||
	                        selector.left.subject &&
	                        matches(node, selector.left, ancestry) &&
	                        sibling(node, selector.right, ancestry, RIGHT_SIDE);

	                case 'adjacent':
	                    return matches(node, selector.right, ancestry) &&
	                        adjacent(node, selector.left, ancestry, LEFT_SIDE) ||
	                        selector.right.subject &&
	                        matches(node, selector.left, ancestry) &&
	                        adjacent(node, selector.right, ancestry, RIGHT_SIDE);

	                case 'nth-child':
	                    return matches(node, selector.right, ancestry) &&
	                        nthChild(node, ancestry, function (length) {
	                            return selector.index.value - 1;
	                        });

	                case 'nth-last-child':
	                    return matches(node, selector.right, ancestry) &&
	                        nthChild(node, ancestry, function (length) {
	                            return length - selector.index.value;
	                        });

	                case 'class':
	                    if(!node.type) return false;
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
	                            return node.type.slice(0, 8) === 'Function' ||
	                                node.type === 'ArrowFunctionExpression';
	                    }
	                    throw new Error('Unknown class name: ' + selector.name);
	            }

	            throw new Error('Unknown selector type: ' + selector.type);
	        }

	        /*
	         * Determines if the given node has a sibling that matches the given selector.
	         */
	        function sibling(node, selector, ancestry, side) {
	            var parent = ancestry[0], listProp, startIndex, keys, i, l, k, lowerBound, upperBound;
	            if (!parent) { return false; }
	            keys = estraverse$1.VisitorKeys[parent.type];
	            for (i = 0, l = keys.length; i < l; ++i) {
	                listProp = parent[keys[i]];
	                if (isArray(listProp)) {
	                    startIndex = listProp.indexOf(node);
	                    if (startIndex < 0) { continue; }
	                    if (side === LEFT_SIDE) {
	                      lowerBound = 0;
	                      upperBound = startIndex;
	                    } else {
	                      lowerBound = startIndex + 1;
	                      upperBound = listProp.length;
	                    }
	                    for (k = lowerBound; k < upperBound; ++k) {
	                        if (matches(listProp[k], selector, ancestry)) {
	                            return true;
	                        }
	                    }
	                }
	            }
	            return false;
	        }

	        /*
	         * Determines if the given node has an adjacent sibling that matches the given selector.
	         */
	        function adjacent(node, selector, ancestry, side) {
	            var parent = ancestry[0], listProp, keys, i, l, idx;
	            if (!parent) { return false; }
	            keys = estraverse$1.VisitorKeys[parent.type];
	            for (i = 0, l = keys.length; i < l; ++i) {
	                listProp = parent[keys[i]];
	                if (isArray(listProp)) {
	                    idx = listProp.indexOf(node);
	                    if (idx < 0) { continue; }
	                    if (side === LEFT_SIDE && idx > 0 && matches(listProp[idx - 1], selector, ancestry)) {
	                        return true;
	                    }
	                    if (side === RIGHT_SIDE && idx < listProp.length - 1 && matches(listProp[idx + 1], selector, ancestry)) {
	                        return true;
	                    }
	                }
	            }
	            return false;
	        }

	        /*
	         * Determines if the given node is the nth child, determined by idxFn, which is given the containing list's length.
	         */
	        function nthChild(node, ancestry, idxFn) {
	            var parent = ancestry[0], listProp, keys, i, l, idx;
	            if (!parent) { return false; }
	            keys = estraverse$1.VisitorKeys[parent.type];
	            for (i = 0, l = keys.length; i < l; ++i) {
	                listProp = parent[keys[i]];
	                if (isArray(listProp)) {
	                    idx = listProp.indexOf(node);
	                    if (idx >= 0 && idx === idxFn(listProp.length)) { return true; }
	                }
	            }
	            return false;
	        }

	        /*
	         * For each selector node marked as a subject, find the portion of the selector that the subject must match.
	         */
	        function subjects(selector, ancestor) {
	            var results, p;
	            if (selector == null || typeof selector != 'object') { return []; }
	            if (ancestor == null) { ancestor = selector; }
	            results = selector.subject ? [ancestor] : [];
	            for(p in selector) {
	                if(!{}.hasOwnProperty.call(selector, p)) { continue; }
	                [].push.apply(results, subjects(selector[p], p === 'left' ? selector[p] : ancestor));
	            }
	            return results;
	        }

	        /**
	         * From a JS AST and a selector AST, collect all JS AST nodes that match the selector.
	         */
	        function match(ast, selector) {
	            var ancestry = [], results = [], altSubjects, i, l, k, m;
	            if (!selector) { return results; }
	            altSubjects = subjects(selector);
	            estraverse$1.traverse(ast, {
	                enter: function (node, parent) {
	                    if (parent != null) { ancestry.unshift(parent); }
	                    if (matches(node, selector, ancestry)) {
	                        if (altSubjects.length) {
	                            for (i = 0, l = altSubjects.length; i < l; ++i) {
	                                if (matches(node, altSubjects[i], ancestry)) { results.push(node); }
	                                for (k = 0, m = ancestry.length; k < m; ++k) {
	                                    if (matches(ancestry[k], altSubjects[i], ancestry.slice(k + 1))) {
	                                        results.push(ancestry[k]);
	                                    }
	                                }
	                            }
	                        } else {
	                            results.push(node);
	                        }
	                    }
	                },
	                leave: function () { ancestry.shift(); },
	                fallback: 'iteration'
	            });
	            return results;
	        }

	        /**
	         * Parse a selector string and return its AST.
	         */
	        function parse(selector) {
	            return parser$1.parse(selector);
	        }

	        /**
	         * Query the code AST using the selector string.
	         */
	        function query(ast, selector) {
	            return match(ast, parse(selector));
	        }

	        query.parse = parse;
	        query.match = match;
	        query.matches = matches;
	        return query.query = query;
	    }


	    if ( module.exports) {
	        module.exports = esqueryModule();
	    } else {
	        this.esquery = esqueryModule();
	    }

	})();
	});

	return esquery;

})));
