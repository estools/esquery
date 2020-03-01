import * as espree from "espree";

var parsed = espree.parse(
    "x = 10;\n" +
    "while (x > 0) { x--; }"
);

export default parsed;
