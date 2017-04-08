/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var fs = require('fs');
var _ = require('lodash');
var preliminaries = require('..');
var pkg = require('../package');

describe('.stringify()', function () {
  it('should extract front matter, extend it, and convert it back to front matter.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data);
    res.should.equal([
      '---',
      'name: test-name',
      '---',
      'Name: {{name}}\n'
    ].join('\n'));
  });

  it('should use custom delimiters.', function () {
    var data = {name: 'test-name'};
    var res = preliminaries.stringify('Name: {{name}}', data, {delims: '~~~'});
    res.should.equal([
      '~~~',
      'name: test-name',
      '~~~',
      'Name: {{name}}\n'
    ].join('\n'));
  });
});
