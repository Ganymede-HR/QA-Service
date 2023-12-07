import type { ResultSetHeader } from 'mysql2';
import { db } from '../db';

const postAnswer = (
  {
    question_id,
    body,
    name,
    email,
    photos,
  } :
  {
    question_id: number;
    body: string;
    name: string;
    email: string;
    photos: string[];
  },
) => (
  db.execute<ResultSetHeader>(`
     INSERT INTO answers (question_id, body, answerer_name, answerer_email)
     VALUES (?, ?, ?, ?)
  `, [question_id, body, name, email])
    .then((result) => {
      const answerId = result[0].insertId;
      return db.query(
        `
        INSERT INTO answer_photos (answer_id, url) 
        VALUES ${photos.map(() => ('(?, ?)')).join(',')}
        `,
        photos.map((p) => [answerId, p]).flat(),
      );
    })
);

const markAnswerHelpful = (
  {
    question_id,
  } :
  {
    question_id: number
  },
) => (
  db.query(`
    UPDATE questions SET helpful = helpful + 1 WHERE id = ?
  `, [question_id])
);

const reportAnswer = (
  {
    question_id,
  } :
  {
    question_id: number
  },
) => (
  db.query(`
    UPDATE questions SET reported = true WHERE id = ?
  `, [question_id])
);

export {
  postAnswer,
  markAnswerHelpful,
  reportAnswer,
};
