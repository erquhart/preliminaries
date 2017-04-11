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

describe('parse YAML:', function() {
  var yamlParser;
  
  before(function() {
    yamlParser = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('yaml');
  });

  it('should parse YAML front matter', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-yaml.md', 'utf8'), {lang: 'yaml'});
    actual.data.title.should.equal('YAML');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should export a YAML parser', function() {
    var fixture = '---\ntitle: YAML here\ncategories:\n - front\n - matter\n---\n\n# This file has YAML front matter!\n';
    var actual = preliminaries.parse(fixture, {parser: yamlParser});
    actual.data.title.should.equal('YAML here');
    actual.data.categories.join(',').should.equal('front,matter');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should auto-detect YAML as the language with no language defined after the first fence', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-no-lang-yaml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should auto-detect YAML as the language', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-yaml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-yaml');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });

  it('should throw on YAML syntax errors', function() {
    (function() {
      var fixture = '---\nbad\nkey: value\n---\nContent\n';
      preliminaries.parse(fixture);
    }).should.throw('preliminaries parser [js-yaml]: YAMLException: end of the stream or a document separator is expected at line 2, column 4:\n    key: value\n       ^');
  });
});
