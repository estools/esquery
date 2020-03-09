import * as esprima from "esprima";

var parsed = esprima.parse(
    "function foo(x, y) {\n" +
    "  var z = x + y;\n" +
    "  z++;\n" +
    "  return z;\n" +
    "}\n"
);

export default parsed;
