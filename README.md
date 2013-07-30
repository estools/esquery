ESQuery is a library for querying the AST output by Esprima for patterns of syntax using a CSS style selector system. Check out the demo:

[demo](http://jrfeenst.github.io/esquery/demo.html)

The following selectors are supported:
* AST node type: `ForStatement`
* Wildcard: `*`
* Node attribute existence: `[attr]`
* Node attribute value: `[attr="foo"]` or `[attr=123]`
* Node attribute regex: `[attr=/foo.*/]`
* Node attribute conditons: `[attr!="foo"]`, `[attr>2]`, `[attr<3]`, `[attr>=2]`, or `[attr<=3]` 
* Nested node attribute: `[attr.level2="foo"]`
* First or last child: `:first-child` or `:last-child`
* nth-child from beginning (1 based index, no ax+b support): `:nth-child(2)`
* nth-last-child from end (1 based index, no ax+b support): `:nth-last-child(1)`
* descendant: `ancestor descendant`
* child: `parent > child`
* sibling: `node ~ sibling`
* adjacent: `node + adjacent`
* Negation: `:not(ForStatement)`
* Matches any pseudo selector: `:matches([attr] > :first-child, :last-child)`
* Selector subject (like css4, postfix only): `IfStatement! > [name="foo"]`

[![Build Status](https://travis-ci.org/jrfeenst/esquery.png?branch=master)](https://travis-ci.org/jrfeenst/esquery)