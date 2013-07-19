define([], function () {

// function foo() {
// 	var x = 1;
// 	function bar() {
// 		x = 2;
// 	}
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
	            "params": [],
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
	                        "type": "FunctionDeclaration",
	                        "id": {
	                            "type": "Identifier",
	                            "name": "bar"
	                        },
	                        "params": [],
	                        "defaults": [],
	                        "body": {
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
	                        },
	                        "rest": null,
	                        "generator": false,
	                        "expression": false
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