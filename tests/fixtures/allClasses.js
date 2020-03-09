export default {
    type: 'Program',
    body: [
        {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'a'
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left: {
                                type: 'ArrayPattern',
                                elements: [
                                    {
                                        type: 'Identifier',
                                        name: 'a'
                                    }
                                ]
                            },
                            right: {
                                type: 'ArrowFunctionExpression',
                                params: [],
                                defaults: [],
                                rest: null,
                                body: {
                                    type: 'Literal',
                                    value: 0,
                                    raw: '0'
                                },
                                generator: false,
                                expression: false
                            }
                        }
                    },
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'MetaProperty',
                            meta: {
                                type: 'Identifier',
                                name: 'new',
                            },
                            property: {
                                type: 'Identifier',
                                name: 'target',
                            },
                        },
                    },
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'TemplateLiteral',
                            quasis: [
                                {
                                    type: 'TemplateElement',
                                    value: {
                                        raw: 'test',
                                        cooked: 'test'
                                    },
                                    tail: true,
                                }
                            ],
                            expressions: [],
                        },
                    },
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'TemplateLiteral',
                            quasis: [
                                {
                                    type: 'TemplateElement',
                                    value: {
                                        raw: 'hello,',
                                        cooked: 'hello,'
                                    },
                                    tail: false,
                                },
                                {
                                    type: 'TemplateElement',
                                    value: {
                                        raw: '',
                                        cooked: ''
                                    },
                                    tail: true,
                                }
                            ],
                            expressions: [
                                {
                                    type: 'Identifier',
                                    name: 'name',
                                }
                            ],
                        },
                    }
                ]
            },
            rest: null,
            generator: false,
            expression: false
        }
    ]
};
