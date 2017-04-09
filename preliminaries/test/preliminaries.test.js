/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');

describe('Test strings:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregisterParser('json');
  });

  it('should return `true` if the string has front matter', function() {
    preliminaries.test('---\nabc: xyz\n---').should.be.true;
    preliminaries.test('---yaml\nabc: xyz\n---').should.be.true;
    preliminaries.test('---yaml\nabc: xyz\n---', {delims: '---'}).should.be.true;
    preliminaries.test('{\n"abc": "xyz"\n}').should.be.true;
    preliminaries.test('---json\n{\n"abc": "xyz"\n}\n---').should.be.true;
    preliminaries.test('+++\nabc = "xyz"\n+++').should.be.true;
    preliminaries.test('~~~\nabc = "xyz"\n~~~').should.be.true;
    preliminaries.test('---toml\nabc = "xyz"\n---').should.be.true;
    preliminaries.test('~~~\nabc: xyz\n~~~', {delims: '~~~'}).should.be.true;
  });

  it('should return `false` if the string does not have valid front matter', function() {
    preliminaries.test('---\nabc: xyz\n---', {delims: '~~~'}).should.be.false;
    preliminaries.test('\nabc: xyz\n---').should.be.false;
    preliminaries.test('\n"abc": "xyz"\n}').should.be.false;
    preliminaries.test('\n"abc": "xyz"\n}\n---').should.be.false;
    preliminaries.test('\nabc = "xyz"\n+++').should.be.false;
    preliminaries.test('\nabc = "xyz"\n+++').should.be.false;
    preliminaries.test('\nabc: xyz\n}', {delims: '}'}).should.be.false;
    preliminaries.test('\nabc: xyz\n~~~', {delims: '~~~'}).should.be.false;
  });
});
