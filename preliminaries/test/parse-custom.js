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
var YAML = require('js-yaml');
require('should');

var yaml = {};

yaml.parse = function(str, opts) {
  try {
    return YAML.safeLoad(str, opts);
  } catch (err) {
    throw new SyntaxError(err);
  }
}

describe('custom parser:', function() {
  it('should allow a custom parser to be registered:', function() {
    var actual = preliminaries.parse(fs.readFileSync('./test/fixtures/lang-yaml.md', 'utf8'), {
      parser: yaml
    });
    actual.data.title.should.equal('YAML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });
});
