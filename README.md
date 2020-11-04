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

### CSS Selector AST

```js
SelectorList {
	selectors: Array<ComplexSelector>
}

ComplexSelector {
	combinator: String,
	left: CompoundSelector,
	right: CompoundSelector
}

CompoundSelector {
	selectors: Array<Selector>
}

UniversalSelector extends Selector {
	namespace: String
}

TypeSelector extends Selector {
	identifier: String,
	namespace: String
}

IdSelector extends Selector {
	identifier: String
}

ClassSelector extends Selector {
	identifier: String
}

AttributeSelector extends Selector {
	identifier: String,
	matcher: String,
	value: String
}

PseudoClassSelector extends Selector {
	identifier: String,
	selectors: Array<ComplexSelector>
}

PseudoElementSelector {
	identifier: String
}
```

## Goals

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) and [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/) specifications;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.
