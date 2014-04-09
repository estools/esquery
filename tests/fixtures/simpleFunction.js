define(["esprima"], function (esprima) {

    return esprima.parse(
        "function foo(x, y) {\n" +
        "  var z = x + y;\n" +
        "  z++;\n" +
        "  return z;\n" +
        "}\n"
    );

});
