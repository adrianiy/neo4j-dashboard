[![Build & Test][build-badge]][build-link]
[![GitHub license][license-image]][repo-link]
[![Version][version-image]][repo-version-link]

<div align="center">
  <img width="200" height="200"
    src="./public/logo512.png">
</div>

# NEO4J-Dashboard

This project was created in order to add new features over [neo4j-browser]'s Graph.

The graphic library is a wrapper of [neo4j-browser] graph classes isolated and reimplemented if neccessary to fit our goals.

## Demo

You can access [neo4j-dashboad] and use your custom [neo4j] credentials to test this App

## Custom features

### Image rendering on nodes

In order to render article's images we've added some new features that recognizes [ image | photo-* ] keys in node's properties.
When one of these properties are present the graph renders a new svg element and referece it in node's fill property.

## Commit style

Conventional commits: [conventional-commits]

## CI

To do a PR please follow [contributing rules](.github/CONTRIBUTING.md)

Every PR should pass a PR-Verify process for production deployment security in CI/CD.

PR-Verify will be composed by a set of tests and a Zeit now branch deployment verification.


## Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

[build-badge]: https://github.com/AdrianInsua/neo4j-dashboard/workflows/Build%20&%20Test/badge.svg
[build-link]: https://github.com/AdrianInsua/neo4j-dashboard/actions?query=workflow%3A%22Build+&+Test%22
[license-image]: https://badgen.net/github/license/AdrianInsua/neo4j-dashboard
[version-image]: https://badgen.net/github/release/AdrianInsua/neo4j-dashboard
[repo-link]: https://github.com/AdrianInsua/neo4j-dashboard
[repo-version-link]: https://github.com/AdrianInsua/neo4j-dashboard/releases

[neo4j]: https://neo4j.com/download-neo4j-now/?utm_source=google&utm_medium=ppc&utm_campaign=*EU%20-%20Search%20-%20Branded&utm_adgroup=*EU%20-%20Search%20-%20Branded%20-%20Neo4j%20-%20Exact&utm_term=neo4j&gclid=CjwKCAjwnIr1BRAWEiwA6GpwNW0X6o33Apjt_e3hn-lsI1iEYvVoiNcWDFr76xMXKyQ-XPqF2IOeTBoCgl8QAvD_BwE
[neo4j-dashboard]: https://neo4j-dashboard.now.sh/
[neo4j-browser]: https://github.com/neo4j/neo4j-browser
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0
