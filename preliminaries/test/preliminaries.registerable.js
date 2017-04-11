/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');

describe('Preliminaries.registerable:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json');
  });

  it('should return `false` if a parser is already registered for the language', function() {
    var parser = {};
    var actual = preliminaries.registerable('json', parser);
    actual.should.be.false();
  });

  it('should return `false` if a parser is already registered for any language', function() {
    var parser = {};
    var actual = preliminaries.registerable(['json', 'none'], parser);
    actual.should.be.false();
  });

  it('should return `false` if a parser is already registered with the same opening delimiters', function() {
    var parser = {delims: ['{', '>']};
    var actual = preliminaries.registerable('none', parser);
    actual.should.be.false();
  });

  it('should return `true` if no parser is registered for the language and the opening delimiters are unique', function() {
    var parser = {delims: ['<', '>']};
    var actual = preliminaries.registerable('none', parser);
    actual.should.be.true();
  });

  it('should return `true` if no parser is registered for all of the languages and the opening delimiters are unique', function() {
    var parser = {delims: ['<', '>']};
    var actual = preliminaries.registerable(['none', 'none2'], parser);
    actual.should.be.true();
  });
});
