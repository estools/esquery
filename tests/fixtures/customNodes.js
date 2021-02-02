export default {
    type: 'CustomRoot',
    list: [
        {
            type: 'CustomChild',
            name: 'one',
            sublist: [{ type: 'CustomGrandChild' }],
        },
        {
            type: 'CustomChild',
            name: 'two',
            sublist: [],
        },
        {
            type: 'CustomChild',
            name: 'three',
            sublist: [
                { type: 'CustomGrandChild' },
                { type: 'CustomGrandChild' },
            ],
        },
        {
            type: 'CustomChild',
            name: 'four',
            sublist: [
                { type: 'CustomGrandChild' },
                { type: 'CustomGrandChild' },
                { type: 'CustomGrandChild' },
            ],
        },
    ],
};
