define([], function () {

// function foo(x, y) {
// 	var z = x + y;
// 	z++;
// 	return z;
// }


	return {
	    "type": "Program",
	    "body": [
	        {
	            "type": "FunctionDeclaration",
	            "id": {
	                "type": "Identifier",
	                "name": "foo"
	            },
	            "params": [
	                {
	                    "type": "Identifier",
	                    "name": "x"
	                },
	                {
	                    "type": "Identifier",
	                    "name": "y"
	                }
	            ],
	            "defaults": [],
	            "body": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "VariableDeclaration",
	                        "declarations": [
	                            {
	                                "type": "VariableDeclarator",
	                                "id": {
	                                    "type": "Identifier",
	                                    "name": "z"
	                                },
	                                "init": {
	                                    "type": "BinaryExpression",
	                                    "operator": "+",
	                                    "left": {
	                                        "type": "Identifier",
	                                        "name": "x"
	                                    },
	                                    "right": {
	                                        "type": "Identifier",
	                                        "name": "y"
	                                    }
	                                }
	                            }
	                        ],
	                        "kind": "var"
	                    },
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "UpdateExpression",
	                            "operator": "++",
	                            "argument": {
	                                "type": "Identifier",
	                                "name": "z"
	                            },
	                            "prefix": false
	                        }
	                    },
	                    {
	                        "type": "ReturnStatement",
	                        "argument": {
	                            "type": "Identifier",
	                            "name": "z"
	                        }
	                    }
	                ]
	            },
	            "rest": null,
	            "generator": false,
	            "expression": false
	        }
	    ]
	};
});