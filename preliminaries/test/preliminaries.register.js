/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');

describe('Preliminaries.register:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json');
    preliminaries.unregister('xyz');
    preliminaries.unregister('abc');
    preliminaries.unregister('edf');
    preliminaries.unregister('html');
    preliminaries.unregister('xhtml');
    preliminaries.unregister('xsl');
    preliminaries.unregister('svg');
  });

  it('should throw an error when registering a parser for another language with opening delimiters that clash with existing parser', function() {
    (function() {
      var parser = {delims: ['{', '>']};
      preliminaries.register(parser, 'xyz');
    }).should.throw('preliminaries cannot register the parser because the delimiters clash with an already registered parser for language: json');
  });

  it('should throw an error when registering a parser for a language that already has a parser', function() {
    (function() {
      preliminaries
        .register({}, 'abc')
        .register({}, 'abc');
    }).should.throw('preliminaries cannot register the parser because a parser is already registered for language: abc');
  });

  it('should register exactly the same parser for two different languages as aliases without error', function() {
    (function() {
      var parser = {delims: ['<html>', '</html>']};
      preliminaries
        .register(parser, 'html')
        .register(parser, 'xhtml');
    }).should.not.throw();
  });

  it('should register the same parser for all languages as aliases', function() {
    var parser = {delims: ['<xml>', '</root>']};
    preliminaries.register(parser, ['xml', 'xsl', 'svg']);
    preliminaries.registered('xml').should.be.true;
    preliminaries.registered('xsl').should.be.true;
    preliminaries.registered('svg').should.be.true;
  });
});
