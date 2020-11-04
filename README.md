# selery

A small, handwritten CSS selector parser. **Currently a work-in-progress.**

## Installation

```bash
npm install selery
```

## Usage

```js
let { parse } = require('selery');

parse('a[href=#]');
```

## API

#### `parse(selector)`

Accepts a single string argument, `selector`, and returns the corresponding AST (abstract syntax tree).

The function will throw an error in case it encounter syntax it believes is invalid, so it may be useful to run in a `try/catch` block:

```js
let { parse } = require('selery');

try {
	let tree = parse('div > span:nth-child(3)');
	console.log('Valid selector', tree);
} catch (err) {
	console.error('Invalid selector', err);
}
```

## CSS Selector AST

#### `SelectorList`

The topmost node in the AST.

- `selectors` — an array of (possibly complex) selectors.

#### `ComplexSelector`

- `left` — the left-side (possibly compound) selector;
- `right` — the right-side (possibly compound) selector;
- `combinator` — one of ` `, `>`, `~`, `+`, `||`.

#### `CompoundSelector`

- `selectors` — an array of simple selectors.

#### `TypeSelector`

- `identifier` — can be `*` in the case of the universal selector;
- `namespace` — an optional namespace.

#### `IdSelector`

- `identifier` (String)

#### `ClassSelector`

- `identifier` (String)

#### `AttributeSelector`

Represents an attribute selector, such as `[href ^= "http"]`.

- `identifier` (String) — the attribute to match;
- `value` (String) — the value to match against;
- `matcher` (String) — one of `=`, `^=`, `$=`, `*=`, `~=`, `|=`.

#### `PseudoClassSelector`

Represents a pseudo-class selector, such as `:is(a, b, c)`.

- `identifier` (String) — the pseudo-class;
- `selectors` (Array) — a list of sub-selectors.

#### `PseudoElementSelector`

Represents a pseudo-element selector, such as `::before` or `::after`.

- `identifier` (String) — the pseudo-element.

## Goals

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) and [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/) specifications;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.
