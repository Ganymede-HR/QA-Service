import { Router } from 'express';

const router = Router();

// GET question list
router.get('/', (req, res) => {
  res.send('question list');
});

// POST question
router.post('/', (req, res) => {
  res.status(201).send('post question');
});

// GET question answers
router.get('/:question_id/answers', (req, res) => {
  res.send(`answer list for question ${req.params?.question_id}`);
});

// POST a new answer
router.post('/:question_id/answers', (req, res) => {
  res.status(201).send(`post answer for question ${req.params?.question_id}`);
});

// PUT mark question helpful
router.put('/:question_id/helpful', (req, res) => {
  res.status(204).send(`put helpful for question ${req.params?.question_id}`);
});

// PUT report question
router.put('/:question_id/report', (req, res) => {
  res.status(204).send(`put report for question ${req.params?.question_id}`);
});

export default router;
