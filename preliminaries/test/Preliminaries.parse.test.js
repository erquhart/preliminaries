/*!
 * preliminaries <https://github.com/josephearl/preliminaries.git>
 *
 * Copyright (C) 2017 Joseph Earl.
 * Copyright (C) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

"use strict";

import Preliminaries from "../src/Preliminaries";
import type { Parser, PreliminariesParseResult } from "../src/Preliminaries";

class ParseParser implements Parser {
  parseResult: any;
  constructor(parseResult?: any) {
    this.parseResult = parseResult || {};
  }
  parse(data: string): any {
    return this.parseResult;
  }
  stringify(data: any): string {
    return "";
  }
}

class ErrorParser implements Parser {
  errorMessage: any;
  constructor(errorMessage?: string) {
    this.errorMessage = errorMessage || "";
  }
  parse(data: string): any {
    throw new Error(this.errorMessage);
  }
  stringify(data: any): string {
    return "";
  }
}

describe("Preliminaries.parse:", () => {
  it("should throw an error when a string is not passed", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    expect(() => preliminaries.parse()).toThrow(
      "preliminaries.parse: expected a string to parse as the first argument"
    );
  });

  it("should return an object when the string is 0 length", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    expect(preliminaries.parse("")).toEqual({ data: {}, content: "" });
  });

  it("should throw an error when parsing a string that is only the open delimiter", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    const fixture: string = "{";
    expect(() =>
      preliminaries.parse(fixture, {
        delims: "{"
      })
    ).toThrow("preliminaries.parse: last delim '{' not found");
  });

  it("should throw an error when parsing a string that is just the open delimiter and language", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    const fixture: string = "{json";
    expect(() =>
      preliminaries.parse(fixture, {
        delims: "{"
      })
    ).toThrow("preliminaries.parse: last delim '{' not found");
  });

  it("should allow a custom parser to be used", function() {
    const preliminaries: Preliminaries = new Preliminaries();
    const fixture = "---\nblah\n---\nContent";
    const data: any = { title: "test" };
    const parser: Parser = new ParseParser(data);
    const actual: PreliminariesParseResult = preliminaries.parse(fixture, {
      parser
    });
    expect(actual).toEqual({ data, content: "Content" });
  });

  const lineEndings = ["\n", "\r\n"];
  lineEndings.forEach(lineEnding => {
    describe(`read from strings with lineEnding ${lineEnding
      .replace("\n", "\\n")
      .replace("\r", "\\r")}:`, () => {
      it("should throw an error when the detected lang does not match the specified lang", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---json${lineEnding}{${lineEnding}  "title": "autodetect JSON"}${lineEnding}---${lineEnding}# Title${lineEnding}Body`;
        expect(() => preliminaries.parse(fixture, { lang: "test" })).toThrow(
          "preliminaries.parse: detected a different lang 'json' to the lang option 'test'"
        );
      });

      it("should auto-detect a registered parser based on language in header", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---google${lineEnding}"abc":"xyz"${lineEnding}---${lineEnding}Test content`;
        const data: any = { field: "value" };
        const parser: Parser = new ParseParser(data);
        preliminaries.register(parser, { lang: "google" });
        const actual: PreliminariesParseResult = preliminaries.parse(fixture);
        expect(actual).toEqual({ data, content: "Test content" });
      });

      it("should auto-detect a registered parser based on the first delimiter", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `~~~${lineEnding}"abc":"xyz"${lineEnding}~~~${lineEnding}Test content`;
        const data: any = { field: "value" };
        const parser: Parser = new ParseParser(data);
        preliminaries.register(parser, { lang: "test", delims: "~~~" });
        const actual: PreliminariesParseResult = preliminaries.parse(fixture);
        expect(actual).toEqual({ data, content: "Test content" });
      });

      it("should throw an error when no parser is registered for the language", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---test${lineEnding}{${lineEnding}"abc":"xyz"${lineEnding}}${lineEnding}---`;
        expect(() => preliminaries.parse(fixture, { delims: "---" })).toThrow(
          "preliminaries.parse: cannot find parser for lang 'test'"
        );
      });

      it("should throw an error when front matter cannot be parsed", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---${lineEnding}{${lineEnding}"abc":"xyz"${lineEnding}}${lineEnding}---`;
        const error: string = "Boop!";
        const parser: Parser = new ErrorParser(error);
        expect(() =>
          preliminaries.parse(fixture, { parser, delims: "---" })
        ).toThrow(error);
      });

      it("should correctly identify delimiters and ignore strings that look like delimiters", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---${lineEnding}{${lineEnding}"name":"troublesome --- value"${lineEnding}}${lineEnding}---${lineEnding}here is some content${lineEnding}`;
        const data: any = { field: "value" };
        const parser: Parser = new ParseParser(data);
        const actual: PreliminariesParseResult = preliminaries.parse(fixture, {
          delims: "---",
          parser
        });
        expect(actual).toEqual({
          data,
          content: `here is some content${lineEnding}`
        });
      });

      it("should throw an error when parsing a string that only has an opening delimiter", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---${lineEnding}{${lineEnding}"title":"Test"${lineEnding}}${lineEnding}`;
        const parser: Parser = new ParseParser({ field: "value" });
        expect(() =>
          preliminaries.parse(fixture, {
            delims: "---"
          })
        ).toThrow("preliminaries.parse: last delim '---' not found");
      });

      it("should throw an error when parsing a string that is just the open delimiter", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `---${lineEnding}`;
        const parser: Parser = new ParseParser({ field: "value" });
        expect(() =>
          preliminaries.parse(fixture, {
            delims: "---",
            parser
          })
        ).toThrow("preliminaries.parse: last delim '---' not found");
      });

      it("should throw an when parsing a string that is just the open delimiter and language", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `{json${lineEnding}`;
        const parser: Parser = new ParseParser({ field: "value" });
        expect(() =>
          preliminaries.parse(fixture, {
            delims: ["{", "}"],
            parser
          })
        ).toThrow("preliminaries.parse: last delim '}' not found");
      });

      it("should throw when parsing a string without a close delimiter", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `{${lineEnding}"title":"JSON",${lineEnding}"description":"A nice story"`;
        const parser: Parser = new ParseParser({ field: "value" });
        expect(() =>
          preliminaries.parse(fixture, {
            delims: ["{", "}"],
            parser
          })
        ).toThrow("preliminaries.parse: last delim '}' not found");
      });

      it("should parse a string without a close delimiter when allowMissingLastDelim is `true`", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `{${lineEnding}"title":"JSON",${lineEnding}"description":"A nice story"`;
        const data: any = { field: "value" };
        const parser: Parser = new ParseParser(data);
        expect(
          preliminaries.parse(fixture, {
            delims: ["{", "}"],
            parser,
            allowMissingLastDelim: true
          })
        ).toEqual({ data, content: "" });
      });

      it("should throw when parsing content that looks like front matter", () => {
        const preliminaries: Preliminaries = new Preliminaries();
        const fixture: string = `-----------name--------------value${lineEnding}foo`;
        const parser: Parser = new ParseParser({ field: "value" });
        expect(() =>
          preliminaries.parse(fixture, {
            delims: "---",
            parser
          })
        ).toThrow(
          "preliminaries.parse: character '-' after first delim '---' is contained in the first delim"
        );
      });
    });
  });
});
