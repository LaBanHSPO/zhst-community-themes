# ZeroHostCMS Community Themes

Public, independent theme development for ZeroHostCMS using released EmDash and Astro APIs. Theme projects belong under `themes/<slug>/`; each owns its dependencies, lockfile, source, synthetic seed content, and local development instructions. They are not members of the private hosting-platform workspace.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for the standalone authoring walkthrough and review requirements. The framework contract lives in the [EmDash theme documentation](https://docs.emdashcms.com/themes/overview/).

## Source acceptance is not publication

A community pull request accepts source for review, not production use. Fetching this repository as a hosting-platform submodule must not install, execute, or deploy a theme. Merging here does not register a gallery entry or approve publication.

Maintainers must select an exact source commit, manually review and evaluate/deploy it in ZeroHostCMS using their own isolated review resources, and only then propose a separate private hosting-platform promotion. [The contribution guide](CONTRIBUTING.md#maintainer-review-and-promotion) owns that approval boundary.

No private hosting-platform checkout, platform credentials, customer data, or account/resource identifiers are needed to contribute. Private runtimes and shipped curated themes remain private; this repository is not an export of them.

## License

Repository contributions are under the [MIT License](LICENSE). Preserve upstream notices and identify the licenses and redistribution rights of third-party code, fonts, images, icons, and other assets in each theme project.
