/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('..');
require('should');

describe('stringify JSON:', function () {
  it('should extract front matter, extend it, and convert it back to front matter.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json'});
    res.should.equal([
      '---',
      '{',
      '"name":"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should use custom delimiters.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {delims: '~~~'});
    res.should.equal([
      '~~~',
      '{',
      '"name":"test-name"',
      '}',
      '~~~',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should stringify json.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json'});
    res.should.equal([
      '---',
      '{',
      '"name":"test-name"',
      '}',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should stringify json with standard delimiters.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {lang: 'json', delims: ['{', '}']});
    res.should.equal([
      '{',
      '"name":"test-name"',
      '}',
      'Name: {{name}}\n'
    ].join('\n'));
  });
});
