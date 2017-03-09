define(["esprima"], function (esprima) {

    return esprima.parse(
        '[1, 2, 3, foo, bar, 4, 5, baz, qux, 6]'
    );

});
