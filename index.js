/* globals espree, esquery */
var sourceNode = document.getElementById("source");
var selectorNode = document.getElementById("selector");
var selectorAstNode = document.getElementById("selectorAst");
var outputNode = document.getElementById("output");

function update() {
var ast = espree.parse(sourceNode.value);

var selector = selectorNode.value;
selectorAstNode.innerHTML = "";
outputNode.innerHTML = "";

var start, end, selectorAst, selectorAstOutput, matches, matchesOutput;

try {
  start = performance.now();
} catch (e) {
  start = Date.now();
}

try {
    selectorAst = esquery.parse(selector);
} catch (e) {
    selectorAstOutput = e.message;
}

try {
    matches = esquery.match(ast, selectorAst);
} catch (e) {
    matchesOutput = e.message;
}

try {
  end = performance.now();
} catch (e) {
  end = Date.now();
}

selectorAstOutput = selectorAstOutput || JSON.stringify(selectorAst, null, "  ");
matchesOutput = matchesOutput || JSON.stringify(matches, null, "  ");

selectorAstNode.appendChild(document.createTextNode(selectorAstOutput));
outputNode.appendChild(document.createTextNode((matches ? matches.length : 0) +
        " nodes found in " + (end - start) + "ms\n" + matchesOutput));
}

update();

sourceNode.addEventListener("change", update);
selectorNode.addEventListener("change", update);
selectorNode.addEventListener("keyup", update);
outputNode.addEventListener("change", update);
