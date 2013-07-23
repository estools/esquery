ESQuery is a library for querying the AST output by Esprima for patterns of syntax using a CSS style selector system. Check out the demo:

[demo](http://jrfeenst.github.io/esquery/demo.html)

The following selectors are supported:
* AST node type: ForStatement
* Wildcard: *
* Node attribute existence: [attr]
* Node attribute value: [attr="foo"] or [attr=123]
* Nested node attribute: [attr.level2="foo"]
* First or last child: :first-child or :last-child
* nth-child from beginning (not same as css, zero based index): :nth-child(2)
* nth-child from end (negative args, -1 === last element): :nth-child(-1)
* descendant: ancestor descendant
* child: parent > child
* sibling: firstElement ~ sibling
* adjacent: firstElement + adjacent

[![Build Status](https://travis-ci.org/jrfeenst/esquery.png?branch=master)](https://travis-ci.org/jrfeenst/esquery)