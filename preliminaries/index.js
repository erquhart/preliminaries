/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (c) 2017, Joseph Earl.
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// @flow
"use strict";

/**
 * Return true if the given `ch` the first
 * thing in the string.
 */
function isFirst(str: string, ch: string): boolean {
  return str.substr(0, ch.length) === ch;
}

/**
 * Utility to strip byte order marks
 */
function stripBom(str: string): string {
  return str.charAt(0) === "\uFEFF" ? str.slice(1) : str;
}

/**
 * Typecast `val` to an array.
 */
function arrayify(val: any): any[] {
  return !Array.isArray(val) ? [val] : val;
}

type PreliminariesConstructorOptions = {
  lang: ?string;
  delims: ?(string | string[]);
}

type PreliminariesParseOptions = {
  lang: ?string;
  delims: ?(string | string[]);
  parser: ?any;
}

type PreliminariesParseResult = {
  data: any;
  content: string;
}

type PreliminariesStringifyOptions = {
  lang: ?string;
  delims: ?(string | string[]);
  parser: ?any;
  includeLang: ?boolean;
  useParserDelims: ?boolean;
}

type PreliminariesTestOptions = {
  delims: ?(string | string[]);
}

type PreliminariesRegisterOptions = {
  lang: ?(string | string[]);
  delims: ?(string | string[]);
}

type PreliminariesParserOptions = {
  lang: string;
  delims: string[];
}

class Preliminaries {
  __defaultLang: string;
  __defaultDelims: string | string[];
  __parsers: { [string]: any };
  __parsersLangByFirstDelim: { [string]: string };

  constructor(options: ?PreliminariesConstructorOptions) {
    this.__defaultLang = options && options.lang || 'json';
    this.__defaultDelims = options && options.delims || '---';
    this.__parsers = {};
    this.__parsersLangByFirstDelim = {};
  }

  /**
   * Returns the default language for this preliminaries instance.
   */
  get defaultLang(): string {
    return this.__defaultLang;
  }

  /**
   * Returns the default delimiters for this preliminaries instance.
   */
  get defaultDelims(): string | string[] {
    return this.__defaultDelims;
  }

  /**
   * Parses a `string` of front matter with the given `options`,
   * and returns an object.
   */
  parse(str: string, options: ?PreliminariesParseOptions): PreliminariesParseResult {
    if (typeof str !== 'string') {
      throw new Error('preliminaries.parse: expected a string to parse as the first argument');
    }
    if (str === '') {
      return { data: {}, content: '' };
    }
    // Strip byte order marks
    str = stripBom(str);
    const len: number = str.length;
    // If no delimiters are set and if no parser and no language is defined,
    // try to infer the language by matching the first delimiter with parsers
    let foundLang: ?string = null;
    let foundDelims: ??(string | string[]) = null;
    if (!options || (!options.delims && !options.lang && !options.parser)) {
      let infer: boolean = true;
      // Don't infer if the document has a language in the front matter like `---yaml`
      const defaultDelimsArr: string[] = arrayify(this.__defaultDelims);
      const firstDefaultDelimLen: number = defaultDelimsArr[0].length;
      if (len >= firstDefaultDelimLen + 1 && str.substr(0, firstDefaultDelimLen) === defaultDelimsArr[0]) {
        const charAfterFirstDefaultDelim: string = str.charAt(firstDefaultDelimLen);
        if (charAfterFirstDefaultDelim !== '\n' && (charAfterFirstDefaultDelim !== '\r' && str.charAt(firstDefaultDelimLen + 1) !== '\n')) {
          infer = false;
        }
      }
      const firstFoundDelimLen: number = infer ? str.indexOf('\n') : -1;
      if (firstFoundDelimLen > 0) {
        let firstFoundDelim: string = str.substr(0, firstFoundDelimLen);
        const firstFoundDelimLastCharIdx: number = firstFoundDelim.length - 1;
        firstFoundDelim = firstFoundDelim.charAt(firstFoundDelimLastCharIdx) === '\r' ? firstFoundDelim.substr(0, firstFoundDelimLastCharIdx) : firstFoundDelim;
        firstFoundDelim = firstFoundDelim.trim();
        foundLang = firstFoundDelim && this.__parsersLangByFirstDelim[firstFoundDelim];
        foundDelims = foundLang && this.__parsers[foundLang].delims
      }
    }
    // Delimiters
    const delims: string[] = arrayify((options && options.delims) || foundDelims || this.__defaultDelims);
    // If the first delim isn't the first thing, return
    const firstDelim: string = delims[0];
    if (!isFirst(str, firstDelim)) {
      return { data: {}, content: '' };
    }
    const firstDelimLen: number = firstDelim.length;
    const newlineLastDelim: string = '\n' + (delims[1] || delims[0]);
    // If the next character after the first delim
    // is a character in the first delim, then just
    // return the default object. It's either a bad
    // delim or not a delimiter at all.
    const charAfterFirstDelim: string = str.charAt(firstDelimLen/* + 1*/);
    if (charAfterFirstDelim && firstDelim.indexOf(charAfterFirstDelim) !== -1) {
      return { data: {}, content: '' };
    }
    // Find the index of the next delimiter before
    // going any further. If not found, treat the end
    // of the document as the end.
    const lastDelimIdx: number = str.indexOf(newlineLastDelim, firstDelimLen + 1);
    const end: number = lastDelimIdx === -1 ? len : lastDelimIdx;
    // Detect a language from after the first delimiters, if defined
    let detectedLang: string = str.slice(firstDelimLen, str.indexOf('\n'));
    // Measure the lang before trimming whitespace
    const start: number = firstDelimLen + detectedLang.length;
    detectedLang = detectedLang.trim();
    // Check languages match
    if (!opts.parser && detectedLang) {
      if (opts.lang && detectedLang !== opts.lang) {
        throw new Error(
          "preliminaries detected a different language: " +
            detectedLang +
            " to the one specified: " +
            opts.lang
        );
      }
      if (foundLang && detectedLang !== foundLang) {
        throw new Error(
          "preliminaries detected a different language: " +
            detectedLang +
            " to the one found based on delimiters: " +
            foundLang
        );
      }
    }
    const lang: string = (options && options.lang) || detectedLang || foundLang || this.__defaultLang;

    // Get the front matter 
    const frontmatter: string = str.slice(start, end).trim();
    let data: any = {};
    if (frontmatter) {
      // If data exists, see if we have a matching parser
      var parser = opts.parser || this.__parsers[lang];
      if (parser && typeof parser.parse === "function") {
        // Run the parser on the data string
        data = parser.parse(frontmatter, opts);
      } else {
        throw new Error("preliminaries cannot find a parser for: " + str);
      }
    }
    // Grab the content from the string, stripping
    // an optional new line after the second delim
    let content = str.substr(lastDelimIdx + newlineLastDelim.length);
    if (content.charAt(0) === '\n') {
      content = content.substr(1);
    } else if (content.charAt(0) === '\r' && content.charAt(1) === '\n') {
      content = content.substr(2);
    }
    // Results to build up
    return { data, content };
  }

  /**
   * Stringify an object to front matter, and concatenate it to the given string.
   */
  stringify(str: string, data: any, options: ?PreliminariesStringifyOptions): string {
    const lang: string = options && options.lang || this.__defaultLang;
    const parser: ?any = options && options.parser || this.__parsers[lang];
    if (!parser) {
      throw new Error(`preliminaries.stringify: cannot find a parser for lang '${lang}'`);
    }
    if (!typeof parser.stringify !== 'function') {
      throw new Error(`preliminaries.stringify: parser for lang '${lang}' does not have a 'stringify' method`);
    }
    const useParserDelims: boolean = !!(options && options.useParserDelims && parser.delims);
    const includeLang: boolean = (options && options.includeLang) || ((!options || typeof options.includeLang === 'undefined') && !useParserDelims && (!options || !options.delims));
    const delims: string[] = arrayify((options && options.delims) || (useParserDelims ? parser.delims : this.__defaultDelims))
    const parserOptions: PreliminariesParserOptions = {lang, delims};
    let res: string = delims[0] + (includeLang ? lang : '') + '\n';
    res += parser.stringify(data, parserOptions);
    res += (delims[1] || delims[0]) + '\n';
    res += str + '\n';
    return res;
  }

  /**
   * Return true if the given string `str` has front matter.
   */
  test(str: string, options: ?PreliminariesTestOptions): boolean {
    const delims: string[] = arrayify((options && options.delims) || this.__defaultDelims);
    return isFirst(str, delims[0]);
  }

  /**
   * Register a parser.
   */
  register(parser: any, options: ?PreliminariesRegisterOptions): Preliminaries {
    if (!parser) {
      throw new Error("preliminaries expects a parser");
    }
    if (!lang && !parser.lang) {
      throw new Error(
        "preliminaries expects a parser with a lang or a lang option"
      );
    }
    lang = lang || parser.lang;
    if (Array.isArray(lang)) {
      lang.forEach(function(l) {
        if (Array.isArray(l)) {
          throw new Error(
            "preliminaries does not currently handle nested language arrays"
          );
        }
        this.register(parser, l, delims);
      });
      return this;
    }
    if (typeof lang !== "string") {
      throw new Error("preliminaries expects a language string");
    }
    if (this.__parsers[lang]) {
      throw new Error(
        "preliminaries cannot register the parser because a parser is already registered for language: " +
          lang
      );
    }
    delims = arguments.length > 2 ? delims : parser.delims;
    if (delims) {
      var a = arrayify(delims)[0];
      var alang = this.__parsersLangByFirstDelim[a];
      if (alang && this.__parsers[alang] !== parser) {
        throw new Error(
          "preliminaries cannot register the parser because the delimiters clash with an already registered parser for language: " +
            preliminaries.parsersLangByFirstDelim[a]
        );
      }
      this.__parsersLangByFirstDelim[a] = lang;
    }
    this.__parsers[lang] = parser;
    return this;
  }

  /**
   * Unegister a parser.
   */
  unregister(parser: any, options: ?PreliminariesRegisterOptions): Preliminaries {
    if (typeof parser === "string") {
      delims = lang;
      lang = parser;
      parser = null;
    }
    if (!lang && (parser && !parser.lang)) {
      throw new Error(
        "preliminaries expects a parser with a lang or a lang option"
      );
    }
    lang = lang || (parser && parser.lang);
    if (Array.isArray(lang)) {
      lang.forEach(function(l) {
        if (Array.isArray(l)) {
          throw new Error(
            "preliminaries does not currently handle nested arrays"
          );
        }
        this.unregister(parser, l, delims);
      });
      return this;
    }
    if (typeof lang !== "string") {
      throw new Error("preliminaries expects a language string");
    }
    var existingParser = this.__parsers[lang];
    if (existingParser) {
      delete this.__parsers[lang];
      delims = arguments.length > 2
        ? delims
        : parser ? parser.delims : existingParser.delims;
      if (delims) {
        delete this.__parsersLangByFirstDelim[arrayify(delims)[0]];
      }
    }
    return this;
  }

  /**
   * Check if a parser is registerable for the language, or all of the languages if an array is given.
   */
  registerable(parser: any, options: ?PreliminariesRegisterOptions): boolean {
    if (!parser) {
      throw new Error("preliminaries expects a parser");
    }
    if (!lang && !parser.lang) {
      throw new Error(
        "preliminaries expects a parser with a lang or a lang option"
      );
    }
    lang = lang || parser.lang;
    if (Array.isArray(lang)) {
      var all = true;
      lang.forEach(function(l) {
        if (Array.isArray(l)) {
          throw new Error(
            "preliminaries does not currently handle nested arrays"
          );
        }
        all = preliminaries.registerable(parser, l, delims) && all;
      });
      return all;
    }
    if (typeof lang !== "string") {
      throw new Error("preliminaries expects a language string");
    }
    // Check if there is an existing parser
    if (preliminaries.parsers[lang]) {
      return false;
    }
    // Make sure the opening delimiters are unique (if present)
    // or if not, that this is exactly the same parser (so an alias for an existing language)
    delims = arguments.length > 2 ? delims : parser.delims;
    if (delims) {
      var a = arrayify(delims)[0];
      var alang = preliminaries.parsersLangByFirstDelim[a];
      if (alang && preliminaries.parsers[alang] !== parser) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a parser is registered for the language, or any of the languages if an array is given.
   *
   * @param  {String} `lang` The language to check if a parser is registered for.
   */
  registered(options: ?PreliminariesRegisterOptions): boolean {
    if (Array.isArray(lang)) {
      var any = false;
      lang.forEach(function(l) {
        if (Array.isArray(l)) {
          throw new Error(
            "preliminaries does not currently handle nested arrays"
          );
        }
        any = this.registered(l) || any;
      });
      return any;
    }
    if (typeof lang !== "string") {
      throw new Error("preliminaries expects a language string");
    }
    var parser = this.__parsers[lang];
    return !!parser;
  }
}

/**
 * Expose factory for `Preliminaries`
 *
 * @type {Preliminaries}
 */
export default function preliminaries(options: ?PreliminariesConstructorOptions): Preliminaries {
  return new Preliminaries(defaultLang, defaultDelims);
}
