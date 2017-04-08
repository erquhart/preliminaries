/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var preliminaries = require('..');
var fs = require('fs');

describe('parse YAML:', function () {
  it('should parse YAML front matter.', function () {
    var actual = preliminaries(fs.readFileSync('./test/fixtures/lang-yaml.md', 'utf8'));
    actual.data.title.should.equal('YAML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should detect YAML as the language with no language defined after the first fence.', function () {
    var actual = preliminaries(fs.readFileSync('./test/fixtures/autodetect-no-lang.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should detect YAML as the language.', function () {
    var actual = preliminaries(fs.readFileSync('./test/fixtures/autodetect-yaml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-yaml');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should use safeLoad when specified.', function () {
    var fixture = '---\nabc: xyz\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    var actual = preliminaries(fixture, {safeLoad: true});
    actual.should.have.property('data', {abc: 'xyz', version: 2});
    actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    actual.should.have.property('orig');
  });
});
