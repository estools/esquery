PEGJS = node_modules/.bin/pegjs --cache --export-var 'var result'

parser.js: grammar.pegjs
	$(PEGJS) <"$<" >"$@"
	@echo 'if (typeof define === "function" && define.amd) { define(function(){ return result; }); } else if (typeof module !== "undefined" && module.exports) { module.exports = result; } else { this.esquery = result; }' >> "$@"
