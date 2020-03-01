import * as espree from "espree";

var parsed = espree.parse(
    "var x = 1;\n" +
    "switch (x) {\n" +
    "  case 0: foo1(); break;\n" +
    "  case 1: foo2(); break;\n" +
    "  default: x = 1; break;\n" +
    "}\n"
);

export default parsed;
