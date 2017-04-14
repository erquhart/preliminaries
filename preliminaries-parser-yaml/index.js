/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var YAML = require('js-yaml');

function yamlParser(register) {
  if (register) {
    var preliminaries = require('preliminaries');
    preliminaries.register(yamlParser);
  }
  return yamlParser;
};

/**
 * Language
 */
yamlParser.lang = 'yaml';

/**
 * Standard YAML delimiters
 */
yamlParser.delims = '---';

/**
 * Parse YAML front matter
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options` Options.
 * @return {Object} Parsed object of data.
 * @api public
 */

yamlParser.parse = function parse(str, options) {
  try {
    return YAML.safeLoad(str, options);
  } catch (err) {
    throw new SyntaxError(msg('js-yaml', err));
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

yamlParser.stringify = function stringify(data, options) {
  var res = YAML.safeDump(data, options);
  return res;
};

/**
 * Normalize error messages
 */

function msg(lang, err) {
  return 'preliminaries parser [' + lang + ']: ' + err;
}

/**
 * Expose `yamlParser`
 */

module.exports = yamlParser;
