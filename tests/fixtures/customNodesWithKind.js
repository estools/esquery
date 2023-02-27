export default {
    kind: 'CustomRoot',
    list: [
        {
            kind: 'CustomChild',
            name: 'one',
            sublist: [{ kind: 'CustomGrandChild' }],
        },
        {
            kind: 'CustomChild',
            name: 'two',
            sublist: [],
        },
        {
            kind: 'CustomChild',
            name: 'three',
            sublist: [
                { kind: 'CustomGrandChild' },
                { kind: 'CustomGrandChild' },
            ],
        },
        {
            kind: 'CustomChild',
            name: 'four',
            sublist: [
                { kind: 'CustomGrandChild' },
                { kind: 'CustomGrandChild' },
                { kind: 'CustomGrandChild' },
            ],
        },
        {
            kind: 'CustomExpression'
        },
        {
            kind: 'CustomStatement'
        }
    ],
};
