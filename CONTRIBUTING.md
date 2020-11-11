# Contributing

Hi, and thank you for considering a contribution to selery!

## Topics for users

**Logging an issue** for any problem, question or suggestion is greatly appreciated.

**Pull requests** are likewise appreciated for typos and other straightforward bugfixes, as well as contributing tests. For other, non-trivial tasks, please [create an issue](https://github.com/danburzo/selery/issues/new) (or participate on [an existing thread](https://github.com/danburzo/selery/issues)) before taking on substantial work.

## Topics for contributors

### Creating a selector test-case

The `test/testcases` folder contains a set of test-cases with which we can verify the output of the `selery.tokenize()`, `selery.parse()` and `selery.serialize()` methods. A test-case file in this location must end in `.case.js` in order to be evaluated.

A `my.case.js` file must export an array of test-cases or an individual test-case. A test-case is a plain JavaScript object with these properties:

- `selector` — the selector to verify;
- `description` — a description of the test-case; if omitted, the `selector` will be used;
- `tokenize` — the expected result of `tokenize(selector)`; in case the method should throw, specify a regex to match the error;
- `parse` — the expected result of `parse(selector)`; in case the method should throw, specify a regex to match the error;
- `serialize` — the expected result of `serialize(parse(selector))`; in case the method should throw, specify a regex to match the error; use `true` as a shorthand if you expect the result of the serialization to match the selector verbatim.

> For a test-case to be useful, it must include at least a `selector` and one of `tokenize`, `parse`, or `serialize`.

## Topics for maintainers

### Publishing a new release

> The publishing process requires [the GitHub CLI](https://cli.github.com/) to be installed.

To push a new release, follow these steps.

1. `npm version [patch | minor | major]` triggers building, testing, and linting. If everything is okay, it increments the version in `package.json` and `package-lock.json`, then creates a Git tag for the new version.
2. `npm publish` triggers building, testing, and linting. If everything is okay, it publishes the new version to npm.
3. `git push origin head --follow-tags` pushes everything to Git.
4. `npm run release` creates a new release on GitHub, and attaches a `.zip` file containing the `dist/` folder to the release.
