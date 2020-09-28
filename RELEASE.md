This document describes process to release and publish a new version of this module.

**Please note in order to be able to release a new version make sure you have preinstalled Git
and cloned this repository.**

* Bump version number in `package.json` and `package-lock.json` and commit to `master` branch.

* Create and push a new Git tag named with the same version as in `package.json` but with `v` prefix, e.g. `v1.0.0`.
  To create a new Git tag run `git tag v<version>`. To push tag run `git push --tags`.

* Create a new GitHub release from recently published tag. 

* Wait until GitHub Action checks finished, if status is successful you are good, otherwise
  if status is failed, check the error(s), and redo all the steps again, until status is successful.
