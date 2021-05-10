import * as core from '@actions/core';

export const withError =
  <I extends Array<unknown>, O>(fn: (...args: I) => O) =>
  (...args: I): O | undefined => {
    try {
      return fn(...args);
    } catch (err) {
      core.setFailed(err);
    }
  };
