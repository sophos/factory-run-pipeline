# Release Process

This document describes the process for creating a release and publishing a new version of the GitHub Action to the GitHub Marketplace.

## Prerequisites

- Install [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/)
- [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this repository

## Create a Release

1. Update any relevant dependencies.
2. Run `npm install` to regenerate the `package-lock.json`.
3. Commit and Git tag these changes. Use `v` followed by the semantic version number, for example: `git tag -a v1.0.0`.
4. Push the changes to the GitHub repository. Test workflows (`integration.yml` and `test.yml`) will run. Ensure the tests complete successfully.
5. Merge PRs to the `master` branch.
6. Tag and [create the release on GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release). To publish the new version to the GitHub Marketplace, ensure the checkbox is selected on the release form page.

New updates to the action can be viewed on the GitHub Marketplace: https://github.com/marketplace/actions/sophos-factory-run-pipeline
