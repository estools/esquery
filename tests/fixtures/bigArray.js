import * as esprima from "esprima";

var parsed = esprima.parse(
    '[1, 2, 3, foo, bar, 4, 5, baz, qux, 6]'
);

export default parsed;
