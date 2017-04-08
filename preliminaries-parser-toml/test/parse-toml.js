/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var toml = require("..");
var fs = require('fs');
require('should');

describe('parse TOML:', function () {
  it('should parse toml front matter.', function () {
    var actual = preliminaries.parse('---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n', {
      lang: 'toml'
    });
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should provide a TOML parser.', function () {
    preliminaries.parsers.abc = toml;
    var actual = preliminaries.parse('---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n', {
      lang: 'abc'
    });
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it.only('should auto-detect TOML as the language with no language defined after the first fence.', function () {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-no-lang-toml.md', 'utf8'));
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect TOML as the language.', function () {
    var actual = preliminaries.parse('---toml\ntitle = "autodetect-TOML"\n[props]\nuser = "jonschlinkert"\n---\nContent\n');
    actual.data.title.should.equal('autodetect-TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should NOT throw on TOML syntax errors when `strict` is NOT defined.', function () {
    (function () {
      preliminaries.parse('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n');
    }).should.not.throw();
  });

  it('should throw on TOML syntax errors when `strict` IS defined.', function () {
    (function () {
      preliminaries.parse('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n', {strict: true});
    }).should.throw(fs.readFileSync('./test/fixtures/strict-toml-error.txt', 'utf8'));
  });
});
