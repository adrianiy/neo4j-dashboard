# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

## Branching strategy

We follow a branch-per-feature strategy. General speaking, each branch must have a reference to a JIRA-ID. Ex: feature/DRIVEWEB-5.

<br/>
<div style="width: 100%; position: relative; display: block;padding: 40px 0;">
	<img width=600 style="margin: 0 auto; position: relative; display: block;" src="assets/gitflow.svg"/>
<br/>
</div>

Once development is finished, a pull request to **develop** branch must be made in order to merge the feature. Merge strategy is *--no-ff*.

Pull requests tigger **PR-Verify plan** in Bamboo, so we can check acceptance criteria automatically.

### Short-term plan

Every single merge to **develop** will trigger a Release Plan, consisting on increasing build number and merging changes to **master** branch, following a *--sqash* strategy. This released artifact will be automatically deployed to **pre-production environment**.

Jira issues are updated with fix version afterwards.

Finally, any version released and deployed to pre-production environment can be **promoted to production** from Jira.

### Mid-term plan

Every single merge to **develop** will trigger a Release Plan, consisting on increasing build number and merging changes to **master** branch, following a *--sqash* strategy. This released artifact will be automatically deployed to **production environment**.

Jira issues are updated with fix version afterwards.

## Pull Request Requirements

All pull request must comply <u>**all**</u> of the following:

* Motivation and description (with technical details).
* Two different reviewers at least.
* Successful functional validation.
* Successful build status.
* No merge conflicts.
* No dependencies conflicts.
* Follow [code style guide](README.md#code-style).
* All tests passing.
* File, method, statement and branch coverage above 90%.
* Updated [README](README.md) and [CHANGELOG](CHANGELOG.md) if applies.
