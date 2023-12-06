import request from 'supertest';
import { app, closeServer } from '../src/index';
import { initializeDB, db } from '../src/db';

beforeAll(async () => {
  await initializeDB;
});

afterAll(async () => {
  await closeServer();
});

describe('GET /qa/questions', () => {
  afterAll(async () => {
    await db.end();
  });

  test('GET /qa/questions => ', async () => {
    const response = await request(app).get('/qa/questions');
    expect(response.status).toBe(200);
  });
});
