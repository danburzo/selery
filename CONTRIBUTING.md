# Contributing

## For users

TODO.

## For contributors

TODO.

## For maintainers

### Publishing a new release

> The publishing process requires [the GitHub CLI](https://cli.github.com/) to be installed.

To push a new release, follow these steps.

1. `npm version [patch | minor | major]` triggers building, testing, and linting. If everything is okay, it increments the version in `package.json` and `package-lock.json`, then creates a Git tag for the new version.
2. `npm publish` triggers building, testing, and linting. If everything is okay, it publishes the new version to npm.
3. `git push origin head --follow-tags` pushes everything to Git.
4. `npm run release` creates a new release on GitHub, and attaches a `.zip` file containing the `dist/` folder to the release.
