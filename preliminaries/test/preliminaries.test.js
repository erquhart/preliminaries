/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('..');
require('should');

describe('Read from strings:', function () {
  it('should return `true` if the string has front matter', function () {
    preliminaries.test('---\nabc: xyz\n---').should.be.true;
    preliminaries.test('---\nabc: xyz\n---', {delims: '~~~'}).should.be.false;
    preliminaries.test('~~~\nabc: xyz\n~~~', {delims: '~~~'}).should.be.true;
    preliminaries.test('\nabc: xyz\n---').should.be.false;
  });
});
