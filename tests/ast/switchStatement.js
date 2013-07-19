define([], function () {

// var x = 1;
// switch (x) {
// case 0:
// 	foo1();
// 	break;
// case 1:
// 	foo2();
// 	break;
// default:
// 	x = 1;
// 	break;
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
	            "type": "SwitchStatement",
	            "discriminant": {
	                "type": "Identifier",
	                "name": "x"
	            },
	            "cases": [
	                {
	                    "type": "SwitchCase",
	                    "test": {
	                        "type": "Literal",
	                        "value": 0,
	                        "raw": "0"
	                    },
	                    "consequent": [
	                        {
	                            "type": "ExpressionStatement",
	                            "expression": {
	                                "type": "CallExpression",
	                                "callee": {
	                                    "type": "Identifier",
	                                    "name": "foo1"
	                                },
	                                "arguments": []
	                            }
	                        },
	                        {
	                            "type": "BreakStatement",
	                            "label": null
	                        }
	                    ]
	                },
	                {
	                    "type": "SwitchCase",
	                    "test": {
	                        "type": "Literal",
	                        "value": 1,
	                        "raw": "1"
	                    },
	                    "consequent": [
	                        {
	                            "type": "ExpressionStatement",
	                            "expression": {
	                                "type": "CallExpression",
	                                "callee": {
	                                    "type": "Identifier",
	                                    "name": "foo2"
	                                },
	                                "arguments": []
	                            }
	                        },
	                        {
	                            "type": "BreakStatement",
	                            "label": null
	                        }
	                    ]
	                },
	                {
	                    "type": "SwitchCase",
	                    "test": null,
	                    "consequent": [
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
	                                    "value": 1,
	                                    "raw": "1"
	                                }
	                            }
	                        },
	                        {
	                            "type": "BreakStatement",
	                            "label": null
	                        }
	                    ]
	                }
	            ]
	        }
	    ]
	};
});