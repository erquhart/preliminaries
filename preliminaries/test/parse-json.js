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

describe('parse JSON:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregisterParser('json');
  });

  it('should parse JSON front matter', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-json.md', 'utf8'), {
      lang: 'json'
    });

    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should parse JSON front matter with default JSON delimiters', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/default-json.md', 'utf8'), {
      lang: 'json',
      delims: ['{', '}']
    });

    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should parse JSON front matter with custom delimiters', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/custom-json.md', 'utf8'), {
      lang: 'json',
      delims: '~~~'
    });

    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should auto-detect JSON as the language with no language defined after the first fence', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-no-lang-json.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should auto-detect JSON as the language', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-json.md', 'utf8'));
    actual.data.title.should.equal('autodetect-JSON');
    actual.should.have.property('content');
  });

  it('should export a JSON parser', function() {
    var jsonParser = preliminaries.jsonParser;
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-json.md', 'utf8'), {parser: jsonParser});
    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should throw on JSON syntax errors', function() {
    (function() {
      var fixture = '{\n"title:""Bad key"\n}\nContent\n';
      preliminaries.parse(fixture);
    }).should.throw('preliminaries parser [JSON]: SyntaxError: Unexpected string in JSON at position 9');
  });
});
