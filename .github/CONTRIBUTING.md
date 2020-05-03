# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

## Branching strategy

We follow a branch-per-feature strategy. General speaking, each branch must have a reference to a ISSUE. Ex: feature/#5

Once development is finished, a pull request to **develop** branch must be made in order to merge the feature. Merge strategy is *--no-ff*.

Pull requests tigger **PR-Verify plan**, so we can check acceptance criteria automatically.

Each merge to **master** should trigger a release and deploy action.


## Pull Request Requirements

All pull request must comply <u>**all**</u> of the following:

* Motivation and description (with technical details).
* Code owner reviewers at least.
* Successful functional validation.
* Successful build status.
* No merge conflicts.
* No dependencies conflicts.
* All tests passing.
