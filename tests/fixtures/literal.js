import * as esprima from "esprima";

var parsed = esprima.parse(
    "var y = '\b\f\\n\\r\t\v and just a  back\\slash';\n" +
    "var x = 21.35;" +
    "var z = '\\z';" +
    "var a = 'abc\\z';"
);

export default parsed;
