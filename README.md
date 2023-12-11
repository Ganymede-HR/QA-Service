# SDC Team Genymede QA Service

Questions & Answers API Service

## Overview

This project is setup with Typescript with the tsconfig.json file generated with `npx tsc --init`. 

## Getting started

Create a .env file modeled after example.env

Install and start development environment:

```bash
npm i
npm dev
```

Transpile Typescript and run production server: 

```bash
npm run build
npm run start
```

## Testing

Prior to testing create a .env.test file. This should mirror the .env file but the DATABASE_NAME should be appended with _TEST. 

Add environment variable to .env.test
```
RESET_TEST_DATABASE=true
```
to assure test database is reset as expected.

Run tests with

```bash
npm run test
```

Tests will run on the provided test database. Each time running the test will tear down the prior test database and reconstruct it.

## Performance Testing

Local performance tests written with k6.
To run performance tests start the production server and run performance test script

```
npm run test:perf
```