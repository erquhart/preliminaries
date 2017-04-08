/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var yaml = require("..");
var fs = require('fs');
require('should');

describe('parse YAML:', function () {
  it('should parse YAML front matter.', function () {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-yaml.md', 'utf8'), {
      lang: 'yaml'
    });
    actual.data.title.should.equal('YAML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect YAML as the language with no language defined after the first fence.', function () {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-no-lang-yaml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect YAML as the language.', function () {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-yaml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-yaml');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });
});
