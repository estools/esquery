import * as espree from "espree";

var parsed = espree.parse(
    "if (x === 1) { foo(); } else { x = 2; }\n" +
    "if (x == 'test' && true || x) { y = -1; } else if (false) { y = 1; }"
);

export default parsed;
