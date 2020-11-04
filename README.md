# selery

A CSS selector parser.

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

## Goals

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) and [CSS Syntax Level 3](https://drafts.csswg.org/css-syntax-3/) specifications;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.
