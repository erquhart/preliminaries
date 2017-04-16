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

describe("Preliminaries.defaultDelims:", () => {
  it("should return `---`", () => {
    const preliminaries: Preliminaries = new Preliminaries();
    expect(preliminaries.defaultDelims).toBe('---');
  });
});
