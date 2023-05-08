import path from 'path';

process.env.JEST_DYNAMODB_CONFIG = path.resolve(
  __dirname,
  './jest-dynamodb-config',
);

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  preset: '@shelf/jest-dynamodb',
};
