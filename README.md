<div align="center">
<h1>cornerstone-tools</h1>

<p>Provides a simple, extensible framework for creating tools on top of <a href="https://github.com/cornerstonejs/cornerstone/">Cornerstone.js</a>. Includes common tool implementations, and leverages DICOM metadata (when available) for advanced functionality.</p>

[**Read The Docs**](https://tools.cornerstonejs.org/) | [Edit the docs](https://github.com/cornerstonejs/cornerstoneTools/edit/master/docs/)

</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Coverage Status][coverage-badge]][coverage]

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
<!-- prettier-ignore-end -->

## The problem


You want to build tools on top of [Cornerstone.js](https://github.com/cornerstonejs/cornerstone/).
As part of this goal, you don't want to re-invent the wheel. You want easy to read

## This solution

`cornerstone-tools` is a light-weight solution for building Tools on top of Cornerstone.js.
It's only dependencies are libraries within the Cornerstone family. Instead of trying to
"do everything" it aims to be extensible and pluggable to aid in the rapid development
of new tools. Ideally, tools created using `cornerstone-tools` can be easily shared,
allowing for the creation of a broader ecosystem.

## Example

TODO: This need refined

**A common setup when using modules:**
```javascript
// Load NPM packages
import Hammer from "hammerjs"; // npm install --save hammerjs
import * as cornerstone from "cornerstone-core"; // npm install --save cornerstone-core
import * as cornerstoneTools from "cornerstone-tools";

// Specify external dependencies
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
```

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev react-testing-library
```

This library has a `peerDependencies` listing for:

- `cornerstone-core`

> [**Docs**](https://tools.cornerstonejs.org/installation.html)


## Examples

...

## Other Solutions

- OHIF Viewer: [Source][ohif-source] | [Demo][ohif-demo]

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

### ❓ Questions

For questions related to using the library, please visit our support community,
or file an issue on GitHub.

- [Google Group][google-group]

## LICENSE

MIT

<!--
Links:
-->

<!-- prettier-ignore-start -->
[build-badge]: https://circleci.com/gh/cornerstonejs/cornerstoneTools/tree/vNext.svg?style=svg
[build]: https://circleci.com/gh/cornerstonejs/cornerstoneTools/tree/vNext
[coverage-badge]: https://codecov.io/gh/cornerstonejs/cornerstoneTools/branch/vNext/graphs/badge.svg
[coverage]: https://codecov.io/gh/cornerstonejs/cornerstoneTools/branch/vNext
[npm-url]: https://npmjs.org/package/cornerstone-tools
[npm-downloads-image]: http://img.shields.io/npm/dm/cornerstone-tools.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/cornerstone-tools.svg?style=flat
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[node]: https://nodejs.org
[ohif-demo]: https://viewer.ohif.org/demo-signin
[ohif-source]: https://github.com/OHIF/Viewers
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[bugs]: https://github.com/cornerstonejs/cornerstone-tools/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc
[requests]: https://github.com/cornerstonejs/cornerstone-tools/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen
[good-first-issue]: https://github.com/cornerstonejs/cornerstone-tools/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+
[google-group]: https://groups.google.com/forum/#!forum/cornerstone-platform
<!-- prettier-ignore-end -->
