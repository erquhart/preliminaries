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
 * Utility to strip byte order marks.
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

/**
 * Infer the language from the first delimiter 
 * if a parser is registered for that delimiter.
 */
function inferLang(
  str: string,
  delims: string | string[],
  langSelector: string => ?string
): ?string {
  const len: number = str.length;
  // Don't infer if the document has a language in the front matter like `---yaml`
  const delimsArr: string[] = arrayify(delims);
  const firstDelimLen: number = delimsArr[0].length;
  if (
    len >= firstDelimLen + 1 && str.substr(0, firstDelimLen) === delimsArr[0]
  ) {
    const charAfterFirstDelim: string = str.charAt(firstDelimLen);
    if (
      charAfterFirstDelim !== "\n" &&
      (charAfterFirstDelim !== "\r" && str.charAt(firstDelimLen + 1) !== "\n")
    ) {
      return null;
    }
  }
  const firstFoundDelimLen: number = str.indexOf("\n");
  if (firstFoundDelimLen < 1) {
    return null;
  }
  let firstFoundDelim: string = str.substr(0, firstFoundDelimLen);
  const firstFoundDelimLastCharIdx: number = firstFoundDelim.length - 1;
  firstFoundDelim = firstFoundDelim.charAt(firstFoundDelimLastCharIdx) === "\r"
    ? firstFoundDelim.substr(0, firstFoundDelimLastCharIdx)
    : firstFoundDelim;
  firstFoundDelim = firstFoundDelim.trim();
  return !!firstFoundDelim ? langSelector(firstFoundDelim) : null;
}

type PreliminariesConstructorOptions = {
  lang: ?string,
  delims: ?(string | string[])
};

type PreliminariesParseOptions = {
  lang: ?string,
  delims: ?(string | string[]),
  parser: ?any
};

type PreliminariesParseResult = {
  data: any,
  content: string
};

type PreliminariesStringifyOptions = {
  lang: ?string,
  delims: ?(string | string[]),
  parser: ?any,
  includeLang: ?boolean,
  useParserDelims: ?boolean
};

type PreliminariesTestOptions = {
  delims: ?(string | string[])
};

type PreliminariesRegisterOptions = {
  lang: ?(string | string[]),
  delims: ?(string | string[])
};

interface PreliminariesParser {
  defaultLang: ?(string | string[]),
  defaultDelims: ?(string | string[]),
  parse(data: string): any,
  stringify(data: any): string
}

export default class Preliminaries {
  __defaultLang: string;
  __defaultDelims: string | string[];
  __parsers: { [string]: PreliminariesParser };
  __parsersByFirstDelim: { [string]: string };

  constructor(options: ?PreliminariesConstructorOptions) {
    this.__defaultLang = (options && options.lang) || "json";
    this.__defaultDelims = (options && options.delims) || "---";
    this.__parsers = {};
    this.__parsersByFirstDelim = {};
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
  parse(
    str: string,
    options: ?PreliminariesParseOptions
  ): PreliminariesParseResult {
    if (typeof str !== "string") {
      throw new Error(
        "preliminaries.parse: expected a string to parse as the first argument"
      );
    }
    if (str === "") {
      return { data: {}, content: "" };
    }
    // Strip byte order marks
    str = stripBom(str);
    const len: number = str.length;
    // If no delimiters are set and if no parser and no language is defined,
    // try to infer the language by matching the first delimiter with parsers
    const infer: boolean =
      !options || (!options.delims && !options.lang && !options.parser);
    const inferredLang: ?string = infer
      ? inferLang(str, this.__defaultDelims, d => this.__parsersByFirstDelim[d])
      : null;
    const inferredDelims: ?(string | string[]) = inferredLang
      ? this.__parsers[inferredLang].defaultDelims
      : null;
    // Delimiters
    const delims: string[] = arrayify(
      (options && options.delims) || inferredDelims || this.__defaultDelims
    );
    // If the first delim isn't the first thing, return
    const firstDelim: string = delims[0];
    if (!isFirst(str, firstDelim)) {
      return { data: {}, content: "" };
    }
    const firstDelimLen: number = firstDelim.length;
    const newlineLastDelim: string = "\n" + (delims[1] || delims[0]);
    // If the next character after the first delim
    // is a character in the first delim, then just
    // return the default object. It's either a bad
    // delim or not a delimiter at all.
    const charAfterFirstDelim: string = str.charAt(firstDelimLen);
    if (charAfterFirstDelim && firstDelim.indexOf(charAfterFirstDelim) !== -1) {
      return { data: {}, content: "" };
    }
    // Find the index of the next delimiter before
    // going any further. If not found, treat the end
    // of the document as the end.
    const lastDelimIdx: number = str.indexOf(
      newlineLastDelim,
      firstDelimLen + 1
    );
    const end: number = lastDelimIdx === -1 ? len : lastDelimIdx;
    // Detect a language from after the first delimiters, if defined
    let detectedLang: string = str.slice(firstDelimLen, str.indexOf("\n"));
    // Measure the lang before trimming whitespace
    const start: number = firstDelimLen + detectedLang.length;
    detectedLang = detectedLang.trim();
    // Check languages match if language is important
    // i.e. a custom parser is not defined.
    const detectedLanguageAndNoCustomParser: boolean =
      !!detectedLang && (!options || !options.parser);
    if (
      detectedLanguageAndNoCustomParser &&
      options &&
      options.lang &&
      detectedLang !== options.lang
    ) {
      throw new Error(
        `preliminaries.parse: detected a different lang '${detectedLang}' to the lang option '${options.lang}'`
      );
    }
    // The final language
    const lang: string =
      (options && options.lang) ||
      detectedLang ||
      inferredLang ||
      this.__defaultLang;
    // Get the front matter
    const frontmatter: string = str.slice(start, end).trim();
    let data: any = {};
    if (frontmatter) {
      // If data exists, see if we have a matching parser
      const parser: ?PreliminariesParser =
        (options && options.parser) || this.__parsers[lang];
      if (!parser) {
        throw new Error(
          `preliminaries.parse: cannot find a parser for lang '${lang}'`
        );
      }
      if (!typeof parser.parse !== "function") {
        throw new Error(
          `preliminaries.parse: parser for lang '${lang}' does not have a parse method`
        );
      }
      // Protect against a bad parser returning null
      data = parser.parse(frontmatter) || {};
    }
    // Grab the content from the string, stripping
    // an optional new line after the second delim.
    let content: string = str.substr(lastDelimIdx + newlineLastDelim.length);
    if (content.charAt(0) === "\n") {
      content = content.substr(1);
    } else if (content.charAt(0) === "\r" && content.charAt(1) === "\n") {
      content = content.substr(2);
    }
    return { data, content };
  }

  /**
   * Stringify an object to front matter, and concatenate it to the given string.
   */
  stringify(
    str: string,
    data: any,
    options: ?PreliminariesStringifyOptions
  ): string {
    const lang: string = (options && options.lang) || this.__defaultLang;
    const parser: ?PreliminariesParser =
      (options && options.parser) || this.__parsers[lang];
    if (!parser) {
      throw new Error(
        `preliminaries.stringify: cannot find a parser for lang '${lang}'`
      );
    }
    if (!typeof parser.stringify !== "function") {
      throw new Error(
        `preliminaries.stringify: parser for lang '${lang}' does not have a stringify method`
      );
    }
    const useParserDelims: boolean = !!(options &&
      options.useParserDelims &&
      parser.defaultDelims);
    const includeLang: boolean =
      (options && options.includeLang) ||
      ((!options || typeof options.includeLang === "undefined") &&
        !useParserDelims &&
        (!options || !options.delims));
    const delims: string[] = arrayify(
      (options && options.delims) ||
        (useParserDelims ? parser.defaultDelims : this.__defaultDelims)
    );
    let result: string = delims[0] + (includeLang ? lang : "") + "\n";
    result += parser.stringify(data, { lang, delims });
    result += (delims[1] || delims[0]) + "\n";
    result += str + "\n";
    return result;
  }

  /**
   * Return true if the given string `str` has front matter.
   */
  test(str: string, options: ?PreliminariesTestOptions): boolean {
    const delims: string[] = arrayify(
      (options && options.delims) || this.__defaultDelims
    );
    return isFirst(str, delims[0]);
  }

  /**
   * Register a parser.
   */
  register(
    parser: PreliminariesParser,
    options: ?PreliminariesRegisterOptions
  ): Preliminaries {
    if (!parser) {
      throw new Error(
        "preliminaries.register: expected a parser as the first argument"
      );
    }
    if (!(options && options.lang) && !parser.defaultLang) {
      throw new Error(
        `preliminaries.register: expected a parser with a defaultLang property or a lang option`
      );
    }
    const langs: string[] = arrayify(
      (options && options.lang) || parser.defaultLang
    );
    langs.forEach(lang => {
      if (typeof lang !== "string") {
        throw new Error(
          `preliminaries.register: expected lang to be a string but got '${lang}'`
        );
      }
      if (this.__parsers[lang]) {
        throw new Error(
          `preliminaries.register: cannot register the parser because a parser is already registered for lang '${lang}'`
        );
      }
    });
    if ((options && options.delims) || parser.defaultDelims) {
      const delims: string[] = arrayify(
        (options && options.delims) || parser.defaultDelims
      );
      const firstDelim: string = delims[0];
      const registeredParserLang: ?string = this.__parsersByFirstDelim[
        firstDelim
      ];
      const registeredParser: ?PreliminariesParser = registeredParserLang
        ? this.__parsers[registeredParserLang]
        : null;
      if (
        registeredParserLang && registeredParser && registeredParser !== parser
      ) {
        throw new Error(
          `preliminaries.register: cannot register the parser because the opening delims '${delims[0]}' clash with an already registered parser for lang '${registeredParserLang}'`
        );
      }
      this.__parsersByFirstDelim[firstDelim] = langs[0];
    }
    langs.forEach(lang => {
      this.__parsers[lang] = parser;
    });
    return this;
  }

  /**
   * Unegister a parser.
   */
  unregister(
    parserOrOptions: PreliminariesParser | PreliminariesRegisterOptions,
    options: ?PreliminariesRegisterOptions
  ): Preliminaries {
    if (!parserOrOptions) {
      throw new Error(
        "preliminaries.unregister: expected a parser or options as the first argument"
      );
    }
    const anyParserOrOptions: any = (parserOrOptions: any);
    const hasParser: boolean =
      arguments.length > 1 ||
      (typeof anyParserOrOptions.parse === "function" ||
        typeof anyParserOrOptions.stringify === "function");
    const possibleOptions: ?PreliminariesRegisterOptions = (hasParser
      ? options
      : parserOrOptions: any);
    const parser: ?PreliminariesParser = (hasParser
      ? parserOrOptions
      : null: any);
    // Must be a parser with a defaultLang or
    // defaultDelims or some options with a lang or delims.
    if (
      !(parser && (parser.defaultLang || parser.defaultDelims)) ||
      !(possibleOptions && (possibleOptions.lang || possibleOptions.delims))
    ) {
      throw new Error(
        "preliminaries.unregister: nothing to unregister, expected a parser with a defaultLang or defaultDelims property and/or lang or delims options"
      );
    }
    // Delete parser by language, if any
    if ((possibleOptions && possibleOptions.lang) || parser.defaultLang) {
      const langs: string[] = arrayify(
        (possibleOptions && possibleOptions.lang) || parser.defaultLang
      );
      langs.forEach(lang => {
        if (typeof lang !== "string") {
          throw new Error(
            `preliminaries.unregister: expected lang to be a string but got '${lang}'`
          );
        }
        delete this.__parsers[lang];
      });
    }
    // Delete registrations by delimiter, if any
    if ((possibleOptions && possibleOptions.delims) || parser.defaultDelims) {
      const delims: string[] = arrayify(
        (possibleOptions && possibleOptions.delims) || parser.defaultDelims
      );
      delete this.__parsersByFirstDelim[delims[0]];
    }
    return this;
  }

  /**
   * Check if a parser is registerable for the language, or all of the languages if an array is given.
   */
  registerable(
    parser: PreliminariesParser,
    options: ?PreliminariesRegisterOptions
  ): boolean {
    if (!parser) {
      throw new Error(
        "preliminaries.registerable: expected a parser as the first argument"
      );
    }
    if (!(options && options.lang) && !parser.defaultLang) {
      throw new Error(
        `preliminaries.registerable: expected a parser with a defaultLang property or a lang option`
      );
    }
    const langs: string[] = arrayify(
      (options && options.lang) || parser.defaultLang
    );
    const everyLangNotRegistered: boolean = langs.every(lang => {
      if (typeof lang !== "string") {
        throw new Error(
          `preliminaries.registerable: expected lang to be a string but got '${lang}'`
        );
      }
      return !this.__parsers[lang];
    });
    const anyLangRegistered: boolean = !everyLangNotRegistered;
    if (anyLangRegistered) {
      return false;
    }
    // Make sure the opening delimiters are unique (if present)
    // or if not, that this is exactly the same parser (so an alias for an existing language).
    if ((options && options.delims) || parser.defaultDelims) {
      const delims: string[] = arrayify(
        (options && options.delims) || parser.defaultDelims
      );
      const firstDelim: string = delims[0];
      const registeredParserLang: ?string = this.__parsersByFirstDelim[
        firstDelim
      ];
      const registeredParser: ?PreliminariesParser = registeredParserLang
        ? this.__parsers[registeredParserLang]
        : null;
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
  registered(options: ?PreliminariesRegisterOptions): boolean {
    // Check if a parser is registered for any language, if any
    if (options && options.lang) {
      const langs: string[] = arrayify(options && options.lang);
      const everyLangNotRegistered: boolean = langs.every(lang => {
        if (typeof lang !== "string") {
          throw new Error(
            `preliminaries.registered: expected lang to be a string but got '${lang}'`
          );
        }
        return !this.__parsers[lang];
      });
      const anyLangRegistered: boolean = !everyLangNotRegistered;
      if (anyLangRegistered) {
        return true;
      }
    }
    // Check if a parser is registered for the delims, if any
    if (options && options.delims) {
      const delims: string[] = arrayify(options.delims);
      const firstDelim: string = delims[0];
      const registeredParserLang: ?string = this.__parsersByFirstDelim[
        firstDelim
      ];
      const registeredParser: ?PreliminariesParser = registeredParserLang
        ? this.__parsers[registeredParserLang]
        : null;
      if (registeredParser) {
        return true;
      }
    }
    return false;
  }
}
