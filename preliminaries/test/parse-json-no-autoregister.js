/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('..');
var fs = require('fs');
require('should');

describe('parse JSON no auto register:', function() {
  it('should throw an error when lang is json', function() {
    (function() {
      preliminaries.parse(fs.readFileSync('./test/fixtures/lang-json.md', 'utf8'), {lang: 'json'});
    }).should.throw('preliminaries cannot find a parser for: ---\n{\n  "title": "JSON",\n  "description": "Front Matter"\n}\n---\n\n# This page has JSON front matter!');
  });

  it('should export a JSON parser', function() {
    var fixture = '---\n{\n"title": "JSON"\n}\n---\n\n# This file has JSON front matter!\n';
    var actual = preliminaries.parse(fixture, {parser: preliminaries.jsonParser});
    actual.data.title.should.equal('JSON');
    actual.should.have.property('data');
    actual.should.have.property('content');
  });
});
