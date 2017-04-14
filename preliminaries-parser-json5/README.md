# preliminaries-parser-json5 [![Linux Build Status](https://travis-ci.org/josephearl/preliminaries.svg?branch=master)](https://travis-ci.org/josephearl/preliminaries) [![npm version](https://badge.fury.io/js/preliminaries-parser-json5.svg)](https://badge.fury.io/js/preliminaries-parser-json5)

JSON5 parser for [preliminaries](https://github.com/josephearl/preliminaries). 

## Dependency

**npm**

```bash
npm install preliminaries-parser-json5
```

**yarn**

```bash
yarn add preliminaries-parser-json5
```

## Using preliminaries-parser-json5

Importing `preliminaries-parser-json5` with `require`:

```js
var { preliminaries } = require('preliminaries');
var { json5Parser } = require('preliminaries-parser-json5');
```

the same with ES6 `import`:

```js
import { preliminaries } from 'preliminaries';
import { json5Parser } from 'preliminaries-parser-json5';
```

Parse some JSON5 front matter:

```js
preliminaries.register(json5Parser);
preliminaries.parse('---json5\n{\ntitle: "Hello"\n}\n---\nContent');
// The following does not work by default because doing so would clash with default JSON parser:
// preliminaries.parse('{\ntitle: "Hello"\n}\nContent');
// To get it to work instead register the parser and specify the delimiters:
preliminaries.register(json5Parser, 'json5', ['{', '}']);
preliminaries.parse('{\ntitle: "Hello"\n}\nContent');
```
