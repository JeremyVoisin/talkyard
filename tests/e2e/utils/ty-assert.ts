import assert = require('assert');


const tyAssert = {
  ...assert,

  // Maybe might as well always use this one, instead of  strictEqual  sometimes?
  // Could do that change later — but start with deepEq as a separate fn.
  deepEq: assert.deepStrictEqual,

  not: (what, message?) => {
    assert.ok(!what, message);
  },

  eq: (actual, expected, message?) => {
    // Show the two values on two lines, aligned, so one sees at a glance
    // what's wrong.
    let wholeMessage = '\n\n' +
          `  assert.eq: Actual value differs from expected value:\n` +
          `        actual:  ${actual}\n` +
          `      expected:  ${expected}\n`;
    if (message) {
      wholeMessage +=
          `  Details:\n` +
          `    ${message}\n`;
    }
    assert.strictEqual(actual, expected, wholeMessage);
  },

  refEq: (actual, expected) => {
    assert.ok(actual === expected,
      `  assert.refEq: Not reference-equal:\n` +
      `      actual:  ${JSON.stringify(actual)}\n` +
      `    expected:  ${JSON.stringify(expected)}\n`);
  },

  greaterThan: (actual, min) => {
    assert.ok(actual > min,
      `Value too small: ${JSON.stringify(actual)}, ` +
          `should be at least: ${JSON.stringify(min)}`);
  },

  includes: (text: string, expectedSubstring: string, message?: string) => {
    // Could make this work w regexs too.
    const ix = text.indexOf(expectedSubstring);
    assert.ok(ix >= 0, '\n\n' + (message ||
      `  assert.includes:\n` +
      `     This:  "${expectedSubstring}"\n` +
      `     is missing from:  (between the ----)\n` +
      `------------------------------------------------------------------------\n` +
      `${text}\n` +
      `------------------------------------------------------------------------\n` +
      `\n`));
  },

  excludes: (text: string, unexpectedSubstring: string, message?: string) => {
    const ix = text.indexOf(unexpectedSubstring);
    assert.ok(ix === -1,
      message || `This: "${unexpectedSubstring}" is incorrectly included in: "${text}"`);
  }
};


export = tyAssert;
