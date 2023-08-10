# Publish a new release

1. Merge the branches (features, fixes) into master
2. Create release commit:
    1. Update `version` in package.json according to [semantic versioning rules](https://semver.org/)
    2. Update `CHANGELOG.md` (manually)
    3. Commit these changes as version bump, e.g. `v3.0.0`
    4. Push commit onto master
3. Tag version bump commit e.g. `git tag v3.0.0` and push it `git push --tags`
4. `yarn prepublish`
5. `npm publish` (requires being an npm package maintainer)
6. `yarn storybook-deploy`
