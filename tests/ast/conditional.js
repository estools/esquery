define([], function () {

// if (x === 1) {
//  foo();
// } else {
// 	x = 2;
// }

// if (x == "test" && true || x) {
// 	y = -1;
// } else if (false) {
// 	y = 1;
// }

	return {
	    "type": "Program",
	    "body": [
	        {
	            "type": "IfStatement",
	            "test": {
	                "type": "BinaryExpression",
	                "operator": "===",
	                "left": {
	                    "type": "Identifier",
	                    "name": "x"
	                },
	                "right": {
	                    "type": "Literal",
	                    "value": 1,
	                    "raw": "1"
	                }
	            },
	            "consequent": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "CallExpression",
	                            "callee": {
	                                "type": "Identifier",
	                                "name": "foo"
	                            },
	                            "arguments": []
	                        }
	                    }
	                ]
	            },
	            "alternate": {
	                "type": "BlockStatement",
	                "body": [
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
	                                "type": "Literal",
	                                "value": 2,
	                                "raw": "2"
	                            }
	                        }
	                    }
	                ]
	            }
	        },
	        {
	            "type": "IfStatement",
	            "test": {
	                "type": "LogicalExpression",
	                "operator": "||",
	                "left": {
	                    "type": "LogicalExpression",
	                    "operator": "&&",
	                    "left": {
	                        "type": "BinaryExpression",
	                        "operator": "==",
	                        "left": {
	                            "type": "Identifier",
	                            "name": "x"
	                        },
	                        "right": {
	                            "type": "Literal",
	                            "value": "test",
	                            "raw": "\"test\""
	                        }
	                    },
	                    "right": {
	                        "type": "Literal",
	                        "value": true,
	                        "raw": "true"
	                    }
	                },
	                "right": {
	                    "type": "Identifier",
	                    "name": "x"
	                }
	            },
	            "consequent": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "AssignmentExpression",
	                            "operator": "=",
	                            "left": {
	                                "type": "Identifier",
	                                "name": "y"
	                            },
	                            "right": {
	                                "type": "UnaryExpression",
	                                "operator": "-",
	                                "argument": {
	                                    "type": "Literal",
	                                    "value": 1,
	                                    "raw": "1"
	                                },
	                                "prefix": true
	                            }
	                        }
	                    }
	                ]
	            },
	            "alternate": {
	                "type": "IfStatement",
	                "test": {
	                    "type": "Literal",
	                    "value": false,
	                    "raw": "false"
	                },
	                "consequent": {
	                    "type": "BlockStatement",
	                    "body": [
	                        {
	                            "type": "ExpressionStatement",
	                            "expression": {
	                                "type": "AssignmentExpression",
	                                "operator": "=",
	                                "left": {
	                                    "type": "Identifier",
	                                    "name": "y"
	                                },
	                                "right": {
	                                    "type": "Literal",
	                                    "value": 1,
	                                    "raw": "1"
	                                }
	                            }
	                        }
	                    ]
	                },
	                "alternate": null
	            }
	        }
	    ]
	};
});