import * as espree from "espree";

var parsed = espree.parse("for (i = 0; i < foo.length; i++) { foo[i](); }");

export default parsed;
