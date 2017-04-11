/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');

describe('Preliminaries.registered:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json');
  });

  it('should return `true` if a parser is already registered for the language', function() {
    var actual = preliminaries.registered('json');
    actual.should.be.true();
  });

  it('should return `true` if a parser is already registered for any language', function() {
    var actual = preliminaries.registered(['json', 'none']);
    actual.should.be.true();
  });

  it('should return `false` if a parser is not registered for the language', function() {
    var actual = preliminaries.registered('none');
    actual.should.be.false();
  });

  it('should return `false` if a parser is not registered for all of the languages', function() {
    var actual = preliminaries.registered(['none', 'gone']);
    actual.should.be.false();
  });
});
