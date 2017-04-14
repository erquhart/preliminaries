# preliminaries-parser-toml [![Linux Build Status](https://travis-ci.org/josephearl/preliminaries.svg?branch=master)](https://travis-ci.org/josephearl/preliminaries) [![npm version](https://badge.fury.io/js/preliminaries-parser-toml.svg)](https://badge.fury.io/js/preliminaries-parser-toml)

TOML parser for [preliminaries](https://github.com/josephearl/preliminaries). 

## Dependency

**npm**

```bash
npm install preliminaries-parser-toml
```

**yarn**

```bash
yarn add preliminaries-parser-toml
```

## Using preliminaries-parser-toml

Importing `preliminaries-parser-toml` with `require`:

```js
var { preliminaries } = require('preliminaries');
var { tomlParser } = require('preliminaries-parser-toml');
```

the same with ES6 `import`:

```js
import { preliminaries } from 'preliminaries';
import { tomlParser } from 'preliminaries-parser-toml';
```

Parse some TOML front matter:

```js
preliminaries.register(tomlParser)
preliminaries.parse('---toml\ntitle = "Hello"\n---\nContent');
preliminaries.parse('+++\ntitle = "Hello"\n+++\nContent');
```
