/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
require('should');

describe('stringify JSON5:', function() {
  
  before(function() {
    require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json5');
  });

  it('should stringify JSON5', function() {
    var data = {name: 'a long test name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5'});
    res.should.equal([
      '---json5',
      '{',
      'name:"a long test name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should NOT stringify lang if custom delimiters are used', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', delims: '---'});
    res.should.equal([
      '---',
      '{',
      'name:"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should NOT stringify lang if stringifyIncludeLang is false', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', stringifyIncludeLang: false});
    res.should.equal([
      '---',
      '{',
      'name:"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('stringify lang if custom delimiters are used and stringifyIncludeLang is true', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', delims: '~~~', stringifyIncludeLang: true});
    res.should.equal([
      '~~~json5',
      '{',
      'name:"test-name"',
      '}',
      '~~~',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should extract front matter, extend it, and convert it back to front matter', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5'});
    res.should.equal([
      '---json5',
      '{',
      'name:"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should use custom delimiters', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', delims: '~~~'});
    res.should.equal([
      '~~~',
      '{',
      'name:"test-name"',
      '}',
      '~~~',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('use parser delimiters', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', stringifyUseParserDelims: true});
    res.should.equal([
      '---json5',
      '{',
      'name:"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should stringify json5 with standard delimiters', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json5', delims: ['{', '}']});
    res.should.equal([
      '{',
      'name:"test-name"',
      '}',
      'Name: {{name}}\n'
    ].join('\n'));
  });
});
