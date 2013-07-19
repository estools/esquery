define([], function () {

// var x = 1;
// var y = "y";

// x = x * 2;

// if (y) {
// 	y += "z";
// }

	return {
	    "type": "Program",
	    "body": [
	        {
	            "type": "VariableDeclaration",
	            "declarations": [
	                {
	                    "type": "VariableDeclarator",
	                    "id": {
	                        "type": "Identifier",
	                        "name": "x"
	                    },
	                    "init": {
	                        "type": "Literal",
	                        "value": 1,
	                        "raw": "1"
	                    }
	                }
	            ],
	            "kind": "var"
	        },
	        {
	            "type": "VariableDeclaration",
	            "declarations": [
	                {
	                    "type": "VariableDeclarator",
	                    "id": {
	                        "type": "Identifier",
	                        "name": "y"
	                    },
	                    "init": {
	                        "type": "Literal",
	                        "value": "y",
	                        "raw": "\"y\""
	                    }
	                }
	            ],
	            "kind": "var"
	        },
	        {
	            "type": "ExpressionStatement",
	            "expression": {
	                "type": "AssignmentExpression",
	                "operator": "=",
	                "left": {
	                    "type": "Identifier",
	                    "name": "x"
	                },
	                "right": {
	                    "type": "BinaryExpression",
	                    "operator": "*",
	                    "left": {
	                        "type": "Identifier",
	                        "name": "x"
	                    },
	                    "right": {
	                        "type": "Literal",
	                        "value": 2,
	                        "raw": "2"
	                    }
	                }
	            }
	        },
	        {
	            "type": "IfStatement",
	            "test": {
	                "type": "Identifier",
	                "name": "y"
	            },
	            "consequent": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "AssignmentExpression",
	                            "operator": "+=",
	                            "left": {
	                                "type": "Identifier",
	                                "name": "y"
	                            },
	                            "right": {
	                                "type": "Literal",
	                                "value": "z",
	                                "raw": "\"z\""
	                            }
	                        }
	                    }
	                ]
	            },
	            "alternate": null
	        }
	    ]
	};
});