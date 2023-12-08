/** @type {import('ts-jest').JestConfigWithTsJest} */
const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};