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

describe('parse json:', function () {
  it('should parse JSON front matter.', function () {
    var actual = preliminaries(fs.readFileSync('./test/fixtures/lang-json.md', 'utf8'), {
      lang: 'json'
    });

    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should auto-detect JSON as the language.', function () {
    var actual = preliminaries(fs.readFileSync('./test/fixtures/autodetect-json.md', 'utf8'));
    actual.data.title.should.equal('autodetect-JSON');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });
});