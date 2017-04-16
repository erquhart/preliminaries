/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// @flow
"use strict";

import Preliminaries from "../src/Preliminaries";
import type { Parser } from "../src/Preliminaries";

class StringifyParser implements Parser {
  stringifyResult: string;
  constructor(stringifyResult?: string) {
    this.stringifyResult = stringifyResult || "";
  }
  parse(data: string): any {
    return {};
  }
  stringify(data: any): string {
    return this.stringifyResult + "\n";
  }
}

describe("Preliminaries.stringify:", () => {
  it("should stringify lang if useParserDelims is `false` but parser has no delims", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    const stringified: string = "stringified";
    const parser: Parser = new StringifyParser(stringified);
    const lang: string = "test";
    const actual = preliminaries.stringify(
      "Content",
      { title: "Parser" },
      { lang, parser, useParserDelims: true }
    );
    expect(actual).toBe(
      [`---${lang}`, stringified, "---", "Content\n"].join("\n")
    );
  });

  it("should throw an error if no parser is registered for the lang", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    expect(() =>
      preliminaries.stringify(
        "Content",
        { title: "Parser" },
        { lang: "test", useParserDelims: true }
      )
    ).toThrow("");
  });
});
