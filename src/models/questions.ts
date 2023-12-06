import type { RowDataPacket } from 'mysql2';
import type { GetQuestionsResultType, QuestionType } from '../types';
import db from '../db';

interface GetQuestionAnswersRawResult extends RowDataPacket {
  a_id: number;
  body: string;
  date_written: Date;
  answerer_name: string;
  helpfulness: number;
  id: number;
  url: string;
}
interface GetQuestionRawResult extends GetQuestionAnswersRawResult {
  question_id: number;
  question_body: number;
  question_date: Date;
  asker_name: string;
  question_helpfulness: number;
  reported: number;
  answer_row_num: number;
}

const getQuestions = async (
  {
    product_id,
    page = 1,
    count = 5,
  } :
  {
    product_id: number;
    page?: number;
    count?:number
  },
): Promise<GetQuestionsResultType> => {
  const offset = Math.max((page - 1) * count, 0);
  const rawResults = await db.query<GetQuestionRawResult[]>(`
    WITH qa AS (
      SELECT 
        q.id AS question_id,
        q.body AS question_body,
        q.date_written AS question_date,
        q.asker_name,
        q.helpful AS question_helpfulness,
        q.reported
      FROM questions q
      WHERE
        q.product_id = ?
        AND
        q.reported <> TRUE
      ORDER BY
        question_date
      LIMIT ?
      OFFSET ?
    )
    SELECT an.*, ap.id, ap.url
    FROM (
      SELECT 
        qa.*,
        a.id AS a_id,
        a.body,
        a.date_written,
        a.answerer_name,
        a.helpful AS helpfulness,
        -- counts rows to limit number of returned answers
        ROW_NUMBER() OVER (PARTITION BY qa.question_id ORDER BY a.date_written) AS answer_row_num
      FROM qa
      LEFT JOIN answers a ON a.question_id = qa.question_id
    ) AS an
    LEFT JOIN answer_photos ap ON ap.answer_id = an.a_id
    WHERE an.answer_row_num <= ?;
  `, [product_id, count, offset, count]);

  const transformedResultsObject = rawResults[0].reduce((acc: any, c) => {
    const answerPhoto = c.id ? {
      id: c.id,
      url: c.url,
    } : undefined;
    const answer = c.a_id ? {
      answer_id: c.a_id,
      body: c.body,
      date: c.date_written,
      answerer_name: c.answerer_name,
      helpfulness: c.helpfulness,
      photos: answerPhoto ? [answerPhoto] : [],
    } : undefined;
    if (acc[c.question_id] && c.a_id) {
      if (acc[c.question_id].answers[c.a_id]) {
        if (answerPhoto) {
          acc[c.question_id].answers[c.a_id].photos.push(answerPhoto);
        }
      } else if (acc[c.question_id].answers) {
        acc[c.question_id].answers = {
          ...acc[c.question_id].answers,
          [c.a_id]: answer,
        };
      } else {
        acc[c.question_id].answers = { [c.a_id]: answer };
      }
    } else {
      acc[c.question_id] = {
        question_id: c.question_id,
        question_body: c.question_body,
        question_date: c.question_date,
        asker_name: c.asker_name,
        question_helpfulness: c.question_helpfulness,
        reported: !!c.reported,
        answers: answer ? {
          [answer.answer_id]: answer,
        } : {
        },
      };
    }

    return acc;
  }, {});
  const transformedResults = Object.values(transformedResultsObject) as QuestionType[];
  return {
    product_id: `${product_id}`,
    results: transformedResults,
  };
};

const getQuestionAnswers = async (
  {
    question_id,
    page = 1,
    count = 5,
  } :
  {
    question_id: number,
    page?: number,
    count?: number,
  },
) => {
  const offset = Math.max((page - 1) * count, 0);
  const rawResult = await db.query<GetQuestionAnswersRawResult[]>(`
    WITH a AS (
      SELECT
        a.id AS a_id,
        a.body,
        a.date_written,
        a.answerer_name,
        a.helpful AS helpfulness
      FROM
        answers a
      WHERE
        a.question_id = ?
        AND
        a.reported <> TRUE
      ORDER BY
        date_written
      LIMIT ?
      OFFSET ?
    )
    SELECT a.*, ap.id, ap.url
    FROM a
    LEFT JOIN answer_photos ap ON a.a_id = ap.answer_id
  `, [question_id, count, offset]);
  const transformedResultsObject = rawResult[0].reduce((acc: any, c) => {
    const answerPhoto = c.id ? {
      id: c.id,
      url: c.url,
    } : undefined;
    if (acc[c.a_id]) {
      if (c.id) {
        acc[c.a_id].photos.push(answerPhoto);
      }
    } else {
      acc[c.a_id] = {
        answer_id: c.a_id,
        body: c.body,
        date: c.date_written,
        answerer_name: c.answerer_name,
        helpfulness: c.helpfulness,
        photos: answerPhoto ? [answerPhoto] : [],
      };
    }
    return acc;
  }, {});
  const transformedResults = Object.values(transformedResultsObject);
  return {
    question: `${question_id}`,
    page,
    count,
    results: transformedResults,
  };
};

const createQuestion = async () => {

};

const markQuestionHelpful = async () => {

};

const reportQuestion = async () => {

};

export {
  getQuestions,
  getQuestionAnswers,
  createQuestion,
  markQuestionHelpful,
  reportQuestion,
};
