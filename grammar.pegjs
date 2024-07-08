{
  function nth(n) { return { type: 'nth-child', index: { type: 'literal', value: n } }; }
  function nthLast(n) { return { type: 'nth-last-child', index: { type: 'literal', value: n } }; }
  function strUnescape(s) {
    return s.replace(/\\(.)/g, function(match, ch) {
      switch(ch) {
        case 'b': return '\b';
        case 'f': return '\f';
        case 'n': return '\n';
        case 'r': return '\r';
        case 't': return '\t';
        case 'v': return '\v';
        default: return ch;
      }
    });
  }
}

start
  = _ ss:selectors _ {
    return ss.length === 1 ? ss[0] : { type: 'matches', selectors: ss };
  }
  / _ { return void 0; }

_ = " "*
identifierName = i:[^ [\],():#!=><~+.]+ { return i.join(''); }
binaryOp
  = _ ">" _ { return 'child'; }
  / _ "~" _ { return 'sibling'; }
  / _ "+" _ { return 'adjacent'; }
  / " " _ { return 'descendant'; }

hasSelectors = s:hasSelector ss:(_ "," _ hasSelector)* {
  return [s].concat(ss.map(function (s) { return s[3]; }));
}

selectors = s:selector ss:(_ "," _ selector)* {
  return [s].concat(ss.map(function (s) { return s[3]; }));
}


hasSelector
  = op:binaryOp? s:selector {
    if (!op) return s;
    return { type: op, left: { type: 'exactNode' }, right: s };
  }

selector
  = a:sequence ops:(binaryOp sequence)* {
    return ops.reduce(function (memo, rhs) {
      return { type: rhs[0], left: memo, right: rhs[1] };
    }, a);
  }

sequence
  = subject:"!"? as:atom+ {
    const b = as.length === 1 ? as[0] : { type: 'compound', selectors: as };
    if(subject) b.subject = true;
    return b;
  }

atom
  = wildcard / identifier / attr / field / negation / matches
  / has / firstChild / lastChild / nthChild / nthLastChild / class

wildcard = a:"*" { return { type: 'wildcard', value: a }; }
identifier = "#"? i:identifierName { return { type: 'identifier', value: i }; }

attr
  = "[" _ v:attrValue _ "]" { return v; }
  attrOps = a:[><!]? "=" { return (a || '') + '='; } / [><]
  attrEqOps = a:"!"? "="  { return (a || '') + '='; }
  attrName = a:identifierName as:("." identifierName)* {
    return [].concat.apply([a], as).join('');
  }
  attrValue
    = name:attrName _ op:attrEqOps _ value:(type / regex) {
      return { type: 'attribute', name: name, operator: op, value: value };
    }
    / name:attrName _ op:attrOps _ value:(string / number / path) {
      return { type: 'attribute', name: name, operator: op, value: value };
    }
    / name:attrName { return { type: 'attribute', name: name }; }
    string
      = "\"" d:([^\\"] / a:"\\" b:. { return a + b; })* "\"" {
        return { type: 'literal', value: strUnescape(d.join('')) };
      }
      / "'" d:([^\\'] / a:"\\" b:. { return a + b; })* "'" {
        return { type: 'literal', value: strUnescape(d.join('')) };
      }
    number
      = a:([0-9]* ".")? b:[0-9]+ {
        // Can use `a.flat().join('')` once supported
        const leadingDecimals = a ? [].concat.apply([], a).join('') : '';
        return { type: 'literal', value: parseFloat(leadingDecimals + b.join('')) };
      }
    path = i:identifierName { return { type: 'literal', value: i }; }
    type = "type(" _ t:[^ )]+ _ ")" { return { type: 'type', value: t.join('') }; }
    flags = [imsu]+
    regex = "/" d:[^/]+ "/" flgs:flags? { return {
      type: 'regexp', value: new RegExp(d.join(''), flgs ? flgs.join('') : '') };
    }

field = "." i:identifierName is:("." identifierName)* {
  return { type: 'field', name: is.reduce(function(memo, p){ return memo + p[0] + p[1]; }, i)};
}

negation = ":not(" _ ss:selectors _ ")" { return { type: 'not', selectors: ss }; }
matches = ":matches(" _ ss:selectors _ ")" { return { type: 'matches', selectors: ss }; }
has = ":has(" _ ss:hasSelectors _ ")" { return { type: 'has', selectors: ss }; }

firstChild = ":first-child" { return nth(1); }
lastChild = ":last-child" { return nthLast(1); }
nthChild = ":nth-child(" _ n:[0-9]+ _ ")" { return nth(parseInt(n.join(''), 10)); }
nthLastChild = ":nth-last-child(" _ n:[0-9]+ _ ")" { return nthLast(parseInt(n.join(''), 10)); }


class = ":" c:identifierName {
  return { type: 'class', name: c };
}
