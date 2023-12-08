/* eslint-disable no-await-in-loop */
import mysql from 'mysql2/promise';
import { dbInitPromise } from '../src/db';
import data from './example-questions.json';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env || {};

function convertDate(d:string) {
  const dateObject = new Date(d);
  return dateObject.toISOString().slice(0, 19).replace('T', ' ');
}

export default async function seedTestDB() {
  if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
    throw new Error('missing database credentials');
  }

  if (!DATABASE_NAME.includes('_TEST')) {
    throw new Error('Invalid test database name');
  }

  await dbInitPromise;

  console.log('done initializing');

  const testDb = mysql.createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    port: +DATABASE_PORT,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    waitForConnections: true,
  });

  await Promise.all(
    data.map((product: any) => {
      const { product_id: productId } = product;
      return Promise.all(
        product.results.map((q: any) => (
          testDb.execute(`
            INSERT INTO questions
            (id, product_id, body, date_written, asker_name, reported, helpful) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            q.question_id,
            productId,
            q.question_body,
            convertDate(q.question_date),
            q.asker_name,
            q.reported,
            q.question_helpfulness,
          ])
            .then(() => (
              Promise.all(Object.values(q.answers).map((a:any) => (
                testDb.execute(`
                  INSERT INTO answers
                  (id, question_id, body, date_written, answerer_name, helpful) 
                  VALUES (?, ?, ?, ?, ?, ?)
                `, [
                  a.answer_id,
                  q.question_id,
                  a.body,
                  convertDate(a.date),
                  a.answerer_name,
                  a.helpfulness,
                ]).then(() => (
                  Promise.all(a.photos.map((p:any) => (
                    testDb.execute(`
                      INSERT INTO answer_photos (id, answer_id, url) 
                      VALUES (?, ?, ?)
                    `, [p.id, a.answer_id, p.url])
                  )))))))))))),
      );
    }),
  );

  return testDb;
}
