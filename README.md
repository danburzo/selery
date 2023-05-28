![selery](./.github/selery.svg)

selery is a small, handwritten CSS selector parser and DOM query engine.

It aims to be compliant with the relevant specifications ([CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/), [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/), and others), while remaining compact and understandable so that it can be used as a starting point to experiment with new CSS syntax.

> ⚠️ Currently a work-in-progress

## Getting started

[![selery on npm](https://img.shields.io/npm/v/selery.svg?style=flat-square&labelColor=50B888&color=black)](https://www.npmjs.org/package/selery) [![selery on bundlephobia](https://img.shields.io/bundlephobia/minzip/selery?style=flat-square&labelColor=50B888&color=black)](https://bundlephobia.com/result?p=selery)

You can install selery as an [npm package](https://npmjs.com/package/selery):

```bash
npm install selery
```

## API reference

#### tokenize(_selector_)

Takes a string _selector_ and returns an array of tokens.

```js
let { tokenize } = require('selery');

tokenize('article a[href="#"]');
```

A token is a plain object having a `type` property, along with other optional properties, which are documented in the [CSS token reference](#css-token-reference). For the sample selector `'article a[href="#"]'` mentioned above, the resulting token array is:

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

It produces an _abstract syntax tree_ (AST), also called a _parse tree_, for the provided input.

```js
let { parse } = require('selery');

let tree = parse('div > span:nth-child(3)');
```

Available options:

**`syntax`** (_Object_) — provide custom microsyntaxes to various pseudo-classes and pseudo-elements. By default, the argument of `:nth-*()` pseudo-classes is parsed with the _An+B microsyntax_, while for the `:is()`, `:where()`, `:not()`, and `:has()`, the argument is parsed as a `SelectorList`.

The keys to the _syntax_ object are the identifier for the pseudo-class (prefixed by `:`) or pseudo-element (prefixed by `::`), and the values are either strings (one of `None`, `AnPlusB`, or `SelectorList`) or functions. Function values will receive an array of tokens and can return anything suitable for storing in the AST node's `argument` key.

```js
parse(':nth-child(3)', {
	syntax: {
		/* Change the microsyntax of a pseudo-class */
		':nth-child': 'None',

		/* A microsyntax defined as a function */
		':magic': tokens => tokens.map(t => t.value).join('★')
	}
});
```

#### serialize(_input_)

Converts the input back into a string. The _input_ argument can be either an array of tokens, or an object representing a parse tree.

### DOM API shims

Shims for selector-accepting DOM methods using simpler DOM primitives.

Across these methods:

- the _selector_ argument can be a string (as with their native DOM counterparts), an array of tokens, or an object representing a parse tree;
- the _options_ object accepts the following keys:
  - _root_ (Element) — an optional _scoping root_;
  - _scope_ (Element | Array) — an optional set of _:scope elements_.

#### matches(_element_, _selector_, _options_)

See the [Element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches) DOM method.

#### closest(_element_, _selector_, _options_)

See the [Element.closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) DOM method.

#### querySelector(_element_, _selector_, _options_)

See the [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) DOM method.

#### querySelectorAll(_element_, _selector_, _options_)

See the [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) DOM method. While the native DOM method return a `NodeList`, our implementation of `querySelectorAll` returns an `Array`.

## CSS token reference

| Token `type`                                                              | Additional properties |
| ------------------------------------------------------------------------- | --------------------- |
| `dimension`                                                               | `value`, `unit`       |
| `at-keyword`, `function`, `hash`, `ident`, `number`, `string`, `delim`    | `value`               |
| `)`, `(`, `}`, `{`, `]`, `[`, `colon`, `comma`, `semicolon`, `whitespace` | none                  |

## CSS selector AST reference

All nodes in the AST contain a `type` property, and additional properties for each specific type, listed below.

#### `SelectorList`

The topmost node in the AST.

- `selectors` — an array of (possibly complex) selectors.

#### `ComplexSelector`

A complex selector represents a pair of selectors stringed together with combinators, such as `article > p`.

- `left` — the left-side (possibly complex, or compound) selector; `null` when the selector is relative, such as the `> img` in `a:has(> img)`;
- `right` — the right-side (possibly complex, compound) selector;
- `combinator` — one of ` `, `>`, `~`, `+`, `||`

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

Represents a pseudo-class selector (such as `:visited` or `:is(a, b, c)`) or a pseudo-element (such as `::before`), respectively.

Both types of nodes share a common structure:

- `identifier` (String) — the pseudo-class or pseudo-element;
- `argument` (Anything) — the argument to the pseudo-class / pseudo-element;

In CSS, there is more than one way to interpret the argument passed to pseudo-classes and pseudo-elements which expressed with the function notation. Some pseudo-classes, such as `:nth-*()`, use the `An+B microsyntax`, others accept a list of selectors.

You can control how the microsyntaxes get applied to the pseudo-classes and pseudo-elements with the `syntax` option on the `parse()` method.

## Supported selectors

TODO

## See also

- [qsx](https://github.com/danburzo/qsx) and [hred](https://github.com/danburzo/hred)
- [parsel](https://github.com/LeaVerou/parsel)
- [scalpel](https://github.com/gajus/scalpel)
- [csstree](https://github.com/csstree/csstree)
- [parse-css](https://github.com/tabatkins/parse-css)

## Colophon

The selery logo is typeset in [Manicotti](https://djr.com/manicotti/) by David Jonathan Ross.
