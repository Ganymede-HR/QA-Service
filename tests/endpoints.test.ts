import type { RowDataPacket } from 'mysql2';
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
    const product1Body = questionsData.find((products) => products.product_id === '1');
    expect(response.body).toEqual(product1Body);
  });

  test('GET /qa/questions/:question_id/answers => ', async () => {
    const response = await request(app).get('/qa/questions/4/answers?count=20');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(answersData);
  });

  test('POST /qa/questions => ', async () => {
    const testQ = {
      product_id: 1,
      body: 'test question body product 1',
      name: 'tester questioner',
      email: 'tester@email.com',
    };
    const response = await request(app)
      .post('/qa/questions/')
      .send(testQ);
    expect(response.status).toBe(201);
    const qs = await (await testDb).query<RowDataPacket[]>(
      'SELECT product_id, body, asker_name AS name, asker_email AS email FROM questions WHERE product_id = 1',
    );
    const testQuestion = qs[0].find((q: any) => q.body === testQ.body);
    expect(testQuestion).toEqual(testQ);
  });

  test('POST /qa/questions/:question_id/answers => ', async () => {
    const testA = {
      body: 'test answer to question 3 body',
      name: 'tester answerer',
      email: 'tester@email.com',
      photos: ['testphoto1.jpg', 'testphoto2.jpg'],
    };
    const response = await request(app)
      .post('/qa/questions/3/answers')
      .send(testA);
    expect(response.status).toBe(201);
    const ans = await (await testDb).query<RowDataPacket[]>(
      `SELECT a.id, a.body, a.answerer_name AS name, a.answerer_email AS email, p.url 
       FROM answers a
       LEFT JOIN answer_photos p ON a.id = p.answer_id
       WHERE question_id = 3 AND a.answerer_email = 'tester@email.com'
      `,
    );
    const reduced = ans[0].reduce((acc: any, v) => {
      if (acc[v.id]) {
        if (v.url) acc[v.id].photos.push(v.url);
      } else {
        acc[v.id] = {
          body: v.body,
          name: v.name,
          email: v.email,
          photos: v.url ? [v.url] : [],
        };
      }
      return acc;
    }, {});
    const v = Object.values(reduced)[0];
    expect(v).toEqual(testA);
  });

  test('PUT /qa/questions/:question_id/helpful => ', async () => {
    const tDb = await testDb;
    const initCount = (await tDb.query<RowDataPacket[]>('SELECT helpful FROM questions WHERE id = 3'))[0][0].helpful;
    const response = await request(app).put('/qa/questions/3/helpful');
    expect(response.status).toBe(204);
    const afterCount = (await tDb.query<RowDataPacket[]>('SELECT helpful FROM questions WHERE id = 3'))[0][0].helpful;
    expect(afterCount).toBe(initCount + 1);
  });

  test('PUT /qa/questions/:question_id/report => ', async () => {
    const response = await request(app).put('/qa/questions/3/report');
    expect(response.status).toBe(204);
    const { reported, product_id: productId } = (await (await testDb).query<RowDataPacket[]>('SELECT reported, product_id FROM questions WHERE id = 3'))[0][0];
    expect(!!reported).toBe(true);
    // check reported question is not returned by API
    const response2 = await request(app).get(`/qa/questions?productId=${productId}&count=20`);
    const q3 = response2.body.results?.find((r: any) => r.question_id === 3);
    expect(q3).toBeFalsy();
  });

  test('PUT /qa/answers/:answer_id/helpful => ', async () => {
    const tDb = await testDb;
    const initCount = (await tDb.query<RowDataPacket[]>('SELECT helpful FROM answers WHERE id = 2'))[0][0].helpful;
    const response = await request(app).put('/qa/answers/2/helpful');
    expect(response.status).toBe(204);
    const afterCount = (await tDb.query<RowDataPacket[]>('SELECT helpful FROM answers WHERE id = 2'))[0][0].helpful;
    expect(afterCount).toBe(initCount + 1);
  });

  test('PUT /qa/answers/:answer_id/report => ', async () => {
    const response = await request(app).put('/qa/answers/3/report');
    expect(response.status).toBe(204);
    const { reported, question_id: questionId } = (await (await testDb).query<RowDataPacket[]>('SELECT reported, question_id FROM answers WHERE id = 3'))[0][0];
    expect(!!reported).toBe(true);
    // check reported answer is not returned by API
    const response2 = await request(app).get(`/qa/questions/${questionId}/answers?count=20`);
    const a3 = response2.body.results?.find((r: any) => r.answer_id === 3);
    expect(a3).toBeFalsy();
  });
});
