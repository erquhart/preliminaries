# preliminaries [![Linux Build Status](https://travis-ci.org/josephearl/preliminaries.svg?branch=master)](https://travis-ci.org/josephearl/preliminaries) [![npm version](https://badge.fury.io/js/preliminaries.svg)](https://badge.fury.io/js/preliminaries)

Simple front matter parser for Markdown that supports JSON, YAML, TOML and custom parsers. 

Now with [JSON5](http://json5.org) support!

Forked from the excellent [jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter), prelimimaries strips things down and makes the YAML and TOML parsers entirely optional, as well as supporting stringifying languages other than YAML.

Improved parsing and auto-detection of languages supports JSON front matter with `{` and `}` plain delimiters and TOML with `+++` delimiters as used in [Hugo](https://gohugo.io).

## Dependency

**npm**

```bash
npm install --save preliminaries
# Optional
npm install --save preliminaries-parser-yaml
npm install --save preliminaries-parser-toml
npm install --save preliminaries-parser-json5
```

**yarn**

```bash
yarn add preliminaries
# Optional
yarn add preliminaries-parser-yaml
yarn add preliminaries-parser-toml
yarn add preliminaries-parser-json5
```

## Using preliminaries

### `Preliminaries(register: boolean): Preliminaries`

Registers any default parsers (currently only JSON) for their default languages.

### `PreliminariesParser(register: boolean): PreliminariesParser`

Registers the parser for it's default language.

Load preliminaries and some parsers and register the parsers for their default languages:

```bash
var { preliminaries, jsonParser } = require('preliminaries');
var yamlParser = require('preliminaries-parser-yaml');
var tomlParser = require('preliminaries-parser-toml');
var json5Parser = require('preliminaries-parser-json5');

preliminaries
  .register(jsonParser)
  .register(tomlParser)
  .register(yamlParser);
  .register(json5Parser);
```

the same with ES6 `import`:

```bash
import { preliminaries, jsonParser } from 'preliminaries';
import yamlParser from 'preliminaries-parser-yaml';
import tomlParser from 'preliminaries-parser-toml';
import json5Parser from 'preliminaries-parser-json5';

preliminaries
  .register(yamlParser)
  .register(jsonParser)
  .register(tomlParser)
  .register(json5Parser);
```

### `Preliminaries.parse(str: string, options?: PreliminariesOptions): any`

Parse some JSON front matter:

```js
preliminaries.parse('{\n"name":"Joseph"\n}\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

or YAML:

```js
preliminaries.parse('---\nname: Joseph\n---\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

and even TOML:

```js
preliminaries.parse('+++\nname = "Joseph"\n+++\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

It can automatically detect any language embedded after the first delimiter such as `---yaml` or `---json`, as well standard delimiters for languages such as `+++` for TOML or `{` and `}` for JSON.

Use custom delimiters:

```js
preliminaries.parse('~~~\nname: Joseph\n~~~\nContent', {lang: 'yaml', delims: '~~~'})
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

with JSON as well!

```js
preliminaries.parse('~~~\n{\n"name":"Joseph"\n}\n~~~\nContent', {lang: 'json', delims: '~~~'})
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

### `Preliminaries.stringify(str: string, data: Object, options?: PreliminariesOptions): string`

Stringify a content string and front matter JavaScript object:

```js
preliminaries.stringify('Content', {name: 'Joseph'})
// Returns
---json
{
"name":"Joseph"
}
---
Content
```

with standard JSON delimiters:

```js
preliminaries.stringify('Content', {name: 'Joseph'}, {stringifyUseParserDelims: true})
// Returns
{
"name":"Joseph"
}
Content
```

or YAML front matter:

```js
preliminaries.stringify('Content', {name: 'Joseph'}, {lang: 'yaml', stringifyUseParserDelims: true})
// Returns
---
name: Joseph
---
Content
```

Stringify with custom delimiters:

```js
preliminaries.stringify('Content', {name: 'Joseph'}, {lang: 'yaml', delims: '~~~'})
// Returns
~~~
name: Joseph
~~~
Content
```

### `Preliminaries.test(str: string, options?: PreliminariesOptions): boolean`

Test whether a string contains front matter of any kind:

```
preliminaries.test('{\n"abc": "xyz"\n}');
preliminaries.test('---\nabc: xyz\n---');
preliminaries.test('+++\nabc = "xyz"\n+++');
preliminaries.test('~~~\nabc = "xyz"\n~~~');
// All return true
```

or front matter with particular delimiters:

```
preliminaries.test('---\nabc: xyz\n---', {delims: '~~~'});
// Returns false
```

### `Preliminaries.register(lang: string | string[], parser: PreliminariesParser): void`

Register a parser for a new language:

```js
preliminaries.register('xml', xmlParser);
```

for this to succeed no parser must be already registered for the language, **and** the opening delimiters of the parser must not match the opening delimiters of *any* parser currently registered (this would lead to ambiguous auto-detection of languages).

An error will be thrown if either of the above conditions are false. You can check if a parser can be registered with `Preliminaries.registerable`.

### `Preliminaries.unregister(lang: string | string[]): void`

Unregister a previously registered parser:

```js
preliminaries.unregister('json');
```

### `Preliminaries.registerable(lang: string | string[], parser: PreliminariesParser): boolean`

Check if a parser can be registered for the language, or all languages if an array -- this returns `false if a parser is already registered for any of the languages, or if the opening delimiters of this parser match those of an already existing parser:

```js
preliminaries.registerable('---', parser: myParser);
```

if this call returns `true`, a subsequent call to `Preliminaries.register` will succeed without error.

### `Preliminaries.registered(lang: string | string[]): boolean`

Check if a parser is registered for a language:

```js
preliminaries.registered('json');
```

or if one is registered for *any* of the languages:

```js
preliminaries.registered(['json', 'yaml', 'toml']);
```

**Note:** a `false` result does not indicate a parser may be registered without error, just that one is not already registered for this language; use `Preliminaries.registerable` for that purpose.

### `Preliminaries.jsonParser: PreliminariesParser`

The default JSON parser. Use it to register it for another language:

```js
var preliminaries = require('preliminaries');
preliminaries.register('xyz', preliminaries.jsonParser)
preliminaries.parse('---xyz\n{\n"name":"Joseph"\n}\n---\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content'
}
```

## Options

### `PreliminariesOptions.parser?: PreliminariesParser`

Optionally provide a custom parser to use when parsing or stringifying.

### `PreliminariesOptions.lang?: string`

The language the front matter is in. 

Required when parsing if using custom delimiters or whenever stringifying to language other than JSON. 

### `PreliminariesOptions.delims?: string | string[]`

Custom delimiters.

A string (if start and end delimiters are the same), or an array of 2 elements containing the start and end delimiters.

### `PreliminariesOptions.stringifyIncludeLang?: boolean`

Whether to output the front matter language the first delimiter.

If not set the language will be output when stringifying if a custom delimiters are not set with `PreliminariesOptions.delims` and `PreliminariesOptions.stringifyUseParserDelims` is not truthy.

### `PreliminariesOptions.stringifyUseParserDelims?: boolean`

Whether to stringify using the default delimiters defined by the parser for the language, instead of the default `---lang` format.

## Creating parsers

Your parser should include `preliminaries` as a `peerDependency` in your package.json.

### `PreliminariesParser(register: boolean): PreliminariesParser`

The root export of your parser should be a function that accepts a `boolean` value, if `truthy` you should register your parser for it's default language:

```js
var preliminaries = require('preliminaries');

var myParser = function(register) {
  if (register) {
    preliminaries.register('abc', myParser);
  }
}

module.exports = myParser;
```

### `PreliminariesParser.parse(str: string, options?: PreliminariesOptions): any`

Parse a front matter string without delimiters into a JavaScript object.

```
myParser.parse = function(str, options) {
  return {};
}
```

### `PreliminariesParser.stringify(data: Object, options?: PreliminariesOptions): string`

Stringify a JavaScript front matter object into string without delimiters.

```
myParser.stringify = function(data, options) {
  return '';
}
```

### `PreliminariesParser.delims?: string | string[]`

The default delimiters for the parser, used to auto-detect the language and parser to use and when `stringify`ing with the `stringifyUseParserDelims` option.

A string (if start and end delimiters are the same), or an array of 2 elements containing the start and end delimiters.

```js
myParser.delims = ['<', '>'];
```
