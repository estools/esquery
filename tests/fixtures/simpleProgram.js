import * as espree from "espree";

var parsed = espree.parse(
    "var x = 1;\n" +
    "var y = 'y';\n" +
    "x = x * 2;\n" +
    "if (y) { y += 'z'; }\n"
);

export default parsed;
