import * as espree from "espree";

var parsed = espree.parse(
    "function foo(x, y) {\n" +
    "  var z = x + y;\n" +
    "  z++;\n" +
    "  return z;\n" +
    "}\n"
);

export default parsed;
