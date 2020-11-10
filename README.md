![selery](./.github/selery.svg)

selery is a small, handwritten CSS selector parser. **Currently a work-in-progress.**

- [Goals of the project](#goals-of-the-project)
- [Installation](#installation)
- [API reference](#api-reference)
- [CSS selector AST](#api-reference)
- [See also](#see-also)
- [Colophon](#colophon)

## Goals of the project

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) and [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/) specifications;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.

## Installation

[![selery on npm](https://img.shields.io/npm/v/selery.svg?style=flat-square&labelColor=50B888&color=black)](https://www.npmjs.org/package/selery) [![selery on bundlephobia](https://img.shields.io/bundlephobia/minzip/selery?style=flat-square&labelColor=50B888&color=black)](https://bundlephobia.com/result?p=selery)

```bash
npm install selery
```

## API reference

### Basic methods

#### tokenize(_selector_)

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

#### parse(_input_, _options_)

Accepts an _input_ argument, which can be either an array of tokens obtained from the `tokenize()` function or, more conveniently, a string representing a selector. The latter is passed through `tokenize()` internally.

```js
let { parse } = require('selery');

let tree = parse('div > span:nth-child(3)');
```

Available options:

- _recursive_ (Boolean | Array) — whether to recursively parse the argument to some pseudo-classes and pseudo-elements. The default value is `true`. Pass in an array to add to the set of pseudo-things to recursively parse, beyond the default `[':is', ':where', ':not', '::slotted']`.

#### serialize(_input_)

Converts the input back into a string. The _input_ argument can be either an array of tokens, or an object representing a parse tree.

### DOM API shims

Shims for selector-accepting DOM methods using simpler DOM primitives.

#### matches(_element_, _selector_)

See the [Element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches) DOM method.

#### closest(_element_, _selector_)

See the [Element.closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) DOM method.

#### querySelector(_element_, _selector_)

See the [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) DOM method.

#### querySelectorAll(_element_, _selector_)

See the [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) DOM method. While the native DOM method return a `NodeList`, our implementation of `querySelectorAll` returns an `Array`.

## CSS selector AST

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
		left: {
			type: 'ComplexSelector',
			left: {
				type: 'TypeSelector',
				identifier: 'article'
			},
			right: {
				type: 'TypeSelector',
				identifier: 'p'
			},
			combinator: ' ',
		},
		right: {
			type: 'TypeSelector',
			identifier: 'span'
		},
		combinator: ' '
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
- `modifier` (String) — either `s` or `i`, if any.

#### `PseudoClassSelector` and `PseudoElementSelector`

Represents a pseudo-class selector (such as `:visited` or `:is(a, b, c)`) or a pseudo-element (such as `::before` or `::slotted(span)`), respectively.

Both types of nodes share a common structure:

- `identifier` (String) — the pseudo-class or pseudo-element;
- `argument` (Array|Object) — the argument to the pseudo-class / pseudo-element;

In CSS, there is more than one way to interpret the argument passed to pseudo-classes and pseudo-elements which expressed with the function notation. Some pseudo-classes, such as '\*-child', use the `An+B` microsyntax, others accept a list of selectors.

Currently, arguments passed to the pseudo-classes `:where`, `:is`, and `:not`, and the pseudo-element `::slotted`, are parsed as a `SelectorList` when the `recursive` parsing option is enabled. In all other cases, the `argument` property of the node will contain the array of unparsed tokens.

## See also

- [qsx](https://github.com/danburzo/qsx) and [hred](https://github.com/danburzo.hred)
- [parsel](https://github.com/LeaVerou/parsel)
- [scalpel](https://github.com/gajus/scalpel)
- [csstree](https://github.com/csstree/csstree)

## Colophon

The selery logo is typeset in [Manicotti](https://djr.com/manicotti/) by David Jonathan Ross.
