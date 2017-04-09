/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');

describe('Preliminaries.registerParser:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregisterParser('json');
    preliminaries.unregisterParser('xyz');
    preliminaries.unregisterParser('abc');
  });

  it('should throw an error when registering a parser for another language with delims that clash with existing parser', function() {
    (function() {
      preliminaries.registerParser('xyz', preliminaries.jsonParser);
    }).should.throw('preliminaries cannot register the parser because the delimiters clash with an already registered parser for language: json');
  });

  it('should throw an error when registering a parser for a language that already has a parser', function() {
    (function() {
      preliminaries.registerParser('abc', {});
      preliminaries.registerParser('abc', {});
    }).should.throw('preliminaries cannot register the parser because a parser is already registered for language: xyz');
  });
});
