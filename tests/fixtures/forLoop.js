define(["esprima"], function (esprima) {

    return esprima.parse("for (i = 0; i < foo.length; i++) { foo[i](); }");

});
