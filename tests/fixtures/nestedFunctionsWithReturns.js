define(["esprima"], function (esprima) {

    return esprima.parse(
        "const x = function() {\n" +
        "   function y() {\n" +
        "       return 'bar';\n" +
        "   }\n" +
        "   return 'foo';\n" +
        "};\n"
    );

});
