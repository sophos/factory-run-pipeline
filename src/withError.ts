import * as core from '@actions/core';
import { AxiosError } from 'axios';
import * as os from 'os';

export const withError =
  <I extends Array<unknown>, O>(fn: (...args: I) => O) =>
  async (...args: I): Promise<O | undefined> => {
    try {
      return await fn(...args);
    } catch (err) {
      const isAxiosError: boolean = err.isAxiosError ?? false;
      if (isAxiosError) {
        const errors = (err as AxiosError).response?.data?.errors;
        if (errors) {
          core.setFailed(
            ((errors ?? []) as Array<{ code: string; message: string }>)
              .map(({ code, message }) => `${code}: ${message}`)
              .join(os.EOL)
          );

          // Exit code is set by `core.setFailed`.
          return process.exit();
        }
      }

      core.setFailed(err);
      return process.exit();
    }
  };
