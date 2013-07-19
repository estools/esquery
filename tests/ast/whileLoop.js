define([], function () {


// x = 10;
// while (x > 0) {
// 	x--;
// }


	return {
	    "type": "Program",
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
	                    "value": 10,
	                    "raw": "10"
	                }
	            }
	        },
	        {
	            "type": "WhileStatement",
	            "test": {
	                "type": "BinaryExpression",
	                "operator": ">",
	                "left": {
	                    "type": "Identifier",
	                    "name": "x"
	                },
	                "right": {
	                    "type": "Literal",
	                    "value": 0,
	                    "raw": "0"
	                }
	            },
	            "body": {
	                "type": "BlockStatement",
	                "body": [
	                    {
	                        "type": "ExpressionStatement",
	                        "expression": {
	                            "type": "UpdateExpression",
	                            "operator": "--",
	                            "argument": {
	                                "type": "Identifier",
	                                "name": "x"
	                            },
	                            "prefix": false
	                        }
	                    }
	                ]
	            }
	        }
	    ]
	};
});