import { Router } from 'express';
import {
  getQuestionAnswers,
  getQuestions,
  markQuestionHelpful,
  postQuestion,
  reportQuestion,
} from '../models/questions';
import { postAnswer } from '../models/answers';

const router = Router();

// GET question list
router.get('/', (req, res) => {
  const { product_id: productId, page, count } = req.query;

  if (!productId) {
    res.status(400).send('product_id required');
    return;
  }

  getQuestions(
    {
      productId: +productId,
      page: page ? +page : undefined,
      count: count ? +count : undefined,
    },
  )
    .then((data) => res.json(data))
    .catch((err) => {
      console.error('get questions err: ', err);
      res.sendStatus(500);
    });
});

// POST question
router.post('/', (req, res) => {
  const {
    body,
    name,
    email,
    product_id: productId,
  } = req.body;

  if (!productId) {
    res.status(400).send('product_id required');
    return;
  }

  postQuestion({
    body,
    name,
    email,
    productId: +productId,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('post question error: ', err);
      res.sendStatus(500);
    });
});

// GET question answers
router.get('/:questionId/answers', (req, res) => {
  const { questionId } = req.params;
  const { page, count } = req.query;

  getQuestionAnswers(
    {
      questionId: +questionId,
      page: page ? +page : undefined,
      count: count ? +count : undefined,
    },
  )
    .then((data) => res.json(data))
    .catch((err) => {
      console.error('get question answers err: ', err);
      res.sendStatus(500);
    });
});

// POST a new answer
router.post('/:questionId/answers', (req, res) => {
  const { questionId } = req.params;
  const {
    body,
    name,
    email,
    photos,
  } = req.body;

  postAnswer({
    questionId: +questionId,
    body,
    name,
    email,
    photos,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('post answer error: ', err);
      res.sendStatus(500);
    });
});

// PUT mark question helpful
router.put('/:questionId/helpful', (req, res) => {
  const { questionId } = req.params;

  markQuestionHelpful({ questionId: +questionId })
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error('question helpful error: ', err);
      res.sendStatus(500);
    });
});

// PUT report question
router.put('/:questionId/report', (req, res) => {
  const { questionId } = req.params;

  reportQuestion({ questionId: +questionId })
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error('question helpful error: ', err);
      res.sendStatus(500);
    });
});

export default router;
