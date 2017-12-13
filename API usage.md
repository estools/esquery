## API and usage

*Install (via npm for Node.js)*

`npm install esquery --save`

*Quick start*

```js
const esquery = require('esquery');

const conditional = 'if (x === 1) { foo(); } else { x = 2; }'

var matches = esquery(conditional, '[name='x']')
console.log(matches);
```

The following examples are taken from the test cases in `/tests` folder.

### Attribute query

*for loop*

`for (i = 0; i < foo.length; i++) { foo[i](); }`

- `[operator="="]` - matches `i = 0`
- `[object.name="foo"]` - object named `foo` ie. `foo.length`
- `[name=/i|foo/]` - where name of node matches `i` or `foo`

*simple function*

```js
function foo(x, y) {
  var z = x + y;
  z++;
  return z;
}
```

- `[kind="var"]` - a `var`
- `[id.name="foo"]` - `foo` declaration, fx a function or variable
- `[left]` - left expression, such as `var z`
- `FunctionDeclaration[params.0.name=x]` - where first argument of function is named `x`

*simple program*

```js
var x = 1;
var y = 'y';
x = x * 2;
if (y) { y += 'z'; }
```

- `[body]` - full body, such as function/scope body
- `[body.length<2]` - body has less than 2 nodes
- `[body.length>1]` - body has more than 1 node
- `[body.length<=2]` - body has 2 or less nodes
- `[body.length>=1]` - body has 1 or more nodes
- `[name=/[asdfy]/]` - name matches the characters `asdfy`

*conditional*

```js
if (x === 1) { foo(); } else { x = 2; }
if (x == 'test' && true || x) { y = -1; } else if (false) { y = 1; }
```

- `[name="x"]` - node named `x`
- `[name!="x"]` - node not named `x`
- `[name=/x|foo/]` - node matches `x` or `foo`
- `[name!=/x|y/]` - node does not match `x` or `y`
- `[callee.name="foo"]` - Where `callee` is named `foo` (ie. function call)
- `[operator]` - That is any type of operator (such as `==`, `||` etc)
- `[prefix=true]` - node that has `prefix` set to true, such as `++c`
- `[test=type(object)]` - where subject of condition is an object, such as `x` in `|| x`
- `[value=type(boolean)]` - where value is a boolean, such
as `&& true`

Example: `prefix`

AST node representing unary operators such as `++`, `~`, `typeof` and `delete`"

`++c` has `prefix: true` and `c++` has `prefix: false`

```js
interface UnaryExpression <: Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}
```

### Classes

`:statement` - a statement
`:expression` - an expression
`:function` - a function
`:declaration` - a declaration
`:pattern` - a pattern

Examples:

`[name="x"]:function` - function named `x`
`[name="foo"]:declaration` - declaration named `foo`

## Combinators

- descendant selector (` ` space)
- child selector (`>`)
- adjacent sibling selector (`+`)
- general sibling selector (`~`)

Please see [ESTree specification](https://github.com/estree/estree) and [CSS selectors spec](https://www.w3.org/TR/css3-selectors/)

`IfStatement > BinaryExpression` - [binary expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators) fx `3+4;` or `x*y;`

A `BinaryExpression` nested directly within an `IfStatement`

Valid: `if (2 === 2)`

`IfStatement > BinaryExpression > Identifier`

Valid: `if (x === 2)`

`IfStatement BinaryExpression`

A binary expression nested arbitrarily deeply within an `if` statement.

`VariableDeclaration ~ IfStatement`

`if` statement with sibling `var` declaration. The `if` statement is the target.

Valid: siblings of same body
```js
var x = 1;
if (x === 2)
```

`VariableDeclaration + ExpressionStatement`

Valid: variable declaration followed by next sibling which is an expression statement (see [javascript statements and declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements))

```js
var y = 'y';
x = x * 2;
```

*Shorthands*

There are also shorthands such as:

`@If > @Binary` equivalent to `IfStatement > BinaryExpression`

See `translateInput` function in `parser.js` for the full list of supported shorthands and translations.

- `@If`: `IfExpression`
- `@Id`: `Identifier`
- `@Var`: `VariableDeclaration`
- `@Expr`
- `@Member`
- `@Return`
- `@Block`
- `@ForIn`
- `@ForOf`
- `@For`
- `@Empty`
- `@Labeled`
- `@Break`
- `@Continue`
- `@Switch`
- `@Throw`
- `@Try`
- `@While`
- `@DoWhile`
- `@Let`
- `@This`
- `@Array`
- `@Object`
- `@FunDecl`
- `@Fun`
- `@Arrow`
- `@Seq`
- `@Cond`
- `@New`
- `@Member`
- `@Yield`
- `@Gen`
- `@UnaryOp`
- `@Unary`
- `@BinaryOp`
- `@Binary`
- `@LogicalOp`
- `@Logical`
- `@AssignOp`
- `@Assign`

### Compound

`[left.name="x"][right.value=1]` - where the left side is a node name `x` and the right has the value `1`

Valid: `x = 1`

`[left.name="x"]:matches(*)` any type of node where the left side is named `x`

### Descendant

`Program IfStatement` - Any program with an `if` statement

`Identifier[name=x]` - identified named `x` such as `const x`. Identifiers are used to name variables and functions and to provide labels for certain loops...

`Identifier [name=x]` - any identifier with named `x`, such as `const x`

`BinaryExpression [name=x]` a binary expression where one side is named `x`, such as `x !== 3`

`AssignmentExpression [name=x]` an assignment where one side is named `x`, such as `x = 2` or `y = x`

### Fields

You can also query on the [ESTree API](https://github.com/estree/estree) fields directly

Example:

```js
interface IfStatement <: Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}
```

`.test` - node (object) that has a `test` field set
`.declarations.init` - node that has `.declarations.init` set

`init` means initialised, such as `var x = 1`, where `x` is initialised to value `1`

```js
interface VariableDeclaration <: Declaration {
    type: "VariableDeclaration";
    declarations: [ VariableDeclarator ];
    kind: "var" | "let" | "const";
}

interface VariableDeclarator <: Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}
```

### :has

`ExpressionStatement:has([name="foo"][type="Identifier"])`

Valid: `const foo = 2`

### Matches

`,` means OR (ie. any of)

- `:matches(IfStatement)`
- `:matches(BinaryExpression, MemberExpression)`
- `:matches([name="foo"], ReturnStatement)`
- `:matches(AssignmentExpression, BinaryExpression)`
- `AssignmentExpression, BinaryExpression, NonExistant`

### Not

- `:not(Literal)` not a literal
- `:not([name="x"])` not a node named `x`
- `:not(*)` - not anything!
- `:not(Identifier, IfStatement)`
- `:not([value=1])` not a node set to value of `1`

### Pseudo child

`:first-child` - first child node
`:last-child` - last child node
`:nth-child(2)` - 2nd child
`:nth-last-child(2)` - 2nd last child

### Subject

`!IfStatement Identifier` - any `if` statement with one or more nested `Identifier`, such as `const x = 3` but not `if (x == 2)`

`!* > [name="foo"]` all nodes but those where the immediate child is a node named `foo`

### Types

- `LogicalExpression`
- `ForStatement`
- `FunctionDeclaration`
- `ReturnStatement`
- `AssignmentExpression`
