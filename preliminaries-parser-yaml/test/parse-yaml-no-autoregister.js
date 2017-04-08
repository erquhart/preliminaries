/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var yamlParser = require('..');
var fs = require('fs');
require('should');

describe('parse YAML no auto register:', function() {
  it('should throw an error when lang is yaml', function() {
    (function() {
      preliminaries.parse(fs.readFileSync('./test/fixtures/lang-yaml.md', 'utf8'), {lang: 'yaml'});
    }).should.throw('preliminaries cannot find a parser for: ---\ntitle: YAML\n---\n\n# This page has YAML front matter!\n');
  });

  it('should export a YAML parser', function() {
    var fixture = '---\ntitle: YAML here\n---\n\n# This file has YAML front matter!\n';
    var actual = preliminaries.parse(fixture, {parser: yamlParser});
    actual.data.title.should.equal('YAML here');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });
});
