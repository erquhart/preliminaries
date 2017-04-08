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
var preliminaries = require('..');
function toUTF8Array(str) {
    return unescape(encodeURIComponent(str))

}
describe('parse TOML:', function () {
  it('should parse toml front matter.', function () {
    var actual = preliminaries('---\ntitle = "TOML"\ndescription = "Front matter"\ncategories = "front matter toml"\n---\n\n# This file has toml front matter!\n', {
      lang: 'toml'
    });
    actual.data.title.should.equal('TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect TOML as the language.', function () {
    var actual = preliminaries('---toml\ntitle = "autodetect-TOML"\n[props]\nuser = "jonschlinkert"\n---\nContent\n');
    actual.data.title.should.equal('autodetect-TOML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should NOT throw on TOML syntax errors when `strict` is NOT defined.', function () {
    (function () {
      preliminaries('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n');
    }).should.not.throw();
  });

  it('should throw on TOML syntax errors when `strict` IS defined.', function () {
    (function () {
      preliminaries('---toml\n[props\nuser = "jonschlinkert"\n---\nContent\n', {strict: true});
    }).should.throw(fs.readFileSync('./test/fixtures/strict-toml-error.txt', 'utf8'));
  });
});
