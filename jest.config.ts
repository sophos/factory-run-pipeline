import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'node'
};

export default config;
