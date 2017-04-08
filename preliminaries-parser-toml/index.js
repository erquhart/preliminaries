/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var TOML = require('toml');

/**
 * Parse TOML front matter.
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options` Options to pass to [toml-node].
 * @return {Object} Parsed object of data.
 * @api public
 */

preliminaries.parsers.toml = function(str, opts) {
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
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}
