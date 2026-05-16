import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/env.setup.ts'],
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30_000,
};

export default config;
