# preliminaries

Simple front matter parser for Markdown that supports JSON, YAML, TOML and custom parsers. 

Forked from the excellent [gray-matter](), prelimimaries strips things down and makes the YAML and TOML parsers entirely optional, as well as supporting stringifying languages other than YAML.

Improved parsing and auto-detection of languages supports JSON front matter with `{}` plain delimiters and TOML with `+++` delimiters as used in [Hugo]().

## Dependency

**npm**

```bash
npm install --save preliminaries
# Optional
npm install --save preliminaries-parser-yaml
npm install --save preliminaries-parser-toml
```

**yarn**

```bash
yarn add preliminaries
# Optional
yarn add preliminaries-parser-yaml
yarn add preliminaries-parser-toml
```

## Using preliminaries

### `Preliminaries(register: boolean): Preliminaries`

Registers any default parsers (currently only JSON) for their default languages.

### `PreliminariesParser(register: boolean): PreliminariesParser`

Registers the parser for it's default language.

Load preliminaries and some parsers and register the parsers for their default languages:

```bash
var preliminaries = require('preliminaries')(true);
require('preliminaries-parser-yaml')(true);
require('preliminaries-parser-toml')(true);
```

Load preliminaries and some parsers without registering any parsers:

```bash
var preliminaries = require('preliminaries');
var tomlParser = require('preliminaries-parser-yaml');
var yamlParser = require('preliminaries-parser-toml');
```

### `Preliminaries.parse(str: string, options?: PreliminariesOptions): any`

Parse some JSON front matter:

```js
preliminaries.parse('{\n"name":"Joseph"\n}\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content',
  orig: '{\n"name":"Joseph"\n}\nContent',
}
```

or YAML (make sure to require `preliminaries-parser-yaml`):

```js
preliminaries.parse('---\nname: Joseph\n---\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content',
  orig: '---\nname: Joseph\n---\nContent',
}
```

and it can automatically detect any language embedded after the first delimiter such as `---yaml` or `---json`.

Use custom delimiters:

```js
preliminaries.parse('~~~\nname: Joseph\n~~~\nContent', {lang: 'yaml', delims: '~~~'})
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content',
  orig: '~~~\nname: Joseph\n~~~\nContent',
}
```

with JSON as well!

```js
preliminaries.parse('~~~\n{\n"name":"Joseph"\n}\n~~~\nContent', {lang: 'json', delims: '~~~'})
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content',
  orig: '~~~\n{\n"name":"Joseph"\n}\n~~~\nContent',
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

### `Preliminaries.registerParser(lang: string, parser: PreliminariesParser): void`

### `Preliminaries.unregisterParser(lang: string): void`

Unregister a previously registered parser:

```
preliminaries.unregisterParser('json');
```

### `Preliminaries.jsonParser: PreliminariesParser`

The default JSON parser. Use it to register it for another language:

```js
var preliminaries = require('preliminaries');
preliminaries.registerParser('xyz', preliminaries.jsonParser)
preliminaries.parse('---xyz\n{\n"name":"Joseph"\n}\n---\nContent')
// Returns
{
  data: {name: 'Joseph'},
  content: 'Content',
  orig: '---xyz\n{\n"name":"Joseph"\n}\n---\nContent',
}
```
