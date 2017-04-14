/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var TOML = require('toml');
var tomljs = require('toml-js');
TOML.stringify = tomljs.dump;

function tomlParser(register) {
  if (register) {
    var preliminaries = require('preliminaries');
    preliminaries.register(tomlParser);
  }
  return tomlParser;
};

/**
 * Language
 */
tomlParser.lang = 'toml';

/**
 * Standard TOML delimiters
 */
tomlParser.delims = '+++';

/**
 * Parse TOML front matter.
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options` Options.
 * @return {Object} Parsed object of data.
 * @api public
 */

tomlParser.parse = function parse(str, options) {
  try {
    return TOML.parse(str);
  } catch (err) {
    throw new SyntaxError(msg('TOML', err));
  }
};

/**
 * Stringify front matter
 *
 * @param  {Object} `data` The data to stringify.
 * @param  {Object} `options` Options.
 * @return {String} Stringified data.
 * @api public
 */

tomlParser.stringify = function stringify(data, options) {
  var res = TOML.stringify(data);
  res = res.replace(/(?:\r?\n){1,2}$/, '\n');
  return res;
};

/**
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}

/**
 * Expose `tomlParser`
 */

module.exports = tomlParser;
