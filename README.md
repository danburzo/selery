# selery

A small, handwritten CSS selector parser. **Currently a work-in-progress.**

## Installation

```bash
npm install selery
```

## API

#### selery.**tokenize**(_selector_)

Takes a string _selector_ and returns an array of tokens.

```js
let { tokenize } = require('selery');

tokenize('article a[href="#"]');
```

A token is a plain object having a `type` property whose value is one of: `ident`, `function`, `at-keyword`, `hash`, `string`, `delim`, `whitespace`, `colon`, `semicolon`, `comma`, `[`, `]`, `(`, `)`, `{`, or `}`. Some tokens also contain a `value` property, which holds extra information.

For the sample code above, the resulting token array is:

```js
[
	{ type: 'ident', value: 'article' },
	{ type: 'whitespace' },
	{ type: 'ident', value: 'a' },
	{ type: '[' },
	{ type: 'ident', value: 'href' },
	{ type: 'delim', value: '=' },
	{ type: 'string', value: '#' },
	{ type: ']' }
];
```

The function will throw an erorr if the selector supplied does not follow generally valid CSS syntax.

#### selery.**parse**(_input_, _options_)

Accepts an _input_ argument, which can be either an array of tokens obtained from the `tokenize()` function or, more conveniently, a string representing a selector. The latter is passed through `tokenize()` internally.

```js
let { parse } = require('selery');

let tree = parse('div > span:nth-child(3)');
```

## CSS Selector AST

All nodes in the AST contain a `type` property, and additional properties for each specific type, listed below.

#### `SelectorList`

The topmost node in the AST.

- `selectors` — an array of (possibly complex) selectors.

#### `ComplexSelector`

A complex selector represents a pair of selectors stringed together with combinators, such as `article > p`.

- `left` — the left-side (possibly complex, or compound) selector;
- `right` — the right-side (possibly complex, compound) selector;
- `combinator` — one of ` `, `>`, `~`, `+`, `||`.

Longer sequences of selectors are represented with nested `ComplexSelector` elements in the AST. For example, `article > p span` is represented as:

```js
{
	type: 'SelectorList',
	selectors: [{
		type: 'ComplexSelector',
		combinator: '>',
		left: {
			type: 'TypeSelector',
			identifier: 'article'
		},
		right: {
			type: 'ComplexSelector',
			combinator: ' ',
			left: {
				type: 'TypeSelector',
				identifier: 'p'
			},
			right: {
				type: 'TypeSelector',
				identifier: 'span'
			}
		}
	}]
}
```

#### `CompoundSelector`

A compound selector is a combination of simple selectors, all of which impose conditions on a single element, such as `a.external[href$=".pdf"]`.

- `selectors` — an array of simple selectors.

#### `TypeSelector`

Represents a type selector, such as `article`.

- `identifier` (String) — the element type to match; can be `*` in the case of the universal selector;
- `namespace` (String) — the namespace, if provided with the `namespace|type` syntax; an empty string corresponds to the `|type` syntax.

#### `IdSelector`

Represents an ID selector, such as `#main`.

- `identifier` (String) — the ID to match;

#### `ClassSelector`

Represents a class selector, such as `.primary`.

- `identifier` (String) — the class name to match;

#### `AttributeSelector`

Represents an [attribute selector](https://drafts.csswg.org/selectors/#attribute-selectors), such as `[href^="http"]`.

- `identifier` (String) — the attribute to match;
- `value` (String) — the value to match against;
- `matcher` (String) — one of `=`, `^=`, `$=`, `*=`, `~=`, `|=`;
- `flag` (String) — either `s` or `i`, if any.

#### `PseudoClassSelector`

Represents a pseudo-class selector, such as `:is(a, b, c)`. The arguments to most pseudo-classes expressed as functions have their own microsyntax. Others, such as `:where()`, `:is()`, `:not()` and `:has()`, take a selector list as their argument.

- `identifier` (String) — the pseudo-class;
- `argument` (String) — the argument to a pseudo-class expressed as function;
- `selectors` (Array) — pseudo-classes accepting a list of selectors have this property instead of the `argument` string.

#### `PseudoElementSelector`

Represents a pseudo-element selector, such as `::before` or `::after`.

- `identifier` (String) — the pseudo-element.

Note: for legacy reasons, the `::before`, `::after`, `::first-line` and `::first-letter` pseudo-elements can also be prefixed with a single `:` character.

## Goals

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) and [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/) specifications;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.

## See also

- [qsx](https://github.com/danburzo/qsx) and [hred](https://github.com/danburzo.hred)
- [parsel](https://github.com/LeaVerou/parsel)
- [scalpel](https://github.com/gajus/scalpel)
- [csstree](https://github.com/csstree/csstree)
