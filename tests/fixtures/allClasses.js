define(["esprima"], function (esprima) {

    // return esprima.parse("function a(){ [a] = () => 0; }");

    return {
        "type": "Program",
        "body": [
            {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": "a"
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "a"
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "ArrowFunctionExpression",
                                    "params": [],
                                    "defaults": [],
                                    "rest": null,
                                    "body": {
                                        "type": "Literal",
                                        "value": 0,
                                        "raw": "0"
                                    },
                                    "generator": false,
                                    "expression": false
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
    };

});
