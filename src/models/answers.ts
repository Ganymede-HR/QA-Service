import type { ResultSetHeader } from 'mysql2';
import { db } from '../db';

const postAnswer = (
  {
    questionId,
    body,
    name,
    email,
    photos,
  } :
  {
    questionId: number;
    body: string;
    name: string;
    email: string;
    photos: string[];
  },
) => (
  db.execute<ResultSetHeader>(`
     INSERT INTO answers (question_id, body, answerer_name, answerer_email)
     VALUES (?, ?, ?, ?)
  `, [questionId, body, name, email])
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
    answerId,
  } :
  {
    answerId: number
  },
) => (
  db.query(`
    UPDATE answers SET helpful = helpful + 1 WHERE id = ?
  `, [answerId])
);

const reportAnswer = (
  {
    answerId,
  } :
  {
    answerId: number
  },
) => (
  db.query(`
    UPDATE answers SET reported = true WHERE id = ?
  `, [answerId])
);

export {
  postAnswer,
  markAnswerHelpful,
  reportAnswer,
};
