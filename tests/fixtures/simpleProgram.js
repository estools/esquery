import * as esprima from "esprima";

var parsed = esprima.parse(
    "var x = 1;\n" +
    "var y = 'y';\n" +
    "x = x * 2;\n" +
    "if (y) { y += 'z'; }\n"
);

export default parsed;
