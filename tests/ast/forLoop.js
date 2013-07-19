define([], function () {

// for (i = 0; i < foo.length; i++) {
// 	foo[i]();
// }

	return {
	    "type": "Program",
	    "body": [
	        {
	            "type": "ForStatement",
	            "init": {
	                "type": "AssignmentExpression",
	                "operator": "=",
	                "left": {
	                    "type": "Identifier",
	                    "name": "i"
	                },
	                "right": {
	                    "type": "Literal",
	                    "value": 0,
	                    "raw": "0"
	                }
	            },
	            "test": {
	                "type": "BinaryExpression",
	                "operator": "<",
	                "left": {
	                    "type": "Identifier",
	                    "name": "i"
	                },
	                "right": {
	                    "type": "MemberExpression",
	                    "computed": false,
	                    "object": {
	                        "type": "Identifier",
	                        "name": "foo"
	                    },
	                    "property": {
	                        "type": "Identifier",
	                        "name": "length"
	                    }
	                }
	            },
	            "update": {
	                "type": "UpdateExpression",
	                "operator": "++",
	                "argument": {
	                    "type": "Identifier",
	                    "name": "i"
	                },
	                "prefix": false
	            },
	            "body": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "CallExpression",
	                            "callee": {
	                                "type": "MemberExpression",
	                                "computed": true,
	                                "object": {
	                                    "type": "Identifier",
	                                    "name": "foo"
	                                },
	                                "property": {
	                                    "type": "Identifier",
	                                    "name": "i"
	                                }
	                            },
	                            "arguments": []
	                        }
	                    }
	                ]
	            }
	        }
	    ]
	};
});