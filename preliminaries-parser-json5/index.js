/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var JSON5 = require('json5');

var json5Parser = function(register) {
  if (register) {
    var preliminaries = require('preliminaries');
    preliminaries.register(json5Parser);
  }
  return json5Parser;
};

/**
 * Standard json delimiters
 */
// Disabled until registering with alternate/no delims is supported by
// `preliminaries.register` so that auto-registering the included json parser
// and the json5 parser does not cause an error
//json5Parser.delims = ['{', '}'];

/**
 * Language
 */
json5Parser.lang = 'json5';

/**
 * Parse JSON front matter
 *
 * @param  {String} `str` The string to parse.
 * @return {Object} Parsed object of data.
 */

json5Parser.parse = function parse(str, options) {
  var opts = options || {};
  var delims = arrayify(opts.delims || '---');
  try {
    var standard = delims.length === 2 && delims[0] === '{' && delims[1] === '}';
    var inp = standard ? '{' : '';
    inp += str;
    inp += standard ? '}' : '';
    return JSON5.parse(inp);
  } catch (err) {
    throw new SyntaxError(msg('JSON5', err));
  }
};

/**
 * Stringify front matter
 *
 * @param  {Object} `data` The data to stringify.
 * @return {String} Stringified data.
 */

json5Parser.stringify = function stringify(data, options) {
  var delims = arrayify(options && options.delims || '---');
  var res = JSON5.stringify(data);
  var standard = delims.length === 2 && delims[0] === '{' && delims[1] === '}';
  res = res.replace(/^{/, (standard ? '' : '{\n'));
  res = res.replace(/}$/, (standard ? '' : '\n}'));
  res += '\n';
  return res;
};

/**
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}

/**
 * Typecast `val` to an array.
 */

function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
}

/**
 * Expose `json5Parser`
 */

module.exports = json5Parser;
