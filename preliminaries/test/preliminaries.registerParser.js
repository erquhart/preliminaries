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

describe('Preliminaries.registerParser:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregisterParser('json');
  });

  it('should throw an error when registering a parser for another lang with delims that clash with existing parser', function() {
    (function() {
      preliminaries.registerParser('xyz', preliminaries.jsonParser);
    }).should.throw('preliminaries cannot register the parser because the delimiters clash with an already registered parser for lang: json');
  });
});
