import request from 'supertest';
import { app, closeServer } from '../src/index';
import { db } from '../src/db';
import seedTestDB from './prepareTests';
import questionsData from './example-questions.json';
import answersData from './example-answers.json';

const { DATABASE_NAME } = process.env;

const testDb = seedTestDB();

beforeAll(async () => {
  await testDb;
});

afterAll(async () => {
  if (!DATABASE_NAME || !DATABASE_NAME?.includes('_TEST')) {
    console.error('skipping test db cleanup steps');
  }
  await db.end();
  await closeServer();
});

describe('check endpoints exist', () => {
  test('GET /qa/questions => ', async () => {
    const response = await request(app).get('/qa/questions?product_id=1&count=20');
    expect(response.status).toBe(200);
    // TODO: Check return object structure
    const product1Body = questionsData.find((products) => products.product_id === '1');
    expect(response.body).toEqual(product1Body);
  });

  test('GET /qa/questions/:question_id/answers => ', async () => {
    const response = await request(app).get('/qa/questions/4/answers?count=20');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(answersData);
    // TODO: Check return object structure
  });

  test('POST /qa/questions => ', async () => {
    const response = await request(app)
      .post('/qa/questions/')
      .send({
        product_id: 1,
        body: 'test question body product 1',
        name: 'tester questioner',
        email: 'tester@email.com',
      });
    expect(response.status).toBe(201);
    // TODO: Check db for insert
  });

  test('POST /qa/questions/:question_id/answers => ', async () => {
    const response = await request(app)
      .post('/qa/questions/3/answers')
      .send({
        body: 'test answer to question 3 body',
        name: 'tester answerer',
        email: 'tester@email.com',
        photos: ['testphoto1.jpg', 'testphoto2.jpg'],
      });
    expect(response.status).toBe(201);
    // TODO: Check db
  });

  test('PUT /qa/questions/:question_id/helpful => ', async () => {
    const response = await request(app).put('/qa/questions/3/helpful');
    expect(response.status).toBe(204);
    // TODO: Check helpful count update
  });

  test('PUT /qa/questions/:question_id/report => ', async () => {
    const response = await request(app).put('/qa/questions/3/report');
    expect(response.status).toBe(204);
    // TODO: Check question reported status, check next questions query doesn't include
    // reported question
  });

  test('PUT /qa/answers/:answer_id/helpful => ', async () => {
    const response = await request(app).put('/qa/answers/2/helpful');
    expect(response.status).toBe(204);
    // TODO: Check helpful count update
  });

  test('PUT /qa/answers/:answer_id/report => ', async () => {
    const response = await request(app).put('/qa/answers/3/report');
    expect(response.status).toBe(204);
    // TODO: Check answer reported status
  });
});
