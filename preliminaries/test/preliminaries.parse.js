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

var lineEndings = ['\n', '\r\n'];
lineEndings.forEach(function(lineEnding) {
  describe('Preliminaries.parse read from strings with lineEnding ' + lineEnding.replace('\n', '\\n').replace('\r', '\\r') + ':', function() {
    var preliminaries;
  
    before(function() {
      preliminaries = require('..')(true);
    });

    after(function() {
      preliminaries.unregister('json');
    });

    afterEach(function() {
      preliminaries.unregister('xoy');
      preliminaries.unregister('abc');
    });

    it('should extract JSON front matter', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---';
      var actual = preliminaries.parse(fixture, { delims: '---' });
      actual.should.have.property('data');
      actual.should.have.property('content');
      actual.data.should.have.property('abc');
      actual.data.abc.should.equal('xyz');
    });

    it('should autodetect JSON', function() {
      var fixture = '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}';
      var actual = preliminaries.parse(fixture);
      actual.should.have.property('data');
      actual.should.have.property('content');
      actual.data.should.have.property('abc');
      actual.data.abc.should.equal('xyz');
    });

    it('should throw an error when front matter cannot be parsed', function() {
      (function() {
        var fixture = '---whatever' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---';
        preliminaries.parse(fixture, { delims: '---' });
      }).should.throw('preliminaries cannot find a parser for: ---whatever' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---');
    });

    it('should throw an error when a string is not passed', function() {
      (function() {
        preliminaries.parse();
      }).should.throw('preliminaries expects a string');
    });

    it('should return an object when the string is 0 length', function() {
      preliminaries.parse('').should.eql({data: {}, content: ''});
    });

    it('should extract JSON front matter and content', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '---' + lineEnding + '\n<span class="alert alert-info">This is an alert</span>\n';
      var actual = preliminaries.parse(fixture, { delims: '---' });
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    });

    it('should use a custom delimiter as a string', function() {
      var fixture = '~~~' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '~~~' + lineEnding + '\n<span class="alert alert-info">This is an alert</span>\n';
      var actual = preliminaries.parse(fixture, {delims: '~~~'});
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
    });

    it('should use custom delimiters as an array', function() {
      var fixture = '~~~' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '~~~' + lineEnding + lineEnding + '<span class="alert alert-info">This is an alert</span>' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: ['~~~']});
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '' + lineEnding + '<span class="alert alert-info">This is an alert</span>' + lineEnding);
    });

    it('should correctly identify delimiters and ignore strings that look like delimiters', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '}' + lineEnding + '---' + lineEnding + 'here is some content' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: '---'});
      actual.should.have.property('data', {name: 'troublesome --- value'});
      actual.should.have.property('content', 'here is some content' + lineEnding);
    });

    it('should correctly parse a string that only has an opening delimiter', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '}' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: '---'});
      actual.should.have.property('data', {name: 'troublesome --- value'});
      actual.should.have.property('content', '');
    });

    it('should correctly parse a string that is only the open delimiter', function() {
      var fixture = '{' + lineEnding;
      var actual = preliminaries.parse(fixture);
      actual.should.eql({data: {}, content: ''});
    });

    it('should correctly parse a string that is only the open delimiter and language', function() {
      var fixture = '{json' + lineEnding;
      var actual = preliminaries.parse(fixture);
      actual.should.eql({data: {}, content: fixture});
    });

    it('should correctly parse a string without a close delimiter', function() {
      var fixture = '{' + lineEnding + '"title":"JSON",' + lineEnding + '"description":"A nice story"';
      var actual = preliminaries.parse(fixture);
      actual.should.eql({data: {title: 'JSON', description: 'A nice story'}, content: ''});
    });

    it('should not try to parse a string has content that looks like front matter', function() {
      var fixture = '-----------name--------------value' + lineEnding + 'foo';
      var actual = preliminaries.parse(fixture);
      actual.should.have.property('data', {});
      actual.should.have.property('content', '-----------name--------------value' + lineEnding + 'foo');
    });

    it('should pass on detected language to parser', function() {
      var actualLang = null;
      var parser = {};
      parser.delims = '###';
      parser.parse = function(str, options) {
        actualLang = options.lang;
        return str;
      };
      preliminaries.register('abc', parser);
      var fixture = '---abc' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '---' + lineEnding + 'here is some content' + lineEnding;
      preliminaries.parse(fixture);
      actualLang.should.equal('abc');
    });

    it('should pass on inferred language to parser', function() {
      var actualLang = null;
      var parser = {};
      parser.delims = ['>>>', '<<<'];
      parser.parse = function(str, options) {
        actualLang = options.lang;
        return str;
      };
      preliminaries.register('xoy', parser);
      var fixture = '>>>' + lineEnding + '{' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '}' + lineEnding + '<<<' + lineEnding + 'here is some content' + lineEnding;
      preliminaries.parse(fixture);
      actualLang.should.equal('xoy');
    });
  });
});

describe('Preliminaries.parse:', function() {
  var preliminaries;
  
  before(function() {
    preliminaries = require('..')(true);
  });

  after(function() {
    preliminaries.unregister('json');
  });

  afterEach(function() {
    preliminaries.unregister('xyz');
  });

  it('should throw an error when the detected lang does not match the specified lang', function() {
    (function() {
      preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-json.md', 'utf8'), {lang: 'xyz'});
    }).should.throw('preliminaries detected a different language: json to the one specified: xyz');
  });

  it('should return the content for a string that is only the open delimiter', function() {
    var fixture = '{';
    var actual = preliminaries.parse(fixture);
    actual.should.eql({data: {}, content: fixture});
  });

  it('should return the content for a string that is only the open delimiter and language', function() {
    var fixture = '{json';
    var actual = preliminaries.parse(fixture);
    actual.should.eql({data: {}, content: fixture});
  });
});
