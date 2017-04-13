/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var fs = require('fs');
require('should');

describe('parse JSON5:', function() {
  var json5Parser;
  
  before(function() {
    json5Parser = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json5');
  });

  it('should parse JSON5 front matter', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-json5.md', 'utf8'), {
      lang: 'json5'
    });

    actual.data.title.should.equal('JSON5');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should parse JSON front matter with default JSON delimiters', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/default-json5.md', 'utf8'), {
      lang: 'json5',
      delims: ['{', '}']
    });

    actual.data.title.should.equal('JSON5');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should parse JSON5 front matter with custom delimiters', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/custom-json5.md', 'utf8'), {
      lang: 'json5',
      delims: '~~~'
    });

    actual.data.title.should.equal('JSON5');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should auto-detect JSON5 as the language', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-json5.md', 'utf8'));
    actual.data.title.should.equal('autodetect-JSON5');
    actual.should.have.property('content');
  });

  it('should export a JSON5 parser', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-json5.md', 'utf8'), {parser: json5Parser});
    actual.data.title.should.equal('JSON5');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should throw on JSON5 syntax errors', function() {
    (function() {
      var fixture = '{\n"title:Bad key"\n}\nContent\n';
      var actual = preliminaries.parse(fixture, {lang: 'json5', delims: ['{', '}']});
      console.log('json5', actual)
    }).should.throw('preliminaries parser [JSON5]: SyntaxError: Expected \':\' instead of \'}\' at line 1 column 18 of the JSON5 data. Still to read: "}"');
  });
});
