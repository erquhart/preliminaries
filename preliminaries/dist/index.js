(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.preliminaries = global.preliminaries || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/**
 * Return true if the given `ch` the first
 * thing in the string.
 */

function isFirst(str, ch) {
  return str.substr(0, ch.length) === ch;
}

/**
 * Utility to strip byte order marks.
 */
function stripBom(str) {
  return str.charAt(0) === "\uFEFF" ? str.slice(1) : str;
}

/**
 * Typecast `val` to an array.
 */
function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
}

/**
 * Infer the language from the first delimiter 
 * if a parser is registered for that delimiter.
 */
function inferLang(str, delims, langSelector) {
  var len = str.length;
  // Don't infer if the document has a language in the front matter like `---yaml`
  var delimsArr = arrayify(delims);
  var firstDelimLen = delimsArr[0].length;
  if (len >= firstDelimLen + 1 && str.substr(0, firstDelimLen) === delimsArr[0]) {
    var charAfterFirstDelim = str.charAt(firstDelimLen);
    if (charAfterFirstDelim !== "\n" && charAfterFirstDelim !== "\r" && str.charAt(firstDelimLen + 1) !== "\n") {
      return null;
    }
  }
  var firstFoundDelimLen = str.indexOf("\n");
  if (firstFoundDelimLen < 1) {
    return null;
  }
  var firstFoundDelim = str.substr(0, firstFoundDelimLen);
  var firstFoundDelimLastCharIdx = firstFoundDelim.length - 1;
  firstFoundDelim = firstFoundDelim.charAt(firstFoundDelimLastCharIdx) === "\r" ? firstFoundDelim.substr(0, firstFoundDelimLastCharIdx) : firstFoundDelim;
  firstFoundDelim = firstFoundDelim.trim();
  return !!firstFoundDelim ? langSelector(firstFoundDelim) : null;
}

var Preliminaries = function () {
  function Preliminaries(options) {
    classCallCheck(this, Preliminaries);

    this.__defaultLang = options && options.lang || "json";
    this.__defaultDelims = options && options.delims || "---";
    this.__parsers = {};
    this.__parsersByFirstDelim = {};
  }

  /**
   * Returns the default language for this preliminaries instance.
   */


  createClass(Preliminaries, [{
    key: "parse",


    /**
     * Parses a `string` of front matter with the given `options`,
     * and returns an object.
     */
    value: function parse(str, options) {
      var _this = this;

      if (typeof str !== "string") {
        throw new Error("preliminaries.parse: expected a string to parse as the first argument");
      }
      if (str === "") {
        return { data: {}, content: "" };
      }
      // Strip byte order marks
      str = stripBom(str);
      var len = str.length;
      // If no delimiters are set and if no parser and no language is defined,
      // try to infer the language by matching the first delimiter with parsers
      var infer = !options || !options.delims && !options.lang && !options.parser;
      var inferredLang = infer ? inferLang(str, this.__defaultDelims, function (d) {
        return _this.__parsersByFirstDelim[d];
      }) : null;
      var inferredDelims = inferredLang ? this.__parsers[inferredLang].defaultDelims : null;
      // Delimiters
      var delims = arrayify(options && options.delims || inferredDelims || this.__defaultDelims);
      // If the first delim isn't the first thing, return
      var firstDelim = delims[0];
      if (!isFirst(str, firstDelim)) {
        return { data: {}, content: "" };
      }
      var firstDelimLen = firstDelim.length;
      var newlineLastDelim = "\n" + (delims[1] || delims[0]);
      // If the next character after the first delim
      // is a character in the first delim, then just
      // return the default object. It's either a bad
      // delim or not a delimiter at all.
      var charAfterFirstDelim = str.charAt(firstDelimLen);
      if (charAfterFirstDelim && firstDelim.indexOf(charAfterFirstDelim) !== -1) {
        return { data: {}, content: "" };
      }
      // Find the index of the next delimiter before
      // going any further. If not found, treat the end
      // of the document as the end.
      var lastDelimIdx = str.indexOf(newlineLastDelim, firstDelimLen + 1);
      var end = lastDelimIdx === -1 ? len : lastDelimIdx;
      // Detect a language from after the first delimiters, if defined
      var detectedLang = str.slice(firstDelimLen, str.indexOf("\n"));
      // Measure the lang before trimming whitespace
      var start = firstDelimLen + detectedLang.length;
      detectedLang = detectedLang.trim();
      // Check languages match if language is important
      // i.e. a custom parser is not defined.
      var detectedLanguageAndNoCustomParser = !!detectedLang && (!options || !options.parser);
      if (detectedLanguageAndNoCustomParser && options && options.lang && detectedLang !== options.lang) {
        throw new Error("preliminaries.parse: detected a different lang '" + detectedLang + "' to the lang option '" + options.lang + "'");
      }
      // The final language
      var lang = options && options.lang || detectedLang || inferredLang || this.__defaultLang;
      // Get the front matter
      var frontmatter = str.slice(start, end).trim();
      var data = {};
      if (frontmatter) {
        // If data exists, see if we have a matching parser
        var _parser = options && options.parser || this.__parsers[lang];
        if (!_parser) {
          throw new Error("preliminaries.parse: cannot find a parser for lang '" + lang + "'");
        }
        if (!_typeof(_parser.parse) !== "function") {
          throw new Error("preliminaries.parse: parser for lang '" + lang + "' does not have a parse method");
        }
        // Protect against a bad parser returning null
        data = _parser.parse(frontmatter) || {};
      }
      // Grab the content from the string, stripping
      // an optional new line after the second delim.
      var content = str.substr(lastDelimIdx + newlineLastDelim.length);
      if (content.charAt(0) === "\n") {
        content = content.substr(1);
      } else if (content.charAt(0) === "\r" && content.charAt(1) === "\n") {
        content = content.substr(2);
      }
      return { data: data, content: content };
    }

    /**
     * Stringify an object to front matter, and concatenate it to the given string.
     */

  }, {
    key: "stringify",
    value: function stringify(str, data, options) {
      var lang = options && options.lang || this.__defaultLang;
      var parser = options && options.parser || this.__parsers[lang];
      if (!parser) {
        throw new Error("preliminaries.stringify: cannot find a parser for lang '" + lang + "'");
      }
      if (!_typeof(parser.stringify) !== "function") {
        throw new Error("preliminaries.stringify: parser for lang '" + lang + "' does not have a stringify method");
      }
      var useParserDelims = !!(options && options.useParserDelims && parser.defaultDelims);
      var includeLang = options && options.includeLang || (!options || typeof options.includeLang === "undefined") && !useParserDelims && (!options || !options.delims);
      var delims = arrayify(options && options.delims || (useParserDelims ? parser.defaultDelims : this.__defaultDelims));
      var result = delims[0] + (includeLang ? lang : "") + "\n";
      result += parser.stringify(data, { lang: lang, delims: delims });
      result += (delims[1] || delims[0]) + "\n";
      result += str + "\n";
      return result;
    }

    /**
     * Return true if the given string `str` has front matter.
     */

  }, {
    key: "test",
    value: function test(str, options) {
      var delims = arrayify(options && options.delims || this.__defaultDelims);
      return isFirst(str, delims[0]);
    }

    /**
     * Register a parser.
     */

  }, {
    key: "register",
    value: function register(parser, options) {
      var _this2 = this;

      if (!parser) {
        throw new Error("preliminaries.register: expected a parser as the first argument");
      }
      if (!(options && options.lang) && !parser.defaultLang) {
        throw new Error("preliminaries.register: expected a parser with a defaultLang property or a lang option");
      }
      var langs = arrayify(options && options.lang || parser.defaultLang);
      langs.forEach(function (lang) {
        if (typeof lang !== "string") {
          throw new Error("preliminaries.register: expected lang to be a string but got '" + lang + "'");
        }
        if (_this2.__parsers[lang]) {
          throw new Error("preliminaries.register: cannot register the parser because a parser is already registered for lang '" + lang + "'");
        }
      });
      if (options && options.delims || parser.defaultDelims) {
        var _delims = arrayify(options && options.delims || parser.defaultDelims);
        var firstDelim = _delims[0];
        var registeredParserLang = this.__parsersByFirstDelim[firstDelim];
        var registeredParser = registeredParserLang ? this.__parsers[registeredParserLang] : null;
        if (registeredParserLang && registeredParser && registeredParser !== parser) {
          throw new Error("preliminaries.register: cannot register the parser because the opening delims '" + _delims[0] + "' clash with an already registered parser for lang '" + registeredParserLang + "'");
        }
        this.__parsersByFirstDelim[firstDelim] = langs[0];
      }
      langs.forEach(function (lang) {
        _this2.__parsers[lang] = parser;
      });
      return this;
    }

    /**
     * Unegister a parser.
     */

  }, {
    key: "unregister",
    value: function unregister(parserOrOptions, options) {
      var _this3 = this;

      if (!parserOrOptions) {
        throw new Error("preliminaries.unregister: expected a parser or options as the first argument");
      }
      var anyParserOrOptions = parserOrOptions;
      var hasParser = arguments.length > 1 || typeof anyParserOrOptions.parse === "function" || typeof anyParserOrOptions.stringify === "function";
      var possibleOptions = hasParser ? options : parserOrOptions;
      var parser = hasParser ? parserOrOptions : null;
      // Must be a parser with a defaultLang or
      // defaultDelims or some options with a lang or delims.
      if (!(parser && (parser.defaultLang || parser.defaultDelims)) || !(possibleOptions && (possibleOptions.lang || possibleOptions.delims))) {
        throw new Error("preliminaries.unregister: nothing to unregister, expected a parser with a defaultLang or defaultDelims property and/or lang or delims options");
      }
      // Delete parser by language, if any
      if (possibleOptions && possibleOptions.lang || parser.defaultLang) {
        var langs = arrayify(possibleOptions && possibleOptions.lang || parser.defaultLang);
        langs.forEach(function (lang) {
          if (typeof lang !== "string") {
            throw new Error("preliminaries.unregister: expected lang to be a string but got '" + lang + "'");
          }
          delete _this3.__parsers[lang];
        });
      }
      // Delete registrations by delimiter, if any
      if (possibleOptions && possibleOptions.delims || parser.defaultDelims) {
        var _delims2 = arrayify(possibleOptions && possibleOptions.delims || parser.defaultDelims);
        delete this.__parsersByFirstDelim[_delims2[0]];
      }
      return this;
    }

    /**
     * Check if a parser is registerable for the language, or all of the languages if an array is given.
     */

  }, {
    key: "registerable",
    value: function registerable(parser, options) {
      var _this4 = this;

      if (!parser) {
        throw new Error("preliminaries.registerable: expected a parser as the first argument");
      }
      if (!(options && options.lang) && !parser.defaultLang) {
        throw new Error("preliminaries.registerable: expected a parser with a defaultLang property or a lang option");
      }
      var langs = arrayify(options && options.lang || parser.defaultLang);
      var everyLangNotRegistered = langs.every(function (lang) {
        if (typeof lang !== "string") {
          throw new Error("preliminaries.registerable: expected lang to be a string but got '" + lang + "'");
        }
        return !_this4.__parsers[lang];
      });
      var anyLangRegistered = !everyLangNotRegistered;
      if (anyLangRegistered) {
        return false;
      }
      // Make sure the opening delimiters are unique (if present)
      // or if not, that this is exactly the same parser (so an alias for an existing language).
      if (options && options.delims || parser.defaultDelims) {
        var _delims3 = arrayify(options && options.delims || parser.defaultDelims);
        var firstDelim = _delims3[0];
        var registeredParserLang = this.__parsersByFirstDelim[firstDelim];
        var registeredParser = registeredParserLang ? this.__parsers[registeredParserLang] : null;
        if (registeredParser && registeredParser !== parser) {
          return false;
        }
      }
      return true;
    }

    /**
     * Check if a parser is registered for a language or delimiters. You can pass an array
     * of languages to check if a parser is registered for any langauge.
     */

  }, {
    key: "registered",
    value: function registered(options) {
      var _this5 = this;

      // Check if a parser is registered for any language, if any
      if (options && options.lang) {
        var langs = arrayify(options && options.lang);
        var everyLangNotRegistered = langs.every(function (lang) {
          if (typeof lang !== "string") {
            throw new Error("preliminaries.registered: expected lang to be a string but got '" + lang + "'");
          }
          return !_this5.__parsers[lang];
        });
        var anyLangRegistered = !everyLangNotRegistered;
        if (anyLangRegistered) {
          return true;
        }
      }
      // Check if a parser is registered for the delims, if any
      if (options && options.delims) {
        var _delims4 = arrayify(options.delims);
        var firstDelim = _delims4[0];
        var registeredParserLang = this.__parsersByFirstDelim[firstDelim];
        var registeredParser = registeredParserLang ? this.__parsers[registeredParserLang] : null;
        if (registeredParser) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "defaultLang",
    get: function get$$1() {
      return this.__defaultLang;
    }

    /**
     * Returns the default delimiters for this preliminaries instance.
     */

  }, {
    key: "defaultDelims",
    get: function get$$1() {
      return this.__defaultDelims;
    }
  }]);
  return Preliminaries;
}();

function preliminaries(options) {
  return new Preliminaries(options);
}

exports.Preliminaries = Preliminaries;
exports['default'] = preliminaries;

Object.defineProperty(exports, '__esModule', { value: true });

})));
