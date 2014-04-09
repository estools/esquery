define(["esprima"], function (esprima) {

    return esprima.parse(
        "var x = 1;\n" +
        "var y = 'y';\n" +
        "x = x * 2;\n" +
        "if (y) { y += 'z'; }\n"
    );

});
