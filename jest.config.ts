import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

export default config;
