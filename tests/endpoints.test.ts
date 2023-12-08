import request from 'supertest';
import { app, closeServer } from '../src/index';
import seedTestDB from './prepareTests';

const { DATABASE_NAME } = process.env;

const testDb = seedTestDB();

beforeAll(async () => {
  await testDb;
});

afterAll(async () => {
  if (!DATABASE_NAME || !DATABASE_NAME?.includes('_TEST')) {
    console.error('skipping test db cleanup steps');
  }
  await closeServer();
});

describe('check endpoints exist', () => {
  test('GET /qa/questions => ', async () => {
    const response = await request(app).get('/qa/questions');
    expect(response.status).toBe(200);
    // TODO: Check return object structure
  });

  test('GET /qa/questions/:question_id/answers => ', async () => {
    const response = await request(app).get('/qa/questions/1/answers');
    expect(response.status).toBe(200);
    // TODO: Check return object structure
  });

  test('POST /qa/questions => ', async () => {
    const response = await request(app).post('/qa/questions/');
    expect(response.status).toBe(201);
    // TODO: Check db for insert
  });

  test('POST /qa/questions/:question_id/answers => ', async () => {
    const response = await request(app).post('/qa/questions/1/answers');
    expect(response.status).toBe(201);
    // TODO: Check return object structure
  });

  test('PUT /qa/questions/:question_id/helpful => ', async () => {
    const response = await request(app).put('/qa/questions/1/helpful');
    expect(response.status).toBe(204);
    // TODO: Check helpful count update
  });

  test('PUT /qa/questions/:question_id/report => ', async () => {
    const response = await request(app).put('/qa/questions/1/report');
    expect(response.status).toBe(204);
    // TODO: Check question reported status
  });

  test('PUT /qa/answers/:answer_id/helpful => ', async () => {
    const response = await request(app).put('/qa/answers/1/helpful');
    expect(response.status).toBe(204);
    // TODO: Check helpful count update
  });

  test('PUT /qa/answers/:answer_id/report => ', async () => {
    const response = await request(app).put('/qa/answers/1/report');
    expect(response.status).toBe(204);
    // TODO: Check answer reported status
  });
});
