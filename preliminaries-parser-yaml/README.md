# preliminaries-parser-yaml [![Linux Build Status](https://travis-ci.org/josephearl/preliminaries.svg?branch=master)](https://travis-ci.org/josephearl/preliminaries) [![npm version](https://badge.fury.io/js/preliminaries-parser-yaml.svg)](https://badge.fury.io/js/preliminaries-parser-yaml)

YAML parser for [preliminaries](https://github.com/josephearl/preliminaries). 

## Dependency

**npm**

```bash
npm install preliminaries-parser-yaml
```

**yarn**

```bash
yarn add preliminaries-parser-yaml
```

## Using preliminaries-parser-yaml

Importing `preliminaries-parser-yaml` with `require`:

```js
var { preliminaries } = require('preliminaries');
var { yamlParser } = require('preliminaries-parser-yaml');
```

the same with ES6 `import`:

```js
import { preliminaries } from 'preliminaries';
import { yamlParser } from 'preliminaries-parser-yaml';
```

Parse some YAML front matter:

```js
preliminaries.register(yamlParser)
preliminaries.parse('---yaml\ntitle: "Hello"\n---\nContent');
preliminaries.parse('---\ntitle: "Hello"\n---\nContent');
```
