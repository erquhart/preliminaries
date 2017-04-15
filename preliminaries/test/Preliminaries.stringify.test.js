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

describe("Preliminaries.stringify:", () => {
  it("should stringify lang if useParserDelims is `false` but parser has no delims", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    class StringifyParser implements Parser {
      parse(data: string): any {
        return {};
      }
      stringify(data: any): string {
        return 'data\n';
      }
    }
    const parser: StringifyParser = new StringifyParser();
    const actual = preliminaries.stringify(
      "Content",
      { title: "Parser" },
      { lang: "mine", parser: parser, useParserDelims: true }
    );
    expect(actual).toBe(["---mine", "data", "---", "Content\n"].join("\n"));
  });
});
