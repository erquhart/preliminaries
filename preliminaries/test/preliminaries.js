'use strict';

var preliminaries = require('..');
var fs = require('fs');
require('should');

var lineEndings = ['\n', '\r\n'];

lineEndings.forEach(function(lineEnding) {
  describe('Read from strings with lineEnding ' + lineEnding.replace('\n', '\\n').replace('\r', '\\r') + ':', function () {
    it('should extract JSON front matter', function () {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---';
      var actual = preliminaries.parse(fixture, { delims: '---' });
      actual.should.have.property('data');
      actual.should.have.property('content');
      actual.should.have.property('orig');
      actual.data.should.have.property('abc');
      actual.data.abc.should.equal('xyz');
    });

    it('should throw an error when front matter cannot be parsed:', function() {
      (function() {
        var fixture = '---whatever' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---';
        preliminaries.parse(fixture, { delims: '---' });
      }).should.throw('preliminaries cannot find a parser for: ---whatever' + lineEnding + '{' + lineEnding + '"abc":"xyz"' + lineEnding + '}' + lineEnding + '---');
    });

    it('should throw an error when a string is not passed:', function() {
      (function() {
        preliminaries.parse()
      }).should.throw('preliminaries expects a string');
    });

    it('should return an object when the string is 0 length:', function() {
      preliminaries.parse('').should.eql({orig: '', data: {}, content: ''});
    });

    it('should extract JSON front matter and content', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '---' + lineEnding + '\n<span class="alert alert-info">This is an alert</span>\n';
      var actual = preliminaries.parse(fixture, { delims: '---' });
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
      actual.should.have.property('orig');
    });

    it('should use a custom delimiter as a string', function() {
      var fixture = '~~~' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '~~~' + lineEnding + '\n<span class="alert alert-info">This is an alert</span>\n';
      var actual = preliminaries.parse(fixture, {delims: '~~~'});
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '\n<span class="alert alert-info">This is an alert</span>\n');
      actual.should.have.property('orig');
    });

    it('should use custom delimiters as an array', function() {
      var fixture = '~~~' + lineEnding + '{' + lineEnding + '"abc":"xyz",' + lineEnding + '"version":2' + lineEnding + '}' + lineEnding + '~~~' + lineEnding + lineEnding + '<span class="alert alert-info">This is an alert</span>' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: ['~~~']});
      actual.should.have.property('data', {abc: 'xyz', version: 2});
      actual.should.have.property('content', '' + lineEnding + '<span class="alert alert-info">This is an alert</span>' + lineEnding);
      actual.should.have.property('orig');
    });

    it('should correctly identify delimiters and ignore strings that look like delimiters.', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '}' + lineEnding + '---' + lineEnding + 'here is some content' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: '---'});
      actual.should.have.property('data', {name: 'troublesome --- value'});
      actual.should.have.property('content', 'here is some content' + lineEnding);
      actual.should.have.property('orig', fixture);
    });

    it('should correctly parse a string that only has an opening delimiter', function() {
      var fixture = '---' + lineEnding + '{' + lineEnding + '"name":"troublesome --- value"' + lineEnding + '}' + lineEnding;
      var actual = preliminaries.parse(fixture, {delims: '---'});
      actual.should.have.property('data', {name: 'troublesome --- value'});
      actual.should.have.property('content', '');
      actual.should.have.property('orig', fixture);
    });

    it('should not try to parse a string has content that looks like front matter', function() {
      var fixture = '-----------name--------------value' + lineEnding + 'foo';
      var actual = preliminaries.parse(fixture);
      actual.should.have.property('data', {});
      actual.should.have.property('content', '-----------name--------------value' + lineEnding + 'foo');
      actual.should.have.property('orig', '-----------name--------------value' + lineEnding + 'foo');
    });

    it('should throw an error when the detected lang does not match the specified lang', function() {
      (function() {
        preliminaries.parse(fs.readFileSync('./test/fixtures/autodetect-json.md', 'utf8'), {lang: 'xyz'});
      }).should.throw('preliminaries detected a different lang: json to the one specified: xyz');
    });
  });
});