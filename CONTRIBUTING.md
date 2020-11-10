# Contributing

## For users

TODO.

## For contributors

TODO.

## For maintainers

### Publishing a new release

> The publishing process requires [the GitHub CLI](https://cli.github.com/) to be installed.

To push a new release, follow these steps.

`npm version [patch | minor | major]` triggers building, testing, and linting. If everything is okay, it increments the version in `package.json` and `package-lock.json`, then creates a Git tag for the new version.

`npm publish` triggers building, testing, and linting. If everything is okay, it publishes the new version to npm. Afterwards, the `postpublishOnly` hook is triggered.

The `postpublishOnly` hook creates a new release on GitHub, and attaches a `.zip` file containing the `dist/` folder to the release.

Finally `git push origin head --follow-tags` to push everything to Git.
