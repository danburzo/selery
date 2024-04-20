# Contributing

Hi, and thank you for considering a contribution to selery!

## Topics for users

**Logging an issue** for any problem, question or suggestion is greatly appreciated.

**Pull requests** are likewise appreciated for typos and other straightforward bugfixes, as well as contributing tests. Fornon-trivial tasks, please [create an issue](https://github.com/danburzo/selery/issues/new) (or participate on [an existing thread](https://github.com/danburzo/selery/issues)) before taking on substantial work.

## Topics for contributors

### Setting up shop

Clone the repository and run `npm install` to fetch all the project dependencies.

Available npm scripts:

- `npm run test` — run all tests;
- `npm run lint` — lint the code with ESLint.

### Creating a selector test-case

The `test/cases` folder contains a set of test-cases with which we can verify the output of the `selery.tokenize()`, `selery.parse()` and `selery.serialize()` methods. A test-case file in this location must end in `.case.js` in order to be evaluated.

A `my.case.js` file must export an array of test-cases. A test-case is a plain JavaScript object with these properties:

- `selector` — the selector to verify;
- `description` — a description of the test-case; if omitted, the `selector` will be used;
- `tokenize` — the expected result of `tokenize(selector)`; in case the method should throw, specify a regex to match the error;
- `parse` — the expected result of `parse(selector)`; in case the method should throw, specify a regex to match the error;
- `serialize` — the expected result of `serialize(parse(selector))`; in case the method should throw, specify a regex to match the error; use `true` as a shorthand if you expect the result of the serialization to match the selector verbatim.

> For a test-case to be useful, it must include at least a `selector` and one of `tokenize`, `parse`, or `serialize`.
