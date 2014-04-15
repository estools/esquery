define(["esprima"], function (esprima) {

    return esprima.parse(
        "x = 10;\n" +
        "while (x > 0) { x--; }"
    );

});
