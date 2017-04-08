/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var TOML = require('toml-js');

var tomlParser = function(autoRegister) {
  if (autoRegister) {
    var preliminaries = require('preliminaries');
    preliminaries.registerParser('toml', tomlParser);
  }
  return tomlParser;
};

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

tomlParser.parse = function(str, opts) {
  try {
    return TOML.parse(str);
  } catch (err) {
    if (opts.strict) {
      throw new SyntaxError(msg('TOML', err));
    } else {
      return {};
    }
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

tomlParser.stringify = function(data, options) {
  var res = TOML.dump(data);
  res = res.replace(/(?:\r?\n){1,2}$/, '\n');
  return res;
}

/**
 * Expose `tomlParser`
 */

module.exports = tomlParser;

/**
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}
