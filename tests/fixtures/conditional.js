define(["esprima"], function (esprima) {

    return esprima.parse(
        "if (x === 1) { foo(); } else { x = 2; }\n" +
        "if (x == 'test' && true || x) { y = -1; } else if (false) { y = 1; }"
    );

});
