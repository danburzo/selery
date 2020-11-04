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

## Goals

- Follow the [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/) grammar;
- Pass relevant Web Platform Tests;
- Allow lax selector parsing matching browsers' behavior.
