/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var preliminaries = require('preliminaries');
var extend = require('extend-shallow');
var YAML = require('js-yaml');

/**
 * Expose `yaml`
 */

var yaml = {};

module.exports = yaml;

/**
 * Register as the default yaml parser
 */

preliminaries.parsers.yaml = yaml;

/**
 * Standard YAML delimiters
 */
yaml.delims = '---';

/**
 * Parse YAML front matter
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options` Options to pass to [js-yaml].
 * @return {Object} Parsed object of data.
 * @api public
 */

yaml.parse = function(str, options) {
  var opts = extend({strict: false}, options);
  try {
    return YAML.safeLoad(str, options);
  } catch (err) {
    if (opts.strict) {
      throw new SyntaxError(msg('js-yaml', err));
    } else {
      return {};
    }
  }
};

yaml.stringify = function(data, options) {
  var res = YAML.safeDump(data, options);
  return res;
}

/**
 * Typecast `val` to an array.
 */

function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
}

/**
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}
