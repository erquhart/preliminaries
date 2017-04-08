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

describe('stringify TOML:', function() {
  before(function() {
    require('..')(true);
  });

  after(function() {
    preliminaries.unregisterParser('toml');
  });

  it('should extract front matter, extend it, and convert it back to front matter', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'toml'});
    res.should.equal([
      '---toml',
      'name = "test-name"',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should stringify TOML', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {delims: '+++', lang: 'toml'});
    res.should.equal([
      '+++',
      'name = "test-name"',
      '+++',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should use custom delimiters', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {delims: '~~~', lang: 'toml'});
    res.should.equal([
      '~~~',
      'name = "test-name"',
      '~~~',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should use parser delimiters', function() {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {stringifyUseParserDelims: true, lang: 'toml'});
    res.should.equal([
      '+++',
      'name = "test-name"',
      '+++',
      'Name: {{name}}\n'
    ].join('\n'));
  });
});
