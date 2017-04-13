/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
require('should');

describe('Preliminaries.stringify:', function() {
  var preliminaries;

  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json');
  });

  it('should stringify lang if stringifyUseParserDelims is but parser has no delims', function() {
    var parser = function() {
    }
    parser.stringify = function() {
      return '';
    }
    var actual = preliminaries.stringify('Content', {title: 'Parser'}, {lang: 'mine', parser: parser, stringifyUseParserDelims: true});
    actual.should.equal([
      '---mine',
      '---',
      'Content\n'
    ].join('\n'))
  });
});
