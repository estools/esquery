default: parser

PEGJS = node_modules/.bin/pegjs --cache --export-var 'var result'
CJSIFY = node_modules/.bin/cjsify

parser: parser.js
browser: dist/esquery.min.js

parser.js: grammar.pegjs
	$(PEGJS) <"$<" >"$@"
	@echo 'if (typeof define === "function" && define.amd) { define(function(){ return result; }); } else if (typeof module !== "undefined" && module.exports) { module.exports = result; } else { this.esquery = result; }' >> "$@"

dist/esquery.min.js: esquery.js parser.js
	@mkdir -p "$(@D)"
	$(CJSIFY) esquery.js -mvx esquery --source-map "$@.map" > "$@"
