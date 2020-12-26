# node-rules-system-esm (NRS-ESM) [![NPM version][npm-image]][npm-url]

Rights Manager, focused mainly on controlling HTTP requests and the file system, so that malicious modules do not cause damage to Your application!

# NOTE

We recommend reading the latest README on the main github branch, as due to small edits to the description, we will not update the entire package on the NPM platform: [node-rules-system-esm README.md](https://github.com/StormExecute/node-rules-system-esm/blob/master/README.md).

# Description

This is an extension to the [node-rules-system](https://www.npmjs.com/package/node-rules-system) module.

The main task of this add - on is instant initialization of the NRS functionality due to the specifics of imports.

This extension can help if you use ``` "type": "module" ``` in package.json, the --experimental-modules flag, or build/don't build a typescript application with imports instead of require.

The main description and other information can be found in the node-rules-system package, and here below is a description of how to initialize this add-on.

# Changelog

[HERE!](https://github.com/StormExecute/node-rules-system-esm/blob/master/CHANGELOG.md)

# Install

```bash
$ npm install node-rules-system-esm
```

# Initialization

### NRS_ESM.tempPassword: string
The temp password that you need to use when reinitializing NRS. **YOU CAN ONLY GET IT ONCE.**

### NRS_ESM.tempReInit: (tempReInitPass: string, newPassword: string, leaveFullSecure?: boolean) => boolean
Actually, the reinitialization function. tempReInitPass - temporary password, newPassword - new password, leaveFullSecure - whether to leave protection enabled.

## Subject

```javascript

import NRS_ESM from "node-rules-system-esm";
import http from "http";
import otherDependency from "node-fetch";

//For accurate confidence in Math.random, use primordials from NRS
const password = "yourPassword" + http["NRS_PRIMORDIALS"].MathRandom();

NRS_ESM.tempReInit(NRS_ESM.tempPassword, password, true);

const session = NRS_ESM.session(password);

//...your code...

```

# Contacts

**Yandex Mail** - vladimirvsevolodovi@yandex.ru

**Github** - https://github.com/StormExecute/

# Platforms

**Github** - https://github.com/StormExecute/node-rules-system-esm/

**NPM** - https://www.npmjs.com/package/node-rules-system-esm/

# License

**MIT** - https://mit-license.org/

[npm-url]: https://www.npmjs.com/package/node-rules-system-esm
[npm-image]: https://img.shields.io/npm/v/node-rules-system-esm.svg